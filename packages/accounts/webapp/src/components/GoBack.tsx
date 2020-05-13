import * as React from 'react';
import { Typography, Button, Link } from '@material-ui/core';
import { createStyles, Theme, makeStyles,lighten, darken  } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import { FormattedMessage } from 'react-intl';
import { ArrowBackIosOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { canBack } from '../utils/utils'

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
        leftIcon: {
            marginRight: theme.spacing(0),
        },
        rightIcon: {
            marginLeft: theme.spacing(1),
        },
        iconSmall: {
            fontSize: '1.3rem',
        }
    })
  });


const GoBack = ({ tenant, history, location }: any) => {
    const classes:any = useStyles();
    const goBack = function () {
        if (history.length < 2 || !canBack()) {
            history.replace({
                pathname: `/login`,
                search: location.search,
            })
        } else {
            history.goBack();
        }
    }

    let showBack =  ['/login', '/login/home', '/'].indexOf(location.pathname) < 0

    return (
        <div>
            {showBack && <Button
            className={classes.button} 
            onClick={goBack}
            size="small"
            ><ArrowBackIosOutlined className={clsx(classes.leftIcon, classes.iconSmall)} />
            <FormattedMessage
                    id='accounts.goBack'
                    defaultMessage='Back'
                />
            </Button>
            }
        </div>
    )
};


function mapStateToProps(state: any) {
    return {
        tenant: getTenant(state),
    };
}

export default connect(mapStateToProps)(GoBack);