import React from 'react';
import 'component/Home/Home.scss';
import 'antd/dist/antd.min.css';
import { Layout } from 'antd';
import {
  BrowserRouter as Router,
  withRouter
} from "react-router-dom";
import store from 'store.js';
import { loadUser, logout } from 'reducers/actions/authActions.js';
import { connect } from 'react-redux';
import HomeContent from 'component/Home/HomeContent.jsx';
import HomeHeader from 'component/Home/HomeHeader.jsx';
import HomeSider from 'component/Home/HomeSider.jsx';
import { SocketContext } from 'component/socket/socketContext';

class Home extends React.Component {
  static contextType = SocketContext
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    };
  };

  componentDidMount() {
    store.dispatch(loadUser());
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
    const { match: { path } } = this.props;
    const { collapsed } = this.state;
    return (
      <Router>
        <Layout className="main-layout">
          <HomeSider path={path} collapsed={collapsed} />
          <Layout className="site-layout">
            {/* Home Header  */}
            <HomeHeader handleLogOut={this.handleLogOut} toggle={this.toggle} />
            {/* Home Content */}
            <HomeContent />
          </Layout>

        </Layout>
      </Router >
    );
  }
}

export default withRouter(connect(null, { logout })(Home));
