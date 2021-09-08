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
} from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import io from 'socket.io-client';
import PriceAlert from './component/PriceAlert';
import InBound from './component/InBound';
import ItemDetail from './component/ItemDetail';

const socket = io.connect();

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    };
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {

    return (
      <Router>
        <Layout className="main-layout">
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo" />
            <Menu theme="dark" mode="inline">
              <SubMenu key="ALERT" icon={<AlertOutlined />} title="Alert">
                <Menu.Item icon={<MonitorOutlined />}><Link to='/price-alert'>Price Alert</Link></Menu.Item>
                <Menu.Item icon={<RobotOutlined />}> <Link to='/purchase-bot'>Purchase Bot</Link> </Menu.Item>
              </SubMenu>
              <SubMenu key="WAREHOUSE"icon={<BankOutlined />} title="Warehouse">
                <Menu.Item icon={<BarcodeOutlined />}><Link to='/inbound'> <InBound/></Link></Menu.Item>
                <Menu.Item icon={<BarcodeOutlined />}>Outbound</Menu.Item>
              </SubMenu>
              <Menu.Item icon={<UploadOutlined />}>nav 3</Menu.Item>
            </Menu>
          </Sider>

          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </Header>
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
              }}
            >
              <Switch>
                <Route path='/price-alert'> <PriceAlert socket={socket} /> </Route>
                <Route path='/inbound'> <InBound /> </Route>
                <Route path='/item-detail'> <ItemDetail/></Route>
              </Switch>
              
            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }

}

export default (App);
