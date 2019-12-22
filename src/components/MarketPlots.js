import React, {useContext, useState, useEffect} from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import {HashkingsAPI} from "../service/HashkingsAPI";
import {StateContext} from "../App";
import Delegate from "./Delegate";
import BuyGarden from "./BuyGarden";
import { Redirect } from 'react-router';
import { createMuiTheme, makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import { GerminateIcon } from './Icons';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    backgroundColor: "#294A0B",
  },
  paperBlack: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    backgroundColor: "#154A4A"
  },
  paperBlacky: {
    padding: theme.spacing(1),
    backgroundColor: "#000000",
  },
  card: {
    maxWidth: 600,
    backgroundColor: "#154A4A",
  },
  media: {
    height: 140,
  },
  font: {
    fontFamily: '"Jua", sans-serif',
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#00211B' }, // custom color in hex 
  },
});

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#000000",
    color: '#DFB17B',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export const MarketPlots = () => {
  const hashkingsApi = new HashkingsAPI();
  const classes = useStyles();
  const {username} = useContext(StateContext);
  const [delegation, setDelegation] = useState({used: 0, available: 0});
  const [landSupply, setLandSupply] = useState();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (username) {
      Promise.all([
        hashkingsApi.getUserDelegation(username),
        hashkingsApi.getStats()
      ])
        .then(([delegation, stats]) => {
          if (delegation && delegation.delegator) {
            setDelegation({
              used: delegation.used,
              available: delegation.availible
            });
          }
          setLandSupply(stats.supply.land);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [username]);

  const updateDelegation = newDelegation => {
    setDelegation(newDelegation);
  };

  if (!username) {
    return (
    <Redirect to='/login'/>
    );
  } else {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paperBlack}>   
          <ThemeProvider theme={theme}>
            <Typography gutterBottom variant="h5" component="h1">
              <b><font color="#DFB17B" className={classes.font}><u>Leasing Office</u></font></b>
            </Typography>
          </ThemeProvider>
        </Paper>
      </Grid>
      <Grid item xs>
      <HtmlTooltip
          title={
            <React.Fragment>
            <Typography color="error">
              <u>Delegate for a plot</u>
            </Typography>
              <em><a href="/market/seedbank">{"Get your farm plots here"}</a></em> <b>{"Each Plot requires a 20 STEEM Power delegation"}</b>
            </React.Fragment>
          }
          placement="right"
          TransitionComponent={Zoom}
          >
      <Card className={classes.card}>
            <CardMedia
              className={classes.media}
              image="https://i.imgur.com/ZohrL4N.png"
              title="Mexico"
            />
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="h5" component="h2">
                <font color="DFB17B" className={classes.font}>
                Plot Delegation
                </font>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
              <font color="DFB17B" className={classes.font}>Delegate 20 STEEM Power per Plot below!</font>
              </Typography>
          </CardContent>
            <hr/>
          <CardActions disableSpacing>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon 
              color="error"
              />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Delegate
                  username={username}
                  delegation={delegation}
                  updateDelegation={updateDelegation}
                />
            <Divider variant="middle" />
          </CardContent>
          </Collapse>
        </Card>
      </HtmlTooltip>
    </Grid>
    <Grid item xs alignItems="flex-end">
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="https://i.imgur.com/x1eOPYj.png"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          <font color="DFB17B" className={classes.font}>Pay for your Plot</font>
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          <font color="DFB17B" className={classes.font}>Each plot requires a 0.5 STEEM Leasing Fee. Please choose your region below.</font>
          </Typography>
          <br/>
          {delegation.available > 0 && (
              <BuyGarden
                username={username}
                delegation={delegation}
                updateDelegation={updateDelegation}
                landSupply={landSupply}
              />
            )}
            {delegation.available === 0 && (
              <p>
                <font color="DFB17B" className={classes.font}>
                  <b>
                    All Fees Paid. Please delegate more Steem Power to lease a plot.
                  </b>
                </font>
              </p>
            )}
          {/*<BuySeed type="r" />*/}
        </CardContent>
      </Card>
    </Grid>
    </Grid>
  );
}
};

