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
       {!settings.already_mail_service && <FormError error="请配置邮件服务" />}
      </div>
  )
};

function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(GlobalMessage);