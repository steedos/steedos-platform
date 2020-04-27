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
const GlobalMessage = ({ settings, location }: any) => {
    const classes = useStyles();

    

  return (
      <div className={classes.container}>
       {!settings.already_mail_service && <a href="https://developer.steedos.com/developer/steedos_config#%E9%82%AE%E4%BB%B6%E9%85%8D%E7%BD%AE" target="_blank"><FormError error="邮件服务未配置，点击查看帮助" /></a>}
      </div>
  )
};

function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(GlobalMessage);