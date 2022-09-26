import React from 'react';
import 'antd/dist/antd.min.css';
import { Route, Routes } from "react-router-dom";
import SignIn from 'component/auth/SignIn.jsx';
import PrivateRoute from 'component/auth/PrivateRoute.js';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import Home from 'component/Home/Home.jsx';
import HomeMobile from 'component/Home/HomeMobile.jsx';
import { isBrowser } from 'react-device-detect';
import { SocketProvider } from 'component/socket/socketContext.js';
import openAlertNotification from 'component/utility/errorAlert.js';
import { clearErrors } from 'reducers/actions/errorActions';
import { clearMessages } from 'reducers/actions/messageActions';
import NotFound from 'component/utility/NotFound';

class App extends React.Component {

  static propTypes = {
    isAuthenticated: Proptypes.bool
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
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="app/*"
          element={
            <PrivateRoute isAuthenticated={this.props.isAuthenticated} >
              {
                isBrowser ? (
                  <SocketProvider>
                    <Home />
                  </SocketProvider>
                ) : (
                  <HomeMobile />
                )
              }
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
})

const mapDispatchToProps = (dispatch) => ({
  handleErrors: () => dispatch(clearErrors()),
  handleMessages: () => dispatch(clearMessages())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
