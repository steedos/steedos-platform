const { requireAuthentication } = require("@steedos/core");

const express = require("express");
const router = express.Router();

function setSpaceUserPassword(userSession, space_user_id, space_id, password) {
  var canEdit,
    changedUserInfo,
    companyIds,
    companys,
    currentUser,
    e,
    isSpaceAdmin,
    lang,
    logout,
    ref,
    ref1,
    ref2,
    space,
    spaceUser,
    userCP,
    userId,
    user_id;
  if (!userSession.userId) {
    throw new Meteor.Error(400, "请先登录");
  }
  spaceUser = db.space_users.findOne({
    _id: space_user_id,
    space: space_id,
  });
  userId = userSession.userId;
  canEdit = spaceUser.user === userId;
  if (!canEdit) {
    space = db.spaces.findOne({
      _id: space_id,
    });
    isSpaceAdmin =
      space != null
        ? (ref = space.admins) != null
          ? ref.includes(userSession.userId)
          : void 0
        : void 0;
    canEdit = isSpaceAdmin;
  }
  companyIds = spaceUser.company_ids;
  if (!canEdit && companyIds && companyIds.length) {
    companys = Creator.getCollection("company")
      .find(
        {
          _id: {
            $in: companyIds,
          },
          space: space_id,
        },
        {
          fields: {
            admins: 1,
          },
        }
      )
      .fetch();
    if (companys && companys.length) {
      canEdit = _.any(companys, function (item) {
        return item.admins && item.admins.indexOf(userId) > -1;
      });
    }
  }
  if (!canEdit) {
    throw new Meteor.Error(400, "您没有权限修改该用户密码");
  }
  user_id = spaceUser.user;
  userCP = db.users.findOne({
    _id: user_id,
  });
  currentUser = db.users.findOne({
    _id: userSession.userId,
  });
  if (
    spaceUser.invite_state === "pending" ||
    spaceUser.invite_state === "refused"
  ) {
    throw new Meteor.Error(400, "该用户尚未同意加入该工作区，无法修改密码");
  }
  logout = true;
  if (userSession.userId === user_id) {
    logout = false;
  }
  Accounts.setPassword(
    user_id,
    {
      algorithm: "sha-256",
      digest: password,
    },
    {
      logout: logout,
    }
  );
  changedUserInfo = db.users.findOne({
    _id: user_id,
  });
  if (changedUserInfo) {
    db.users.update(
      {
        _id: user_id,
      },
      {
        $push: {
          "services.password_history":
            (ref1 = changedUserInfo.services) != null
              ? (ref2 = ref1.password) != null
                ? ref2.bcrypt
                : void 0
              : void 0,
        },
      }
    );
  }
  if (userCP.mobile && userCP.mobile_verified) {
    lang = "en";
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
      msg: TAPi18n.__("sms.change_password.template", {}, lang),
    });
  }
  try {
    return Creator.getCollection("operation_logs").insert({
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
  } catch (_error) {
    e = _error;
    return console.error(e);
  }
}

router.post(
  "/api/user/setSpaceUserPassword",
  requireAuthentication,
  async function (req, res) {
    const userSession = req.user;
    let { space_user_id, space_id, password } = req.body;
    try {
      return Fiber(function () {
        setSpaceUserPassword(userSession, space_user_id, space_id, password);
        return res.status(200).send({ success: true });
    }).run();;
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

exports.default = router;
