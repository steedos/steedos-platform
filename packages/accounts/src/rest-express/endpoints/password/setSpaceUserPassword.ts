/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-19 11:38:30
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2025-03-04 10:35:09
 * @Description:
 */
import { t } from "@steedos/i18n";
import { getObject } from "@steedos/objectql";
import * as express from "express";
import * as _ from "lodash";
import { bcryptPassword } from "../../../password/utils";
import { AccountsServer } from "../../../server";

declare var SMSQueue;

export const setSpaceUserPassword =
  (accountsServer: AccountsServer) =>
  async (req: express.Request, res: express.Response) => {
    const userSession = (req as any).user;
    let { space_user_id, space_id, password } = req.body;
    try {
      if (!userSession) {
        res.status(401);
        res.json({ message: "Unauthorized" });
        return;
      }
      const spaceUser = await getObject("space_users").findOne(space_user_id);
      const userId = userSession.userId;
      let canEdit = spaceUser.user === userId;
      if (!canEdit) {
        const space = await getObject("spaces").findOne(space_id);
        const isSpaceAdmin = space?.admins?.includes(userSession.userId);
        canEdit = isSpaceAdmin;
      }
      const companyIds = spaceUser.company_ids;
      if (!canEdit && companyIds && companyIds.length) {
        const companys = await getObject("company").find({
          filters: [
            ["_id", "in", companyIds],
            ["space", "=", space_id],
          ],
          fields: ["admins"],
        });
        if (companys && companys.length) {
          canEdit = _.some(companys, function (item) {
            return item.admins && item.admins.indexOf(userId) > -1;
          });
        }
      }
      if (!canEdit) {
        throw new Error("您没有权限修改该用户密码");
      }
      const user_id = spaceUser.user;
      const userCP = await getObject("users").findOne(user_id);
      if (
        spaceUser.invite_state === "pending" ||
        spaceUser.invite_state === "refused"
      ) {
        throw new Error("该用户尚未同意加入该工作区，无法修改密码");
      }
      let logout = true;
      if (userSession.userId === user_id) {
        logout = false;
      }
      const bcryptedPassword = await bcryptPassword(password);
      const servicePassword: any = accountsServer.getServices().password;
      await servicePassword.db.setPassword(user_id, bcryptedPassword);
      const changedUserInfo = await getObject("users").findOne(user_id);
      if (changedUserInfo?.services?.password?.bcrypt) {
        await getObject("users").update(user_id, {
          $push: {
            "services.password_history":
              changedUserInfo.services.password.bcrypt,
          },
        });
      }
      if (userCP.mobile && userCP.mobile_verified) {
        let lang = "en";
        if (userCP.locale === "zh-cn") {
          lang = "zh-CN";
        }
        SMSQueue.send({
          Format: "JSON",
          Action: "SingleSendSms",
          ParamString: "",
          RecNum: userCP.mobile,
          SignName: "华炎办公",
          TemplateCode: "SMS_67200967",
          msg: t("sms.change_password.template", {}, lang),
        });
      }
      try {
        await getObject("operation_logs").insert({
          name: "修改密码",
          type: "change_password",
          remote_user: userId,
          status: "success",
          space: space_id,
          message:
            "[系统管理员]修改了用户[" +
            (changedUserInfo != null ? changedUserInfo.name : void 0) +
            "]的密码",
          data: JSON.stringify({
            changeUser: user_id,
          }),
          related_to: {
            o: "users",
            ids: [user_id],
          },
        });
      } catch (e) {
        console.error(e);
      }
      return res.json({
        status: 0,
        msg: "",
        data: {},
      });
    } catch (e) {
      return res.json({
        status: -1,
        msg: e.message,
        data: {},
      });
    }
  };
