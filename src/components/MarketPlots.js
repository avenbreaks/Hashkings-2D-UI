import React, {useContext, useState, useEffect} from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import {HashkingsAPI} from "../service/HashkingsAPI";
import {StateContext} from "../App";
import Delegate from "./Delegate";
import BuyGarden from "./BuyGarden";
import { Redirect } from 'react-router';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  root: {
    '& > svg': {
      margin: theme.spacing(2),
    },
  },
  iconHover: {
    '&:hover': {
      color: "red[800]",
    },
  },
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  extendPaper: {
    color: red[800]
  },
  flex: {
    flexGrow: 1,
  },
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
  paperBlue: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'wrap',
    marginBottom: theme.spacing(1),
    backgroundColor: "#154A4A",
  },
  paperExtended: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
    backgroundColor: "#000000",
  },
  paperBrown: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
    backgroundColor: "#532C0C",
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  card: {
    maxWidth: 345,
    backgroundColor: "#095938",
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: { 500: '#00211B' }, // custom color in hex 
  },
});

export const MarketPlots = () => {
  const classes = useStyles();
  const {username} = useContext(StateContext);
  const [delegation, setDelegation] = useState({used: 0, available: 0});
  const [landSupply, setLandSupply] = useState();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const hashkingsApi = new HashkingsAPI();

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
  }
  return (
    <Paper className={classes.paperExtended}> 
      <Paper className={classes.paperBlue}> 
      <ThemeProvider theme={theme}>
      <center>
      <Typography gutterBottom variant="h4" component="h1">
        <b><font color="#DFB17B"><u>Leasing</u></font></b>
      </Typography>
      </center>
    </ThemeProvider>
    </Paper>
    <Paper className={classes.paperBlue}> 
      <Grid container spacing={1}>
        <Grid item xs={4}>
    <Card className={classes.card}>
    <CardHeader
      avatar={
        <Avatar aria-label="delegation" className={classes.avatar}>
          P
        </Avatar>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVertIcon />
        </IconButton>
      }
      title="Plot Delegation"
    />
    <CardMedia
      className={classes.media}
      image="https://i.imgur.com/ZohrL4N.png"
      title="Mexico"
    />
    <CardContent>
      <Typography variant="body2" color="textSecondary" component="p"><font color="DFB17B">
        Each plot lease requires a 20 SP delegation and does not expire.</font>
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
        <ExpandMoreIcon />
      </IconButton>
    </CardActions>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
      <Divider variant="middle" />
      <br/>
        <Typography paragraph><font color="DFB17B">Delegate:</font></Typography>
        <Delegate
              username={username}
              delegation={delegation}
              updateDelegation={updateDelegation}
            />
      <Divider variant="middle" />
      </CardContent>
    </Collapse>
  </Card>
  </Grid>

  <Grid item xs={4}>
  <Card className={classes.card}>
    <CardMedia
      className={classes.media}
      image="https://i.imgur.com/TLlmPMi.png"
      title="Hashkings"
    />
  </Card>
  </Grid>

  <Grid item xs={4}>
  <Card className={classes.card}>
    <CardHeader
      avatar={
        <Avatar aria-label="leasing" className={classes.avatar}>
          L
        </Avatar>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVertIcon />
        </IconButton>
      }
      title="Leasing"
    />
    <CardMedia
      className={classes.media}
      image="https://i.imgur.com/aDDEpiF.png"
      title="Afghanistan"
    />
    <CardContent>
    <Typography variant="body2" color="textSecondary" component="p"><font color="DFB17B">
        Once you have delegated enough SP you may claim your leased plots for 0.5 STEEM each.</font>
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
        <ExpandMoreIcon />
      </IconButton>
    </CardActions>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
      <Divider variant="middle" />
      <br/>
        <Typography paragraph><font color="DFB17B">Lease Plots:</font></Typography>
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
                <font color="DFB17B">
                  <b>
                    Please delegate more Steem Power above to lease a plot
                  </b>
                </font>
              </p>
            )}
      <Divider variant="middle" />
      </CardContent>
    </Collapse>
  </Card>
  </Grid>
  </Grid>
  </Paper>
  </Paper>
  );
};
