import React from 'react';
import 'component/ItemDetail/ItemDetail.scss';
import { Col, Row } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LeftPanel from 'component/ItemDetail/ItemDetailLeftPanel'
import OrderPanel from 'component/ItemDetail/ItemDetailOrderCard';
import { getItemDetail } from 'reducers/actions/itemActions';
import { useNavigate } from 'react-router-dom';

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
        const navigate = useNavigate();
        navigate(-1);
    }

    render() {
        const { itemDetail, loading } = this.props;

        if (itemDetail != null) {
            return (
                <>
                    <Row style={{ "display": "flex", "justifyContent": "center" }} gutter={[48, 24]}>
                        <Col span={12} className="left-panel" >
                            <LeftPanel item={itemDetail} loading={loading} />
                        </Col>
                        <Col span={6} className="right-panel">
                            <OrderPanel />
                        </Col>
                    </Row>
                </>
            );
        } else {
            return <></>;   //return <DetailNotFound/>
        }
    }

}



ItemDetail.prototypes = {
    // location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    getItemDetail: PropTypes.func.isRequired,
    clickedId: PropTypes.string.isRequired,
    store: PropTypes.string.isRequired,
    itemDetail: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    clickedId: state.item.tableState.clickedId,
    store: state.item.tableState.store,
    itemDetail: state.item.itemDetail,
    loading: state.item.loading
});
//@deprecated in react-router-dom v6: withRouter grant access to Router history, location...
export default connect(mapStateToProps, { getItemDetail })(ItemDetail);
