import { accountsRest } from '../accounts';
import { getSettings } from '../selectors';

export function loadTenant(tenant) {
    return (dispatch) => {
        if(!tenant){
            const searchParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf("?")));
            tenant = searchParams.get("X-Space-Id");
            // if (!tenant) 
            //     tenant = localStorage.getItem("spaceId")
        }
        if (tenant) {
            accountsRest.fetch("tenant/" + tenant).then((tenantDoc) => {
                // if(tenantDoc.exists === false){
                //     dispatch({
                //         type: "UNEXISTS_TENANT"
                //     })
                // }else{
                //     dispatch({
                //         type: "RECEIVED_TENANT",
                //         data: tenantDoc,
                //     });
                // }

                dispatch({
                    type: "RECEIVED_TENANT",
                    data: tenantDoc,
                });
                
            }).catch((error) => {
                console.warn('Actions - loadTenant - recreived error: ', error)
            }); // eslint-disable-line no-empty-function
        }
    }
}
