import {
  Login,
  ApplyCode,
  goInSystem,
  getBrowserLocale,
  getBrowserLng
} from './utils'

import ClientClass4, {DEFAULT_LIMIT_AFTER, DEFAULT_LIMIT_BEFORE, HEADER_X_VERSION_ID} from './client4';

const Client4 = new ClientClass4();

export {
  Client4, DEFAULT_LIMIT_AFTER, DEFAULT_LIMIT_BEFORE, HEADER_X_VERSION_ID,
  Login,
  ApplyCode,
  goInSystem,
  getBrowserLocale,
  getBrowserLng
}
