import React from 'react';
import { isBrowser } from 'react-device-detect';
import { ConfigProvider, theme } from 'antd';
import { Route, Routes } from "react-router-dom";
import { ConnectedProps, connect } from 'react-redux';
import { IReduxAuth, IReduxError } from '@src/redux/interface';

/* View Components */
import ProHome from '@view/Home/ProHome';
import ProSignIn from '@view/SignIn/ProSignIn';
import ProSignInSuccess from '@view/SignIn/ProSignInSuccess';
import { ThemeContext as MyThemeContext } from '@view/Home/components/ThemeProvider';

import PrivateRoute from './component/auth/PrivateRoute';
import HomeMobile from './component/mobile/HomeMobile';
import { Notification } from '@src/component/utils/Notification';
import NotFound from '@src/component/utils/NotFound.jsx';

interface IProps extends PropsFromRedux { };

class App extends React.Component<IProps, {}> {
  static contextType = MyThemeContext;
  declare context: React.ContextType<typeof MyThemeContext>;

  render() {
    const isDark = this.context!.isDark;
    return (
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.defaultAlgorithm : theme.darkAlgorithm
        }}>
        <Notification />
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
})

// const mapDispatchToProps = (dispatch: AppDispatch) => ({

// })

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(App);
