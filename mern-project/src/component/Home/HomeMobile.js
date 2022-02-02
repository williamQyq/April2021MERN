import { Button, message, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';
import { connect } from 'react-redux';
import './HomeMobile.scss';
import { getInvReceive } from 'reducers/actions/inboundActions.js';

class HomeMobile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    handleClick = (e) => {
        this.setState({ loading: true })
        getInvReceive().then(res => {
            message.success("get wrong adds success")
            this.setState({ loading: false })
        }).catch(e => {
            message.error(e);
            this.setState({ loading: false });
        })
    }
    render() {
        const { loading } = this.state
        return (
            <Content className='home'>
                <Button loading={loading} size='large' onClick={e => this.handleClick(e)}>Get Wrong Adds</Button>
            </Content>
        );
    }

}

export default connect(null, { getInvReceive })(HomeMobile);