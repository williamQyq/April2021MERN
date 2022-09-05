import { Button, message, Result, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';
import { connect } from 'react-redux';
import './HomeMobile.scss';
import { getInvReceivedWithWrongAdds } from 'reducers/actions/inboundActions.js';
import { logout } from 'reducers/actions/authActions.js';

// import { SocketContext } from 'component/socket/socketContext.js';


class HomeMobile extends React.Component {
    // static contextType = SocketContext
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
        }
    }

    handleClick = (e) => {
        this.setState({ loading: true })
        this.props.getInvReceivedWithWrongAdds()
            .then(res => {
                message.success("get wrong adds success")
                this.setState({ loading: false })
            })
            .catch(e => {
                message.error(e);
                this.setState({ loading: false });
            })
    }

    handleLogOut = () => {
        this.props.logout();
    }
    onNewScanResult = (decodedText, decodedResult) => {
        this.setState({ data: decodedText })
        console.log(decodedText, decodedResult)
    }

    render() {
        const { loading, data } = this.state
        return (
            <Content className='home'>
                <Button loading={loading} size='large' onClick={e => this.handleClick(e)}>Get Wrong Adds</Button>
                <Button size='large' onClick={e => this.handleLogOut(e)}>Log Out</Button>
            </Content>
        );
    }

}



export default connect(null, { getInvReceivedWithWrongAdds, logout })(HomeMobile);