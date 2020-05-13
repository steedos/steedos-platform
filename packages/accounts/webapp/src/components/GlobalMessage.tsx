import * as React from 'react';
import { Typography, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { makeStyles } from '@material-ui/styles';
import FormError from './FormError';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'absolute',
        '& $div': {
            borderRadius: 0,
            flexDirection: 'column',
        },
    }
});
const GlobalMessage = ({ settings, tenant, location }: any) => {
    const classes = useStyles();
    const showEmailHelp = ()=>{
      if(settings.already_mail_service){
        return false
      }else{
        if(tenant.enable_bind_email){
          return true
        }
        if(tenant.enable_forget_password && (!tenant.enable_bind_mobile || tenant.enable_bind_email === true)){
          return true
        }
      }
    }

    const showMobileHelp = ()=>{
      if(settings.already_sms_service){
        return false
      }else{
        if(tenant.enable_bind_mobile){
          return true
        }
      }
    }

    const getMsg = ()=>{
      let msg = '';
      if(showEmailHelp()){
        msg = "邮件服务未配置，<email_help>点击查看帮助</email_help>"
      }

      if(showMobileHelp()){
        if(msg){
          msg = msg + '；'
        }
        msg = msg + "短信服务未配置，<mobile_help>点击查看帮助</mobile_help>  "
      }
      return msg;
    }
    

  return (
      <div className={classes.container}>
       {(showEmailHelp() || showMobileHelp()) && <FormError error={getMsg()} />}
      </div>
  )
};

function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state)
  };
}

export default connect(mapStateToProps)(GlobalMessage);