import React from 'react';
import { Route, Routes } from "react-router-dom";
import SignIn from 'component/auth/SignIn';
import PrivateRoute from 'component/auth/PrivateRoute.js';
import { connect } from 'react-redux';
// import Proptypes from 'prop-types';
import ProHome from 'component/Home/ProHome';
import HomeMobile from 'component/Home/HomeMobile.jsx';
import { isBrowser } from 'react-device-detect';
import openAlertNotification from 'component/utility/errorAlert.js';
import { clearErrors } from 'reducers/actions/errorActions';
import { clearMessages } from 'reducers/actions/messageActions';
import NotFound from 'component/utility/NotFound.jsx';
import { IReduxAuth, IReduxError } from 'reducers/interface';
import { Dispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ThemeContext } from 'component/Home/ThemeProvider';
import { ConfigProvider, theme } from 'antd';

interface IProps extends IReduxAuth {
  error: IReduxError;
  handleMessages: () => void;
  handleErrors: () => void;
}

interface IState { };

class App extends React.Component<IProps, IState> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  // static propTypes = {
  //   isAuthenticated: Proptypes.bool
  // }

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
    const isDark = this.context?.isDark;
    return (
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="app/*"
            element={
              <PrivateRoute isAuthenticated={this.props.isAuthenticated} >
                {
                  isBrowser ? (
                    <ProHome />
                  ) : (
                    <HomeMobile />
                  )
                }
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ConfigProvider>
    );
  }
}

const mapStateToProps = (state: { auth: IReduxAuth; error: IReduxError }) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
})

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  handleErrors: () => dispatch(clearErrors()),
  handleMessages: () => dispatch(clearMessages())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
