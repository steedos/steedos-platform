import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { getRequests } from '../selectors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
    },
  }),
);

const Loading = ({ requests }: any) =>{
  const classes = useStyles({});
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if(requests.status === 'started'){
      handleOpen();
    }else{
      handleClose();
    }
  }, [requests]);

  return (
    <div>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress />
      </Backdrop>
    </div>
  );
}


function mapStateToProps(state: any) {
    return {
      requests: getRequests(state)
    };
  }
  
export default connect(mapStateToProps)(Loading);