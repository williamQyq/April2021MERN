import '@src/assets/HomeMobile.scss';
import React from 'react';
import { connect } from 'react-redux';
import { Button, message, Layout } from 'antd';
import { getInvReceivedWithWrongAdds } from '@redux-action/inboundActions.js';
import { logout } from '@redux-action/authActions';

// import { SocketContext } from 'component/socket/socketContext.js';

interface IProps {
    getInvReceivedWithWrongAdds: () => any;
    logout: () => void;
}
interface IState {
    loading: boolean;
    data: unknown;
}

class HomeMobile extends React.Component<IProps, IState> {
    // static contextType = SocketContext
    constructor(props: IProps) {
        super(props)
        this.state = {
            loading: false,
            data: {}
        }
    }

    handleClick = (event: React.MouseEvent) => {
        this.setState({ loading: true })
        this.props.getInvReceivedWithWrongAdds()
            .then((res: any) => {
                message.success("get wrong adds success")
                this.setState({ loading: false })
            })
            .catch((e: any) => {
                message.error(e);
                this.setState({ loading: false });
            })
    }

    handleLogOut = () => {
        this.props.logout();
    }
    onNewScanResult = (decodedText: unknown, decodedResult: unknown) => {
        this.setState({ data: decodedText })
        console.log(decodedText, decodedResult)
    }

    render() {
        const { loading } = this.state
        return (
            <Layout.Content className='home'>
                <Button
                    loading={loading}
                    size='large'
                    onClick={e => this.handleClick(e)}>
                    Get Wrong Adds
                </Button>
                <Button size='large' onClick={this.handleLogOut}>Log Out</Button>
            </Layout.Content>
        );
    }

}



export default connect(null, { getInvReceivedWithWrongAdds, logout })(HomeMobile);