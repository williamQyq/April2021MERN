import React from 'react';
import 'antd/dist/antd.min.css';
import {
  Switch,
  Route,
} from "react-router-dom";
import SignIn from 'component/auth/SignIn.jsx';
import ErrorPage from 'component/utility/ErrorPage.jsx';
import PrivateRoute from 'component/auth/PrivateRoute.js';
import { loadUser } from 'reducers/actions/authActions.js';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';

import Home from 'component/Home/Home.jsx';
import HomeMobile from 'component/Home/HomeMobile.jsx';
import { isBrowser } from 'react-device-detect';
import { SocketProvider } from 'component/socket/socketContext.js';
import openAlertNotification from 'component/utility/errorAlert.js';
import { clearErrors } from 'reducers/actions/errorActions';
import { clearMessages } from 'reducers/actions/messageActions';

class App extends React.Component {

  static propTypes = {
    isAuthenticated: Proptypes.bool
  }

  componentDidMount() {
    this.props.loadUser();
  }
  componentDidUpdate() {
    const { status, msg, reason } = this.props.error;
    if (status === 202) {
      openAlertNotification('warning', msg, this.props.handleMessages, reason)
    }
    else if (status && status !== 200) {
      openAlertNotification('error', msg, this.props.handleErrors, reason)
    }
    else if (status === 200) {
      openAlertNotification('success', msg, this.props.handleMessages, reason)
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={SignIn} />
        <PrivateRoute path="/app" isAuthenticated={this.props.isAuthenticated} >
          {
            isBrowser ?
              <SocketProvider><Home /></SocketProvider> :
              <HomeMobile />
          }
        </PrivateRoute>
        <Route component={ErrorPage} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
})

const mapDispatchToProps = (dispatch) => ({
  handleErrors: () => dispatch(clearErrors()),
  handleMessages: () => dispatch(clearMessages()),
  loadUser: () => dispatch(loadUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
