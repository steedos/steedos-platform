import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getTenant, getSettings } from '../selectors';
import { getCurrentUser } from "../selectors/entities/users";
import { logout } from '../actions/users';
import { useLocation, useNavigate } from "react-router-dom";

const Logout = (props) => {
  const { tenant, logout } = props;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let redirect_uri = new URLSearchParams(location.search).get('redirect_uri');
    if (!redirect_uri) {
      redirect_uri = '/login';
    }

    if (tenant.page_logout) {
      redirect_uri = tenant.page_logout;
    }

    logout()
      .then(() => {
        if (redirect_uri.startsWith('http://') || redirect_uri.startsWith('https://')) {
          window.location.href = redirect_uri;
        } else {
          navigate(redirect_uri);
        }
      })
      .catch((e) => {
        console.error(e);
        if (redirect_uri.startsWith('http://') || redirect_uri.startsWith('https://')) {
          window.location.href = redirect_uri;
        } else {
          navigate(redirect_uri);
        }
      });
  }, [logout, navigate, location.search, tenant.page_logout]);

  return null;
};

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state),
  settings: getSettings(state),
  tenant: getTenant(state),
});

const mapDispatchToProps = {
  logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);