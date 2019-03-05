(function() {
  Creator.Objects.users = {
    name: "users",
    label: "用户",
    icon: "user",
    enable_api: true,
    fields: {
      avatar: {
        label: '头像',
        type: 'avatar',
        group: '-'
      },
      avatarUrl: {
        label: '头像URL',
        type: 'text',
        omit: true
      },
      name: {
        label: "姓名",
        type: "text",
        required: true,
        searchable: true,
        index: true
      },
      company: {
        type: "text",
        label: '公司',
        required: true
      },
      position: {
        type: "text",
        label: '职务',
        required: true
      },
      mobile: {
        type: "text",
        label: '手机',
        group: '-',
        required: true,
        readonly: true
      },
      mobile2: {
        type: "text",
        label: '手机',
        required: true,
        hidden: true,
        group: '-'
      },
      wechat: {
        type: "text",
        label: '微信号'
      },
      work_phone: {
        type: "text",
        label: '座机'
      },
      email: {
        type: "text",
        label: '邮件'
      },
      email2: {
        type: "text",
        label: '邮件',
        required: true
      },
      location: {
        label: '地址',
        type: 'location',
        system: 'gcj02',
        required: true
      },
      voice: {
        label: '语音介绍',
        type: 'audio',
        group: '-'
      },
      self_introduction: {
        type: 'textarea',
        is_wide: true,
        label: "个人简介",
        group: '-'
      },
      photos: {
        label: '照片',
        type: 'image',
        multiple: true,
        max: 9,
        group: '-'
      },
      card_published: {
        label: "名片已发布",
        type: "boolean",
        omit: true
      },
      profile: {
        type: '[Object]',
        label: '用户信息',
        omit: true
      },
      'profile.sex': {
        type: 'select',
        label: '性别',
        options: [
          {
            label: '男',
            value: '男'
          }, {
            label: '女',
            value: '女'
          }
        ],
        group: '-'
      },
      'profile.birthdate': {
        type: 'date',
        label: '生日'
      },
      'profile.avatar': {
        type: 'text',
        label: '头像',
        group: '-'
      },
      qrcode: {
        type: 'image',
        label: '二维码'
      },
      sex: {
        type: 'select',
        label: '性别',
        options: [
          {
            label: '男',
            value: '男'
          }, {
            label: '女',
            value: '女'
          }
        ],
        group: '-'
      },
      birthday: {
        type: 'date',
        label: "生日"
      },
      live: {
        type: 'selectCity',
        label: "现居地"
      },
      hometown: {
        type: 'selectCity',
        label: "家乡"
      },
      age: {
        type: 'number',
        label: "年龄",
        hidden: true
      },
      zodiac: {
        type: 'text',
        label: "生肖",
        hidden: true
      },
      constellation: {
        type: 'text',
        label: "星座",
        hidden: true
      },
      friends_count: {
        label: '好友个数',
        type: 'number',
        omit: true
      },
      heart_count: {
        label: '点赞数',
        type: 'number',
        omit: true
      },
      tags: {
        label: '好友标签',
        type: 'text',
        multiple: true,
        omit: true
      },
      username: {
        type: 'text',
        unique: true,
        omit: true
      },
      steedos_id: {
        type: 'text',
        unique: true,
        readonly: true,
        omit: true
      },
      locale: {
        label: "语言",
        type: "select",
        allowedValues: ["en-us", "zh-cn"],
        options: [
          {
            label: "简体中文",
            value: "zh-cn"
          }, {
            label: "English",
            value: "en-us"
          }
        ]
      },
      email_notification: {
        label: "接收邮件通知",
        type: "boolean"
      },
      primary_email_verified: {
        type: "boolean",
        omit: true,
        hidden: true
      },
      last_logon: {
        type: 'date',
        omit: true,
        hidden: true
      },
      is_cloudadmin: {
        type: "boolean",
        omit: true,
        hidden: true
      },
      is_deleted: {
        type: "boolean",
        omit: true,
        hidden: true
      }
    },
    list_views: {
      all: {
        label: '所有',
        columns: ["name", "username"],
        filter_scope: "all",
        filters: [["_id", "=", "{userId}"]]
      }
    },
    triggers: {
      "before.update.server.user": {
        on: "server",
        when: "before.update",
        todo: function(userId, doc, fieldNames, modifier, options) {
          var profileAvatar, ref, user;
          profileAvatar = ((ref = modifier.$set.profile) != null ? ref.avatar : void 0) || modifier.$set["profile.avatar"];
          if (modifier.$set.avatar) {
            return modifier.$set.avatarUrl = "/api/files/avatars/" + modifier.$set.avatar;
          } else if (profileAvatar) {
            user = Creator.getCollection("users").findOne({
              _id: userId
            }, {
              fields: {
                avatarUrl: 1
              }
            });
            if (!user.avatarUrl) {
              return modifier.$set.avatarUrl = profileAvatar;
            }
          }
        }
      }
    },
    permission_set: {
      guest: {
        allowCreate: false,
        allowDelete: false,
        allowEdit: true,
        allowRead: true,
        modifyAllRecords: false,
        viewAllRecords: true
      }
    }
  };
}).call(this);