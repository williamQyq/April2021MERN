import React from 'react';
import './styles/app.scss';
// import './styles/app.less';
import 'antd/dist/antd.css';
import { Layout, Menu, Breadcrumb } from 'antd'; 
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UseroutLined,
  UploadOutlined,
  AlertOutlined,
  MonitorOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { getItems } from '../src/reducers/actions/itemActions';
import PropTypes from 'prop-types';
import MainContent from './component/MainContent'

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  //get from redux store
  componentDidMount() {
    this.props.getItems();
  }

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
    console.log(this.state.content_key);
    return content_key;
  }

  render() {
    //from redux store
    const { items } = this.props.item;

    return (
      <Layout className="main-layout">
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu 
            theme="dark" 
            mode="inline" 
            defaultSelectedKeys={['1']} 
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
            <MainContent getContentKey={this.getContentKey}/>
          </Content>
        </Layout>
      </Layout>
    );
  }

}

App.propTypes = {
  getItems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,

}

const mapStateToProps = (state) => ({
  item: state.item
})

export default connect(mapStateToProps, {getItems})(App);
