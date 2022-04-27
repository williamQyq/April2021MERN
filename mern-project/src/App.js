import React from 'react';
import './styles/app.scss';
import 'antd/dist/antd.min.css';
import {
  Switch,
  Route,
} from "react-router-dom";
import SignIn from 'component/auth/SignIn.js';
import ErrorPage from 'component/utility/ErrorPage.jsx';
import PrivateRoute from 'component/auth/PrivateRoute.js';
import { loadUser } from 'reducers/actions/authActions.js';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';

import store from 'store.js';
import Home from 'component/Home/Home.jsx';
import HomeMobile from 'component/Home/HomeMobile.jsx';
import { isBrowser } from 'react-device-detect';
import { SocketProvider } from 'component/socket/socketContext';

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
          {isBrowser ?
            <SocketProvider>
              <Home />
            </SocketProvider>
            :
            <HomeMobile />}
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
