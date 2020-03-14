import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Paper, Link, Grid, createStyles, Theme, makeStyles, FormControl, InputLabel, Input, Button, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, ListItemSecondaryAction } from '@material-ui/core';
import { Image as ImageIcon, Work as WorkIcon, BeachAccess as BeachAccessIcon } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import FormError from './FormError';
import { getCookie } from '../utils/utils';
import { goInSystem } from '../client/index';
import { accountsClient, accountsRest } from '../accounts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 16,
      display: 'flex',
      flexDirection: 'column',
    },
    spaces: {
      flexGrow: 1,
      padding: 1,
      maxHeight: 300,
      overflow: 'auto',
    },
    paper: {
      maxWidth: 400,
      margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2),
    },
    text: {
      maxWidth: 150,
    },
    button: {
      marginTop: 28
    },
    gridItem: {
      padding: '6px !important'
    },
    gridItemText:{
      padding: '6px !important',
      display: 'flex',
      alignItems: 'center',
    },
    gridItemBtn:{
      padding: '6px !important',
      display: 'flex',
      alignItems: 'center',
    },
    listItem: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    logo: {
      width: "auto",
      height: 40,
    },
    margin: {
      margin: theme.spacing(0),
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      margin: "0 auto",
    }
  }),
);

const ChooseTenant = ({ settings, history, tenant, location }: any) => {
  const classes = useStyles();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState({ spaces: [], name: '' });
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    // refresh the session to get a new accessToken if expired
    const tokens = await accountsClient.refreshSession();
    if (!tokens) {
      history.push('/login');
      return;
    }
    const data = await accountsRest.authFetch('user', {});

    if (!data) {
      history.push('/login');
      return;
    }
    setUser(data);
  };

  const goCreateTenant = () => {
    history.push({
      pathname: `/create-tenant`,
      search: location.search,
    })
  }

  const chosenTenant = async (tenantId: string)=>{
    const token: any = await accountsClient.getTokens();
    try {
      let result = await accountsRest.authFetch('password/session', {
        method: 'POST',
        body: JSON.stringify({
          spaceId: tenantId,
          accessToken: token.accessToken
        }),
        credentials: "include"
      });
      localStorage.setItem("spaceId", tenantId);
      goInSystem(history, location, token.accessToken, settings.root_url);
    } catch (error) {
      console.log(error);
      history.push('/login');
      return;
    }
  }
  return (
    <div className={classes.root}>
      <div className={classes.spaces}>
        {
          user.spaces.map((item: any) =>
            <Paper className={classes.paper}>
              <Grid container wrap="nowrap" spacing={3}>
                <Grid className={classes.gridItem} item>
                  <Avatar src={item.logo_url || require("../assets/logo-square.png")} />
                </Grid>
                <Grid className={classes.gridItemText} item xs>
                    <Typography noWrap className={classes.text} >{item.name}</Typography>
                    {/* <Typography variant="body2" color="textSecondary" noWrap className={classes.text}>{user.name}</Typography> */}
                </Grid>
                <Grid className={classes.gridItemBtn} item>
                  <Button variant="contained" size="small" color="primary" className={classes.margin} onClick={()=>{chosenTenant(item._id)}}>
                    进入
                </Button>
                </Grid>
              </Grid>
            </Paper>
          )
        }
      </div>
      {tenant.enable_create_tenant && 
      <Button className={classes.button} onClick={goCreateTenant}>
        <FormattedMessage
          id='accounts.create_tenant'
          defaultMessage='Create Tenant'
        />
      </Button>
      }
    </div>
  );
};


function mapStateToProps(state: any) {
  return {
    settings: getSettings(state),
    tenant: getTenant(state)
  };
}

export default connect(mapStateToProps)(ChooseTenant);
