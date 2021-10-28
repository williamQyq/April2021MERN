import React from 'react';
import './styles/app.scss';
// import './styles/app.less';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UploadOutlined,
  AlertOutlined,
  MonitorOutlined,
  RobotOutlined,
  BarcodeOutlined,
  BankOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import io from 'socket.io-client';
import store from 'store.js';
import PriceAlert from 'component/PriceAlert.js';
import InBound from './component/InBound.js';
import ItemDetail from './component/ItemDetail.js';
import BB from './component/BB.js';
import CC from './component/CC.js';
import { loadUser } from './reducers/actions/authActions.js';
import Login from 'component/auth/Login';
import Home from 'component/auth/Home';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
        </Switch>
      </Router>
    );
  }
}

export default (App);
