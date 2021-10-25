import React from 'react';
import { withRouter } from 'react-router-dom'; // Link pass state props to leftPanel and sideitemDetail
import 'antd/dist/antd.css';
import '../styles/itemDetail.scss';
import { Row, Col, Typography, Card, Skeleton, Divider, Input, Form, InputNumber } from 'antd';

import PropTypes from 'prop-types';
import LeftPanel from './ItemDetailLeftPanel.js'
import OrderPanel from './ItemDetailOrderCard.js';
import { EditOutlined, EllipsisOutlined, LeftOutlined, SettingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
const { Text } = Typography;


class ItemDetail extends React.Component {
    constructor(props) {
        super(props);

    }
    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <React.Fragment>
                <Row className="main-grid">
                    <LeftOutlined className="go-back-btn" style={{ fontSize: '24px' }} onClick={this.goBack} />
                    <LeftPanel />
                    <OrderPanel />

                </Row>
            </React.Fragment>
        );
    }

}



ItemDetail.prototypes = {
    // location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
}

//withRouter grant access to Router history, location...
export default withRouter(ItemDetail);
