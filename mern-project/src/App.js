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
import PriceAlert from './component/PriceAlert.js';
import InBound from './component/InBound.js';
import ItemDetail from './component/ItemDetail.js';
import BB from './component/BB.js';
import CC from './component/CC.js';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      socket: io.connect()
    };
  };

  componentDidMount() {
    this.state.socket.on('disconnect', () => {
      console.log('socket Disconnected...');
    })
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const {socket} = this.state;
    return (
      <Router>
        <Layout className="main-layout">
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo">William's ERP</div>
            <Menu theme="dark" mode="inline">
              <SubMenu key="ALERT" icon={<AlertOutlined />} title="Alert">
                <Menu.Item key="BestBuy" icon={<ShoppingOutlined />}><Link to='/bestbuy-list'>BestBuy</Link></Menu.Item>
                <Menu.Item key="CostCo" disabled icon={<ShoppingOutlined />}><Link to='/costco-list'>CostCo</Link></Menu.Item>
                <Menu.Item key="PRICE-ALERT" icon={<MonitorOutlined />}><Link to='/price-alert'>Price Alert</Link></Menu.Item>
                <Menu.Item key="PURCHASE-BOT" disabled icon={<RobotOutlined />}> <Link to='/purchase-bot'>Purchase Bot</Link> </Menu.Item>
              </SubMenu>
              <SubMenu key="WAREHOUSE" icon={<BankOutlined />} title="Warehouse">
                <Menu.Item key="INBOUND" icon={<BarcodeOutlined />}><Link to='/inbound'> <InBound /></Link></Menu.Item>
                <Menu.Item key="OUTBOUND" icon={<BarcodeOutlined />}>Outbound</Menu.Item>
              </SubMenu>
              <Menu.Item key="nav3" icon={<UploadOutlined />}>nav 3</Menu.Item>
            </Menu>
          </Sider>

          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </Header>
            <Content className="site-layout-content">

              <Switch>
                <Route exact path='/' component={BB} />
                <Route path='/bestbuy-list'><BB socket={socket} /></Route>
                <Route path='/price-alert'> <PriceAlert socket={socket} /> </Route>
                <Route path='/inbound'> <InBound /> </Route>
                <Route path='/item-detail'> <ItemDetail /></Route>
                <Route path='/costco-list'><CC socket={socket} /></Route>
              </Switch>

            </Content>
          </Layout>
        </Layout>
      </Router>
    );
  }

}

export default (App);
