import React from 'react';
import { withRouter } from 'react-router-dom'; // Link pass state props to leftPanel and sideitemDetail
import 'antd/dist/antd.css';
import '../styles/itemDetail.scss';
import { Row, Col, Typography } from 'antd';

import PropTypes from 'prop-types';
import LeftPanel from './ItemDetailLeftPanel.js'
import { LeftOutlined } from '@ant-design/icons';
const { Text } = Typography;

class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemId: this.props.location.state.itemId
        };
    }
    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <React.Fragment>
                <Row className="main-grid">
                    <LeftOutlined className="go-back-btn" style={{ fontSize: '24px' }} onClick={this.goBack} />
                    <LeftPanel itemId={this.state.itemId} />
                    <SidePanel />
                    
                </Row>
            </React.Fragment>
        );
    }

}

const SidePanel = () => {
    return (
        <Col flex="1 0 27.7777777778%" className="right-panel">
            <Text>sidebar</Text>
        </Col>
    );
}

ItemDetail.prototypes = {
    location: PropTypes.object.isRequired,

    // bb_item: PropTypes.object.isRequired,
}

export default withRouter(ItemDetail);
