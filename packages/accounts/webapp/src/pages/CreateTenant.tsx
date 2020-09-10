import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { createStyles, Theme, makeStyles, FormControl, InputLabel, Input, Button} from '@material-ui/core';
import { useIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import FormError from '../components/FormError';
import { getCookie, fixRootUrl } from '../utils/utils';
import Logo from '../components/Logo';
import Card from '../components/Card';



const LogInLink = React.forwardRef<Link, any>((props, ref) => (
  <Link to={{ pathname: "/login", search: window.location.hash.substring(window.location.hash.indexOf("?")) }} {...props} ref={ref} />
));

const CreateTenant = ({ settings, history, tenant, location }: any) => {
  
  const [error, setError] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | "">("");
  const intl = useIntl();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    // setError(null);
    // try {

    //   if (!tenantName.trim()) {
    //     throw new Error('accounts.tenantNameRequired');
    //   }

    //   const route = 'api/v4/spaces/register/tenant';
    //   const fetchOptions: any = {
    //     headers: {
    //       "X-User-Id": getCookie("X-User-Id"),
    //       "X-Auth-Token": getCookie("X-Auth-Token")
    //     },
    //     method: "POST",
    //     body: JSON.stringify({
    //       name: tenantName
    //     }),
    //     credentials: 'include'
    //   };
    //   const res: any = await fetch(
    //     `${fixRootUrl(settings.root_url)}/${route}`,
    //     fetchOptions
    //   );
    //   const token: any = await accountsClient.getTokens();
    //   if (res) {
    //     if (res.status >= 400 && res.status < 600) {
    //       const { message } = await res.json();
    //       throw new Error(message);
    //     }
    //     const resJson = await res.json();
    //     let spaceId = resJson.value;
    //     try {
    //       let result = await accountsRest.authFetch('password/session', {
    //         method: 'POST',
    //         body: JSON.stringify({
    //           spaceId,
    //           accessToken: token.accessToken
    //         }),
    //         credentials: "include"
    //       });
    //       localStorage.setItem("spaceId", spaceId);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   } else {
    //     throw new Error('Server did not return a response');
    //   }
    //   // goInSystem(history, location, token.accessToken, settings.root_url, true);
    // } catch (err) {
    //   setError(err.message);
    // }
  };

  useEffect(() => {
    checkCreateTenant();
  }, []);
  const checkCreateTenant = async () => {
    if(!tenant.enable_create_tenant){
      history.push('/');
    }
  };
  return (
<Card>

    <Logo/>
  
    <h2 className="my-2 text-left text-2xl leading-9 font-extrabold text-gray-900">
      <FormattedMessage
          id='accounts.title.createTenant'
          defaultMessage='Create Tenant'
        />
    </h2>
    
    <form onSubmit={onSubmit} className="mt-4">


        <div className="rounded-md shadow-sm my-2">
          <div>
            <input 
              aria-label={intl.formatMessage({id: 'accounts.tenant_name'})}
              id="tenantName"
              name="tenantName" 
              value={tenantName}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border-b border-gray-500 bg-blue-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5" 
              placeholder={intl.formatMessage({id: 'accounts.tenant_name'})}
              onChange={e => setTenantName(e.target.value)}
            />
          </div>
        </div>
        
        {error && <FormError error={error!} />}

        <div className="mt-6 flex justify-end">
          <button type="submit" className="group relative w-32 justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-none text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out">
            <FormattedMessage
              id='accounts.next'
              defaultMessage='Next'
            />
          </button>
        </div>
      </form>
  </Card>
  );
};


function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state)
  };
}

export default connect(mapStateToProps)(CreateTenant);
