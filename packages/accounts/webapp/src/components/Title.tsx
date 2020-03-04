import * as React from 'react';
import { Typography, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { makeStyles } from '@material-ui/styles';

const pathMap:any = {
    "/login": "登录",
    "/signup": "注册",
    "/login-password": "忘记密码",
    "/create-tenant": "创建工作区",
    "/reset-password": "重置密码",
    "/update-password": "修改密码",
    "/verify-email": "验证邮箱"
  }
  const useStyles = makeStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      margin: "0 auto",
    }
  });
const Title = ({ tenant, location }: any) => {
    console.log('Title',location);
    const classes = useStyles();
  return (
      <div className={classes.container}>
        <h4 className={classes.title}>
            {pathMap[location.pathname]}
        </h4>
      </div>
  )
};

function mapStateToProps(state: any) {
  return {
      tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Title);