import React from 'react';
import { useHistory } from "react-router-dom"
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import CityIcon from '@material-ui/icons/LocationCity'
import ArticleIcon from "@material-ui/icons/EditOutlined"
import ProfileIcon from "@material-ui/icons/AccountBox"
import PackageIcon from "@material-ui/icons/Cake"
import ExitIcon from "@material-ui/icons/ExitToApp"
import Divider from '@material-ui/core/Divider'
import PagesNew from "@material-ui/icons/PostAdd"
import CollectionIcon from "@material-ui/icons/Book"
import FaqIcon from "@material-ui/icons/LiveHelp"

const MenuItems = (props) => { 
  const history = useHistory()
  return (<div>
    <ListItem button onClick={()=>history.push('/dashboard')}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

    <ListItem button onClick={()=>history.push('/user/agent')}>
      <ListItemIcon>
        <ProfileIcon />
      </ListItemIcon>
      <ListItemText primary="Agents" />
    </ListItem>

    <ListItem button onClick={()=>history.push('/user/developer')}>
      <ListItemIcon>
        <ProfileIcon />
      </ListItemIcon>
      <ListItemText primary="Developers" />
    </ListItem>


    <Divider />

    <ListItem button onClick={()=>history.push('/blog')}>
      <ListItemIcon>
        <ArticleIcon />
      </ListItemIcon>
      <ListItemText primary="Blog" />
    </ListItem>

    <ListItem button onClick={()=>history.push('/pages')}>
      <ListItemIcon>
        <PagesNew />
      </ListItemIcon>
      <ListItemText primary="Pages" />
    </ListItem>

    <ListItem button onClick={()=>history.push('/references')}>
      <ListItemIcon>
        <CollectionIcon />
      </ListItemIcon>
      <ListItemText primary="Serba-Serbi" />
    </ListItem>

    <Divider />
    
    <ListItem button onClick={()=>history.push('/popular')}>
      <ListItemIcon>
        <CityIcon />
      </ListItemIcon>
      <ListItemText primary="Popular City" />
    </ListItem>

    <ListItem button onClick={()=>history.push('/packages')}>
      <ListItemIcon>
        <PackageIcon />
      </ListItemIcon>
      <ListItemText primary="Packages" />
    </ListItem>

    <ListItem button onClick={()=>history.push('/faq')}>
      <ListItemIcon>
        <FaqIcon />
      </ListItemIcon>
      <ListItemText primary="F.A.Q" />
    </ListItem>

    <Divider />

    <ListItem button>
      <ListItemIcon>
        <ProfileIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItem>

    <ListItem button onClick={props.onLogout} style={{color:"red"}}>
      <ListItemIcon style={{color:"red"}}>
        <ExitIcon />
      </ListItemIcon>
      <ListItemText primary="Log out" />
    </ListItem>

  </div>)
}

export default MenuItems

/*
export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);*/