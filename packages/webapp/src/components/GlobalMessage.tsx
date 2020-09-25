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
    const classes = useStyles({});
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
      return false
    }

    const showMobileHelp = ()=>{
      if(settings.already_sms_service){
        return false
      }else{
        if(tenant.enable_bind_mobile){
          return true
        }
      }
      return false
    }

    const getMsg = ()=>{
      let msg = '';
      if(showEmailHelp()){
        msg = "accounts.emailHelp"
      }

      if(showMobileHelp()){
        if(msg){
          msg = msg + '_mobileHelp'
        }else{
          msg = "accounts.mobileHelp"
        }
        
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