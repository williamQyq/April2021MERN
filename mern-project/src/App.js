import React from 'react';
import './styles/app.scss';
import 'antd/dist/antd.css';
import {
  Switch,
  Route,
} from "react-router-dom";
import SignIn from 'component/auth/SignIn.js';
import ErrorPage from 'component/ErrorPage.js';
import PrivateRoute from 'component/auth/PrivateRoute.js';
import { loadUser } from 'reducers/actions/authActions.js';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';

import store from 'store.js';
import Home from 'component/auth/Home';

class App extends React.Component {

  static propTypes = {
    isAuthenticated: Proptypes.bool
  }


  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={SignIn} />
        <PrivateRoute path="/app" isAuthenticated={this.props.isAuthenticated} >
          <Home />
        </PrivateRoute>
        <Route component={ErrorPage} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, null)(App);
