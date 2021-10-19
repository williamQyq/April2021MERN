import React from 'react';
import { withRouter } from 'react-router-dom'; // Link pass state props to leftPanel and sideitemDetail
import 'antd/dist/antd.css';
import '../styles/itemDetail.scss';
import { Row, Col, Typography } from 'antd';

import { connect } from 'react-redux';
import { getItemDetail } from '../reducers/actions/itemBBActions';
import PropTypes from 'prop-types';
import LeftPanel from './ItemDetailLeftPanel.js'

const { Text } = Typography;

class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemId: this.props.location.state.itemId
        };
    }

    componentDidMount() {
        // console.log(`location itemId*** ${this.state.itemId}`);
        this.props.getItemDetail(this.state.itemId);
    }

    render() {
        const itemDetail = this.props.itemDetail.itemDetail;
        console.log(`location***\n${JSON.stringify(this.props.location)}`)
        return (
            <Row className="main-grid">
                <LeftPanel item={itemDetail} />
                <SidePanel />
            </Row>
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
    getItemDetail: PropTypes.func.isRequired,
    itemDetail: PropTypes.object.isRequired,

    // bb_item: PropTypes.object.isRequired,
}

//state contains reducers
const mapStateToProps = (state) => {
    return ({ itemDetail: state.itemDetail })
}

export default withRouter(connect(mapStateToProps, { getItemDetail })(ItemDetail));
