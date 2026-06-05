import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { getCurrentUser } from "../selectors/entities/users";
import { getCurrentSpaceId } from "../selectors/entities/spaces";
import Loading from './Loading';
import { useNavigate } from "react-router-dom";

const LoggedIn = ({ children }) => {
  const currentUser = useSelector(getCurrentUser);
  const tenant = useSelector(getTenant);
  const settings = useSelector(getSettings);
  const currentSpaceId = useSelector(getCurrentSpaceId);
  const navigate = useNavigate();

  useEffect(() => {
    // Tell the desktop app the webapp is ready
    window.postMessage(
      {
        type: 'webapp-ready',
      },
      window.location.origin,
    );

    if (!currentUser) {
      navigate('/login?redirect_uri=' + encodeURIComponent(window.location.pathname + window.location.search));
      return
    }
    if (!currentSpaceId) {
      navigate('/select-space' + window.location.search);
      return
    }
  }, [currentUser]);

  const isValidState = () => {
    return currentUser != null;
  };

  if (!isValidState()) {
    return <Loading />;
  }

  return children;
};

LoggedIn.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoggedIn;