import React from 'react';
import { withRouter } from 'react-router-dom'; // Link pass state props to leftPanel and sideitemDetail
import 'antd/dist/antd.css';
import 'component/ItemDetail/ItemDetail.scss';
import { Col, Row } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LeftPanel from 'component/ItemDetail/ItemDetailLeftPanel'
import OrderPanel from 'component/ItemDetail/ItemDetailOrderCard';
import { getItemDetail } from 'reducers/actions/itemActions';

class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const clickedId = this.props.clickedId;
        const store = this.props.store;
        this.props.getItemDetail(store, clickedId);
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        const itemDetail = this.props.itemDetail;
        if (itemDetail != null) {
            return (
                <>
                    <Row className="main-grid">
                        {/* <LeftOutlined className="go-back-btn" style={{ fontSize: '24px' }} onClick={this.goBack} /> */}
                        <Col flex="1 0 66.6666666667%" className="left-panel" >
                            <LeftPanel />
                        </Col>
                        <Col flex="1 0 27.7777777778%" className="right-panel">
                            <OrderPanel />
                        </Col>
                    </Row>
                </>
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
    clickedId: PropTypes.string.isRequired,
    store: PropTypes.string.isRequired,
    itemDetail: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    clickedId: state.item.tableState.clickedId,
    store: state.item.tableState.store,
    itemDetail: state.item.itemDetail
});
//withRouter grant access to Router history, location...
export default withRouter(connect(mapStateToProps, { getItemDetail })(ItemDetail));
