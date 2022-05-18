import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  HashRouter
} from "react-router-dom"
import { Provider } from "react-redux"
import Store from "./store"
import { LoadingBar } from "react-redux-loading-bar";
import { SnackbarProvider } from 'notistack';
import Notifier from "./components/Notifier"
import PublicRoute from './layout/PublicRoute';
// pages
import AddEditBlog from "./pages/Blog/AddEditBlog"
import IndexBlog from "./pages/Blog/Index"


function App() {
  return (
    <Provider store={Store}>
      <Router basename="/app" forceRefresh={false}>
        <SnackbarProvider
          autoHideDuration={3000} maxSnack={3} 
          anchorOrigin={{horizontal:"center", vertical:"top"}}>
            <LoadingBar scope="sectionBar" />
            <Notifier />
            <Switch>
              <PublicRoute name="Blog" path="/blog/edit/:id" component={AddEditBlog} />
              <PublicRoute name="New Blog" path="/blog/new" component={AddEditBlog} />
              <PublicRoute name="Blog" path="/" component={IndexBlog} />
            </Switch>
          

        </SnackbarProvider>
      </Router>
    </Provider> 
  )
}

export default App;
