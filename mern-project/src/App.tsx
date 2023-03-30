import React from 'react';
import { Route, Routes } from "react-router-dom";
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
import { AppDispatch, IReduxAuth, IReduxError } from 'reducers/interface';
import { ThemeContext } from 'component/Home/ThemeProvider';
import { ConfigProvider, theme } from 'antd';
import ProSignIn from 'component/auth/ProSignIn';
import { loadUser } from 'reducers/actions/authActions';
import ProSignInSuccess from 'component/auth/ProSignInSuccess';

interface IProps extends IReduxAuth {
  error: IReduxError;
  handleMessages: () => void;
  handleErrors: () => void;
  loadUser: () => void;
}

interface IState { };

class App extends React.Component<IProps, IState> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;


  componentDidUpdate(prevProps: IProps) {
    if (this.props.error !== prevProps.error) {
      this.handleRequestErrorStatus(this.props.error);
    }

  }

  handleRequestErrorStatus = (error: IReduxError) => {
    const { status, msg, reason } = error;
    if (!status) return;

    switch (status) {
      case 200:
        openAlertNotification('success', msg, this.props.handleMessages, reason)
        break;
      case 202:
        openAlertNotification('warning', msg, this.props.handleMessages, reason)
        break;
      default:
        openAlertNotification('error', msg, this.props.handleErrors, reason)
    }
  }

  render() {
    const isDark = this.context?.isDark;
    return (
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}
      >
        <Routes>
          <Route path="/" element={<ProSignIn />} />
          <Route path="/login/success" element={<ProSignInSuccess />} />
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

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  handleErrors: () => dispatch(clearErrors()),
  handleMessages: () => dispatch(clearMessages()),
  loadUser: () => dispatch(loadUser())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
