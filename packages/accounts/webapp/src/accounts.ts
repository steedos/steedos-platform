import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { RestClient } from '@accounts/rest-client';

let apiHost = 'http://localhost:4000'
if (process.env.NODE_ENV == 'production') {
  apiHost = document.location.protocol + "//" + document.location.host
}

const accountsRest = new RestClient({
  apiHost: apiHost,
  rootPath: '/api/v4/accounts',
});
const accountsClient = new AccountsClient({}, accountsRest);
const accountsPassword = new AccountsClientPassword(accountsClient);

export { accountsClient, accountsRest, accountsPassword };
