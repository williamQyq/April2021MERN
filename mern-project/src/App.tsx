import React from 'react';
import { isBrowser } from 'react-device-detect';
import { ConfigProvider, theme } from 'antd';
import { Route, Routes } from "react-router-dom";
import { ConnectedProps, connect } from 'react-redux';
import { AppDispatch, IReduxAuth, IReduxError } from '@src/redux/interface';
import { clearErrors } from '@redux-action/errorActions';
import { clearMessages } from '@redux-action/messageActions';

/* View Components */
import ProHome from '@view/Home/ProHome';
import ProSignIn from '@view/SignIn/ProSignIn';
import ProSignInSuccess from '@view/SignIn/ProSignInSuccess';
import { ThemeContext as MyThemeContext } from '@view/Home/components/ThemeProvider';

import PrivateRoute from './component/auth/PrivateRoute';
import HomeMobile from './component/mobile/HomeMobile';
import openAlertNotification, { INotificationProps } from '@src/component/utils/Notification';
import NotFound from '@src/component/utils/NotFound.jsx';

interface IProps extends PropsFromRedux { };

type NotificationConfig = INotificationProps | undefined;

class App extends React.Component<IProps, {}> {
  static contextType = MyThemeContext;
  declare context: React.ContextType<typeof MyThemeContext>;

  componentDidUpdate(prevProps: IProps) {
    if (this.props.error !== prevProps.error) {
      this.showNotification(this.props.error);
    }

  }

  showNotification = (error: IReduxError) => {
    const { status, msg, reason } = error;
    if (!status) return;

    let config: NotificationConfig = {
      msg,
      status: 'error',
      context: reason,
      handleAction: this.props.handleMessages
    };

    switch (status) {
      case 200:
        config.status = 'success';
        break;
      case 202:
        config.status = 'warning';
        break;
      default:
        config.status = 'error';
        config.handleAction = this.props.handleErrors
    }

    openAlertNotification(config);
  }

  render() {
    const isDark = this.context!.isDark;
    return (
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}>
        <Routes>
          <Route path="/" element={<ProSignIn />} />
          <Route path="/login/success" element={<ProSignInSuccess />} />
          <Route
            path="app/*"
            element={
              <PrivateRoute
                isAuthenticated={this.props.isAuthenticated} >
                {
                  isBrowser ? <ProHome /> : <HomeMobile />
                }
              </PrivateRoute>
            } />
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
})

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>
export default connect(mapStateToProps, mapDispatchToProps)(App);
