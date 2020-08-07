import * as React from "react";
import { Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";
import { getSettings, getTenant } from "../selectors";
import { makeStyles } from "@material-ui/styles";
// import { t } from '../client/i18n'
import { FormattedMessage } from 'react-intl';
import { localizeMessage } from '../utils/utils'

const pathMap: any = {
  "/login": "accounts.title.login",
  "/login-code": "accounts.title.login",
  "/login-password": "accounts.title.login",
  "/signup": "accounts.title.signup",
  "/signup-password": "accounts.title.signup",
  "/create-tenant": "accounts.title.createTenant",
  "/reset-password": "accounts.title.resetPassword",
  "/update-password": "accounts.title.updatePassword",
  "/verify-email": "accounts.title.verifyEmail",
  "/set-name": "accounts.title.setName",
  "/choose-tenant": "accounts.title.chooseTenant",
  "/verify-mobile": "accounts.title.verifyMobile",
  "/verify": "accounts.title.verify",
};
const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: "0 auto",
  },
});

const getTitle = (key: string) => {
  let pathTitle = pathMap[key];

  if (key.startsWith("/verify/")) {
    pathTitle = pathMap["/verify"];
  }

  if (key.startsWith("/verify-mobile/")) {
    pathTitle = pathMap["/verify-mobile"];
  }
  return pathTitle;
};

const Title = ({ tenant, location }: any) => {
  const classes = useStyles();

  let pathTitle = localizeMessage(getTitle(location.pathname));
  
  document.title = pathTitle ? `${pathTitle} | ${tenant.name}` : tenant.name;
  let messageId = getTitle(location.pathname);
  // console.log("messageId", messageId);
  return (
    <div className={classes.container}>
      {!location.pathname.startsWith("/verify/") && (
        <h4 className={classes.title}><FormattedMessage id={messageId}/></h4>
      )}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Title);
