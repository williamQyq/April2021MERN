import React from 'react';
import { withRouter } from 'react-router-dom'; // Link pass state props to leftPanel and sideitemDetail
import 'antd/dist/antd.css';
import '../styles/itemDetail.scss';
import { Row, Col, Typography, Card, Skeleton, Divider, Input, Form, InputNumber } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LeftPanel from './ItemDetailLeftPanel.js'
import OrderPanel from './ItemDetailOrderCard.js';
import { EditOutlined, EllipsisOutlined, LeftOutlined, SettingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { getItemDetail } from '../reducers/actions/itemBBActions.js';


const { Text } = Typography;


class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const clickedId = this.props.clickedId;
        this.props.getItemDetail(clickedId);
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        const itemDetail = this.props.itemDetail;
        console.log(`Detail:\n${JSON.stringify(itemDetail)}`)
        if(itemDetail != null){
            return (
                <React.Fragment>
                    <Row className="main-grid">
                        <LeftOutlined className="go-back-btn" style={{ fontSize: '24px' }} onClick={this.goBack} />
                        <LeftPanel />
                        <OrderPanel />

                    </Row>
                </React.Fragment>
            );
        } else {
            return null;
        }
    }

}



ItemDetail.prototypes = {
    // location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    getItemDetail: PropTypes.func.isRequired,
    itemBB: PropTypes.object.isRequired,
    clickedId: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
    clickedId: state.itemBB.tableState.clickedId,
    itemDetail: state.itemBB.itemDetail,
    itemBB: state.itemBB

});
//withRouter grant access to Router history, location...
export default withRouter(connect(mapStateToProps, { getItemDetail })(ItemDetail));
