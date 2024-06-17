/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-06-14 10:28:33
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-06-14 10:36:52
 * @FilePath: /steedos-platform-2.3/services/standard-space/src/triggers/space_users_trigger.js
 * @Description: 
 */
"use strict";
const Fiber = require("fibers");

/**
 * 开启oidc服务后，新增人员后在触发器中发送keycloak邀请邮件
 */
module.exports = {
    trigger: {
        listenTo: 'space_users',
        when: [
            'afterInsert'
        ]
    },
    async handler(ctx) {
        const {
            STEEDOS_IDENTITY_OIDC_ENABLED,
            STEEDOS_IDENTITY_OIDC_CONFIG_URL,
            STEEDOS_IDENTITY_OIDC_CLIENT_ID,
            MAIL_URL,                        // 发件人的电子邮件配置
            ROOT_URL,                        // ROOT_URL
        } = this.settings;

        // 开启oidc才发送邮件
        if (
            (true != STEEDOS_IDENTITY_OIDC_ENABLED && "true" != STEEDOS_IDENTITY_OIDC_ENABLED)
            || !STEEDOS_IDENTITY_OIDC_CONFIG_URL || !STEEDOS_IDENTITY_OIDC_CLIENT_ID || !MAIL_URL || !ROOT_URL
        ) {
            return;
        }

        const { doc, userId, spaceId } = ctx.params;

        const { email } = doc

        const suObj = this.getObject("space_users")
        const spaceObj = this.getObject("spaces")
        const suDoc = await suObj.findOne({
            filters: [
                ["space", "=", spaceId],
                ["user", "=", userId]
            ]
        })
        const spaceDoc = await spaceObj.findOne(spaceId)

        // 发送邀请邮件的函数
        const sendInvitationEmail = async (email) => {
            const parts = STEEDOS_IDENTITY_OIDC_CONFIG_URL.split("/.well-known");
            const registerUrl = `${parts[0]}/protocol/openid-connect/registrations?client_id=${STEEDOS_IDENTITY_OIDC_CLIENT_ID}&scope=openid%20profile&redirect_uri=${ROOT_URL}&response_type=code`;

            const mailOptions = {
                from: `"${suDoc.name}" <noreply@steedos.com>`,              // 发件人地址
                to: email,                                                  // 收件人地址
                subject: `${suDoc.name} 邀请您加入 ${spaceDoc.name}`,            // 主题
                html: `<p>你好，${suDoc.name} 邀请您加入 ${spaceDoc.name}。请点击以下链接登录：</p>
                        <p><a href="${ROOT_URL}">${ROOT_URL}</a></p>
                        <p>如果没有账号请点击以下链接创建账号：</p>
                        <p><a href="${registerUrl}">${registerUrl}</a></p>` // HTML内容
            };

            try {
                Fiber(function () {
                    MailQueue.send(mailOptions);
                }).run();
            } catch (error) {
                console.error('发送邮件失败:', error);
            }
        };

        await sendInvitationEmail(email);

    }
}