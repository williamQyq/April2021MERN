import React from 'react';
import './styles/app.scss';
// import './styles/app.less';
import 'antd/dist/antd.css';
import { Layout, Menu } from 'antd'; 
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UploadOutlined,
  AlertOutlined,
  MonitorOutlined,
  RobotOutlined
} from '@ant-design/icons';
import MainContent from './component/MainContent'

import io from 'socket.io-client';

// const socket = io.connect('http://localhost:3000', {
//     reconnection: true,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,
//     reconnectionAttempts: Infinity
// });
const socket = io.connect('http://localhost:3000/');


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      content_key:'PRICE_ALERT',
      collapsed: false,
    };
  };

  toggle = () =>{
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  handleContentKey = (key) => {
    this.setState({content_key: key});
  };
  getContentKey = () => {
    const content_key = this.state.content_key;
    return content_key;
  }

  render() {

    return (
      <Layout className="main-layout">
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu 
            theme="dark" 
            mode="inline" 
            defaultSelectedKeys={["PRICE_ALERT"]} 
            onClick={(e)=> this.handleContentKey(e.key)}
            >
            <SubMenu key = "sub1" icon={<AlertOutlined/>} title="Alert">
              <Menu.Item key="PRICE_ALERT" icon={<MonitorOutlined/>}>Price Alert</Menu.Item>
              <Menu.Item key="PURCHASE_BOT" icon={<RobotOutlined/>}>Purchase Bot</Menu.Item>
            </SubMenu>
            <Menu.Item key="3" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
            <Menu.Item key="4" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
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
            <MainContent getContentKey={this.getContentKey} socket={socket}/>
          </Content>
        </Layout>
      </Layout>
    );
  }

}

export default (App);
