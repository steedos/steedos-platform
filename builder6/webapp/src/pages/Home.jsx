import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from "../selectors/entities/users";
import { getCurrentSpace, getCurrentSpaceId } from "../selectors/entities/spaces";
import { useNavigate } from "react-router";
import { validate } from '../actions/users'


const getRedirectUrl = ()=>{
  const redirect = location.href.replace("/steedos/sign-in", "").replace("/accounts/a/#/logout", "");
  const u = new URL(redirect);
  u.searchParams.delete('no_redirect');
  u.searchParams.delete('X-Space-Id');
  u.searchParams.delete('X-Auth-Token');
  u.searchParams.delete('X-User-Id');
  return u.toString();
}

const goResetPassword = (navigate)=>{
    const redirect = getRedirectUrl();
    navigate("/update-password?redirect_uri=" + encodeURIComponent(redirect));
}

// 首页只是用来跳转
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUser);
  const currentSpace = useSelector(getCurrentSpace);
  const isOem = Builder.settings?.platform?.is_oem === true || Builder.settings?.platform?.is_oem === 'true';
  const licensedTo = Builder.settings?.platform?.licensed_to;
  document.title = (isOem && licensedTo) ? licensedTo : `Steedos`;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!currentSpace) {
      navigate('/select-space' + window.location.search);
      return;
    }

    dispatch(validate()).then((me)=>{
      Builder.settings.context.user = me.data;
      Builder.settings.context.authToken = me.data?.authToken;

      if(me.data?.password_expired){
        goResetPassword(navigate)
      }else{
        let redirect_uri = new URLSearchParams(location?location.search:"").get('redirect_uri');
        if (redirect_uri && redirect_uri != '/update-password'){
          window.location.href = redirect_uri;
        }else{
          window.location.href = '/app';
        }
      }

      // navigate('/app');
    })

  }, []);

  return null;
};

export default Home;