import React, { useContext } from "react";
import { StateContext } from "./App";
import Chip from '@material-ui/core/Chip';
import LockOpen from '@material-ui/icons/LockOpen';
import FaceIcon from '@material-ui/icons/Face';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const handleClick = () => {
  window.location = '/login';
};

const handleTutorial = () => {
  window.location = '/tutorial';
};
const handleApparel = () => {
  //window.location = 'https://www.bonfire.com/hashkings-community-shirts/';
  window.open('https://www.bonfire.com/hashkings-community-shirts/');
};


const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export const AppInlineProfile = () => {
  const {username} = useContext(StateContext);

  const handleDelete = () => {
    alert('Need to sign out? Please clear your cache to sign out completely.');
  };

  if (!username) {
    return (
      <div className="profile">
      <Tooltip title="Visit Bonfire.com" placement="left">
      <Chip
        label= "Hoodies For Sale!"
        onClick={handleApparel}
      />
      </Tooltip>
        <Tooltip title="Please Sign In to Begin" placement="left">
      <Chip
        icon={<LockOpen />}
        color="primary"
        label= "Not signed in"
        onClick={handleClick}
      />
      </Tooltip>
      <br/>
    </div>
    );
  } else {
  return (
    <div className="profile">     
      <Tooltip title="Start Tutorial" placement="left">
      <Chip
        label= "New to Hashkings?"
        onClick={handleTutorial}
        color="primary"
      />
      </Tooltip>
      <Tooltip title="Visit Bonfire.com" placement="bottom">
      <Chip
        label= "Hoodies For Sale!"
        onClick={handleApparel}
      />
      </Tooltip>
      <Tooltip title="Signed In" placement="bottom">
      <Chip
        icon={<FaceIcon />}
        label= {username}
        color="primary"
        onDelete={handleDelete}
      />
      </Tooltip>
    </div>
  );
  }
};
