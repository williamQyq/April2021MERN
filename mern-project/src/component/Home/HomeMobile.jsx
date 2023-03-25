import { Button, message, Layout } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import 'styles/HomeMobile.scss';
import { getInvReceivedWithWrongAdds } from 'reducers/actions/inboundActions.js';
import { logout } from 'reducers/actions/authActions';

// import { SocketContext } from 'component/socket/socketContext.js';
const { Content } = Layout;

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
        const { loading } = this.state
        return (
            <Content className='home'>
                <Button loading={loading} size='large' onClick={e => this.handleClick(e)}>Get Wrong Adds</Button>
                <Button size='large' onClick={e => this.handleLogOut(e)}>Log Out</Button>
            </Content>
        );
    }

}



export default connect(null, { getInvReceivedWithWrongAdds, logout })(HomeMobile);