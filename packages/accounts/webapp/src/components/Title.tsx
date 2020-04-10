import * as React from 'react';
import { Typography, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { makeStyles } from '@material-ui/styles';

const pathMap:any = {
    "/login": "登录",
    "/login-code": "登录",
    "/login-password": "登录",
    "/signup": "注册",
    "/create-tenant": "创建企业",
    "/reset-password": "验证码登录",
    "/update-password": "修改密码",
    "/verify-email": "验证邮箱",
    "/set-name": "填写姓名",
    "/choose-tenant": "选择企业",
    "/verify-mobile": "绑定手机号",
    "/verify": "验证"
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

const getTitle = (key: string)=>{
  let pathTitle = pathMap[key];

  if(key.startsWith("/verify/")){
      pathTitle = pathMap['/verify'];
  }

  if(key.startsWith("/verify-mobile/")){
    pathTitle = pathMap['/verify-mobile'];
  }
  return pathTitle;
}

const Title = ({ tenant, location }: any) => {
    const classes = useStyles();

    let pathTitle = getTitle(location.pathname);

    document.title = pathTitle ? `${pathTitle} | ${tenant.name}` : tenant.name;

  return (
      <div className={classes.container}>
        {!location.pathname.startsWith("/verify/") && <h4 className={classes.title}>
            {getTitle(location.pathname)}
        </h4>}
      </div>
  )
};

function mapStateToProps(state: any) {
  return {
      tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Title);