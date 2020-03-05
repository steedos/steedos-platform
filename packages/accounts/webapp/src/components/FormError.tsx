import React, { SyntheticEvent } from 'react';
import { Typography, IconButton, Snackbar, SnackbarContent, Button } from '@material-ui/core';
import { amber, green } from '@material-ui/core/colors';
import {FormattedMessage} from 'react-intl';
import clsx from 'clsx';
import {CheckCircleOutline, ErrorOutline, InfoOutlined, CloseOutlined, WarningOutlined} from '@material-ui/icons';
import { makeStyles, Theme, withStyles, lighten, darken } from '@material-ui/core/styles';

const variantIcon:any = {
  success: CheckCircleOutline,
  warning: WarningOutlined,
  error: ErrorOutline,
  info: InfoOutlined,
};

const useStyles1 = makeStyles((theme: Theme) => {

  const getColor = theme.palette.type === 'light' ? darken : lighten;
  const getBackgroundColor = theme.palette.type === 'light' ? lighten : darken;

  return ({
    success: {
      backgroundColor: green[600],
    },
    error: {
      color: getColor(theme.palette.error.main, 0.6),
      backgroundColor: getBackgroundColor(theme.palette.error.main, 0.9),
      '& $icon': {
        color: theme.palette.error.main,
      },
    },
    info: {
      backgroundColor: theme.palette.primary.main,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  })
});

export interface Props {
  className?: string;
  message: string;
  onClose?: () => void;
  variant: keyof typeof variantIcon;
}

function MySnackbarContentWrapper(props: Props) {
  const classes: any = useStyles1();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];
  return (
    <SnackbarContent elevation={0}
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          <FormattedMessage
          id={message}
          defaultMessage={message} 
        /> 
        </span>
      }
      // action={[
      //   <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
      //     <Close className={classes.icon} />
      //   </IconButton>,
      // ]}
      {...other}
    />
  );
}

const useStyles2 = makeStyles((theme: Theme) => ({
  margin: {
    // marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const useStyles = makeStyles({
  formError: {
    color: 'red',
  },
});

// interface Props {
//   error: string;
// }

const FormError = ({ error }: any) => {
  const classes = useStyles2();

  
  return <MySnackbarContentWrapper
  variant="error"
  className={classes.margin}
  message={error}
/>;
};

export default FormError;
