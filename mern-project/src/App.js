import React from 'react';
import './styles/app.scss';
import 'antd/dist/antd.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import store from 'store.js';
import { loadUser } from './reducers/actions/authActions.js';
import SignIn from 'component/auth/SignIn.js';
import Home from 'component/auth/Home.js';
import ErrorPage from 'component/ErrorPage.js';


class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={SignIn} />
        <Route path="/home" component={Home} />
        <Route component={ErrorPage} />
      </Switch>
    );
  }
}

export default (App);
