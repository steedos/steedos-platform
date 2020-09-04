import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { RestClient } from '@accounts/rest-client';

let accountsApiHost = process.env.REACT_APP_API_URL!
if (process.env.NODE_ENV == 'production') {
  accountsApiHost = document.location.protocol + "//" + document.location.host
}

const accountsRest = new RestClient({
  apiHost: accountsApiHost,
  rootPath: '/accounts',
});
const accountsClient = new AccountsClient({}, accountsRest);
const accountsPassword = new AccountsClientPassword(accountsClient);

export { accountsClient, accountsRest, accountsPassword };
