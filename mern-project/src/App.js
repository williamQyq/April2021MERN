import React from 'react';
import './styles/app.scss';
import 'antd/dist/antd.min.css';
import {
  Switch,
  Route,
} from "react-router-dom";
import SignIn from 'component/SignIn.js';
import ErrorPage from 'component/ErrorPage.js';
import PrivateRoute from 'component/auth/PrivateRoute.js';
import { loadUser } from 'reducers/actions/authActions.js';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';

import store from 'store.js';
import Home from 'component/Home/Home.jsx';
import HomeMobile from 'component/Home/HomeMobile.jsx';
import io from 'socket.io-client';
import { BrowserView, MobileView } from 'react-device-detect';

// const socket = io('localhost:3000', {
//   'reconnection': true,
//   'reconnectionDelay': 500,
//   'reconnectionAttempts': 5
// });


class App extends React.Component {

  static propTypes = {
    isAuthenticated: Proptypes.bool
  }

  componentDidMount() {
    store.dispatch(loadUser());
    // store.dispatch(loadSocket());

  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={SignIn} />
        <PrivateRoute path="/app" isAuthenticated={this.props.isAuthenticated} >
          <BrowserView>
            <Home />
          </BrowserView>
          <MobileView>
            <HomeMobile />
          </MobileView>
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
