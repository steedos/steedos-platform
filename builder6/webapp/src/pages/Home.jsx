import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTenant, getSettings, getSettingsTenantId } from '../selectors';
import { getCurrentUser } from "../selectors/entities/users";
import { getCurrentSpace, getCurrentSpaceId } from "../selectors/entities/spaces";
import { useNavigate } from "react-router";
import { validate } from '../actions/users'

// 首页只是用来跳转
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUser);
  const currentSpace = useSelector(getCurrentSpace);
  const currentSpaceId = useSelector(getCurrentSpaceId);
  const tenant = useSelector(getTenant);
  const settings = useSelector(getSettings);
  const settingsTenantId = useSelector(getSettingsTenantId);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!currentSpace) {
      navigate('/select-space');
      return;
    }

    dispatch(validate()).then((me)=>{
      Builder.settings.context.user = me.data;
      navigate('/app');
    })

  }, []);

  return null;
};

export default Home;