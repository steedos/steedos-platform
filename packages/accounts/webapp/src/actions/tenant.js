import { accountsRest } from '../accounts';
import { getSettings } from '../selectors';

export function loadTenant() {
    return (dispatch) => {
        const searchParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf("?")));
        let tenant = searchParams.get("tenant");
        if (!tenant) 
            tenant = localStorage.getItem("spaceId")
        if (tenant) {
            accountsRest.fetch("tenant/" + tenant).then((tenantDoc) => {
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
