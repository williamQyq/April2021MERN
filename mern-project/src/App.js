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
import Login from 'component/auth/Login';
import Home from 'component/auth/Home';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
        </Switch>
      </Router>
    );
  }
}

export default (App);
