import en from '../i18n/en.json';
import zhCN from '../i18n/zh-CN.json';

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