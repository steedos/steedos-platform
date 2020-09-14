const en = require("../i18n/en.json");
const zhCN = require("../i18n/zh-CN.json");

export default {
  entities: {
    general: {
    },
    users: {
        currentUserId: '',
        users: {},
    },
    spaces: {
        currentSpaceId: '',
        spaces: {},
    },
  },
  i18n: {
      translations: {
          en: en,
          'zh-CN': zhCN
      }
  },
  settings: {
      services: {

      }
  },
  requests: {
      status: "not_started"
  },
}