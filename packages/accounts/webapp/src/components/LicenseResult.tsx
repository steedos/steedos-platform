import React, { useState, useEffect } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Button, Typography, Box } from '@material-ui/core';
import { createStyles, Theme, makeStyles,lighten, darken  } from '@material-ui/core/styles';
import {FormattedMessage} from 'react-intl';
import { connect } from 'react-redux';
import { getTenant, getSettings } from '../selectors';
import { accountsClient, accountsRest } from '../accounts';
import clsx from 'clsx';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';

const useStyles = makeStyles((theme: Theme) => {
    const getColor = theme.palette.type === 'light' ? darken : lighten;
    return ({
        button: {
            margin: theme.spacing(0),
            padding: theme.spacing(0),
            top: -10,
            left: -5,
            color: theme.palette.text.hint,
            justifyContent: "left"
        },
        icon: {
            color: "#52c41a",
            fontSize: 80
        },
        formContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
    })
  });

const LicenseResult = ({ history, settings, tenant, location }: any) => {
  const classes = useStyles();
  const [data, setData] = useState<any>(history.location.state ? (history.location.state.data || {}) : {});
  return (
    <div className={classes.formContainer}>
      <CheckCircleRoundedIcon className={classes.icon} />
      <Box textAlign="center" fontWeight="fontWeightMedium" fontSize="h6.fontSize" m={1}>
        License 申请成功
      </Box>
      <Box textAlign="center" m={1}>
        企业名称: {data.spaceName}
      </Box>
      <Box textAlign="center" m={1}>
        授权期限: {data.start_date} 至 {data.end_date}
      </Box>
      {/* <br/>
      <Box textAlign="center" color='rgba(0,0,0,.45)' m={1}>
        请关闭当前窗口
      </Box> */}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
    settings: getSettings(state),
  };
}

export default connect(mapStateToProps)(LicenseResult);