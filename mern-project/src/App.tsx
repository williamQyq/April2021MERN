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
import { IReduxAuth, IReduxError } from 'reducers/types';
import { Dispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ConfigProvider } from 'antd';
import { AliasToken } from 'antd/es/theme/internal';
import { OverrideToken } from 'antd/es/theme/interface';
import { ThemeContext } from 'context';
import { ProSettings } from '@ant-design/pro-layout';

interface IProps extends IReduxAuth {
  error: IReduxError;
  handleMessages: () => void;
  handleErrors: () => void;
}

interface IState {
  themeSettings: Partial<ProSettings>;
}

type Theme = Partial<AliasToken>;
type CmptTheme = OverrideToken;
const darkTheme: Theme = {

}
const lightTheme: Theme = {

}
const darkThemeCmpt: CmptTheme = {

}
const lightThemeCmpt: CmptTheme = {

}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      themeSettings: {
        fixSiderbar: true,
        layout: 'mix',
        navTheme: 'realDark',
        splitMenus: true,
        contentWidth: "Fluid",
        siderMenuType: "sub"
      },
    }

  }
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

  setThemeSetting = (changeSettings: Partial<ProSettings | undefined>) => {
    if (changeSettings)
      this.setState({ themeSettings: changeSettings });
  }

  toggleTheme = () => {
    const { themeSettings } = this.state;
    console.log(themeSettings);
    themeSettings.navTheme === "light" ?
      this.setState({ themeSettings: { ...themeSettings, navTheme: "realDark" } }) :
      this.setState({ themeSettings: { ...themeSettings, navTheme: "light" } });
  }

  render() {
    const { themeSettings } = this.state;

    return (
      <ThemeContext.Provider
        value={{
          themeSettings: themeSettings,
          toggleTheme: this.toggleTheme,
          setThemeSetting: this.setThemeSetting,
        }}
      >
        <ConfigProvider
          theme={{
            // inherit: true,
            token: themeSettings.navTheme === 'light' ? lightTheme : darkTheme,
            components: themeSettings.navTheme === 'light' ? lightThemeCmpt : darkThemeCmpt,
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
      </ThemeContext.Provider >
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
