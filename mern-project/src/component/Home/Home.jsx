import React from 'react';
import 'styles/Home.scss';
import 'antd/dist/antd.min.css';
import { Layout } from 'antd';
import { loadUser, logout } from 'reducers/actions/authActions.js';
import { connect } from 'react-redux';
import HomeContent from 'component/Home/HomeContent.jsx';
import HomeHeader from 'component/Home/HomeHeader.jsx';
import HomeSider from 'component/Home/HomeSider.jsx';
import { SocketContext } from 'component/socket/socketContext';
import WithNavigate from 'component/auth/WithNavigate';

class Home extends React.Component {
  static contextType = SocketContext
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    };
  };

  componentDidMount() {
    this.props.loadUser();
    let socket = this.context;
    if (!socket.connected) {
      socket.connect();
    }
  }
  componentWillUnmount() {
    let socket = this.context;
    if (socket.connected) {
      socket.disconnect();
    }
  }

  handleLogOut = () => {
    this.props.logout();
    let socket = this.context;
    socket.disconnect()
  }

  toggle = (collapsed) => {
    this.setState({
      collapsed: !collapsed,
    });
  };


  render() {
    // const { location } = this.props
    // const path = location.pathname;
    const { collapsed } = this.state;

    return (
      <Layout className="main-layout" style={{ minHeight: "100vh" }}>
        <HomeSider isCollapsed={collapsed} toggle={this.toggle} />
        <Layout className="site-layout" style={{ minWidth: "1400px" }}>
          <HomeHeader handleLogOut={this.handleLogOut} isCollapsed={collapsed} toggle={this.toggle} />
          <HomeContent />
        </Layout>

      </Layout>
    );
  }
}

export default WithNavigate(connect(null, { logout, loadUser })(Home));
