import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NeedToShipMenu } from 'component/Warehouse/Menus.jsx';
import {
    downloadPickUpListPDF,
    getNeedToShipFromShipmentWithLimit,
    getNeedToShipPendingAndTotalCount
} from 'reducers/actions/outboundActions.js';
import AwaitingShipmentList from './AwaitingShipmentList.jsx';
import { ContentHeader, SubContentHeader } from 'component/utility/Layout.jsx';
import { Button, Col, Row } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

class NeedToShip extends React.Component {
    // static contextType = SocketContext //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            initLoading: true,
            loading: false,
            isDownloading: false,
            data: [],
            docLimits: 5,
            docSkip: 0,
            shipmentInfo: {
                pending: 0,
                total: 0,
                confirm: 0
            }
        };
    }

    componentDidMount() {
        const { docLimits, docSkip } = this.state;

        this.props.getNeedToShipFromShipmentWithLimit(docLimits, docSkip)   //get need to ship shipment
            .then(() => { this.setState({ initLoading: false }); })

        this.props.getNeedToShipPendingAndTotalCount()  //set pending, total, and confirm count
            .then(shipmentInfo => { this.setState({ shipmentInfo }); })

    }

    componentDidUpdate(prevProps) {
        const { data } = this.state;
        const prevItemsData = prevProps.needToShipItems;
        const curItemsData = this.props.needToShipItems;

        if (prevItemsData !== curItemsData && prevItemsData.length !== 0) {

            this.setState({ data: [...data, ...curItemsData], loading: false })
            this.setState({ docSkip: data.length + curItemsData.length })

        }

    }
    componentWillUnmount() {
        // let socket = this.context
        // socket.emit(`unsubscribe`, `OutboundRoom`)
    }
    loadMore = () => {
        const { docLimits, docSkip, loading } = this.state;
        if (loading) {
            return;
        }
        this.setState({ loading: true })
        this.props.getNeedToShipFromShipmentWithLimit(docLimits, docSkip)
    }

    handlePickUpDownload = (e) => {
        e.preventDefault();
        const requiredFields = {
            fileName: "pickUp.pdf"
        }
        this.setState({ isDownloading: true })
        this.props.downloadPickUpListPDF(requiredFields)
            .then(() => this.setState({ isDownloading: false }))
    }

    render() {
        const { data, shipmentInfo, isDownloading } = this.state;
        return (

            <>
                <ContentHeader title="NeedToShip" />
                <NeedToShipMenu shipmentInfo={shipmentInfo} />
                <SubContentHeader title="Awaiting Shipment" />
                <Row >
                    <Col flex={3}>
                        <AwaitingShipmentList
                            data={data}
                            loadMore={this.loadMore}
                            shipmentInfo={shipmentInfo}
                        />
                    </Col>
                    <Col flex={1}>
                        <Button type="primary" loading={isDownloading} icon={<DownloadOutlined />} onClick={this.handlePickUpDownload}>WMS PickUp PDF</Button>
                    </Col>
                </Row>
            </>

        );
    }
}
NeedToShip.prototypes = {
    needToShipItems: PropTypes.array.isRequired,
    needToShipItemsLoading: PropTypes.bool.isRequired,
    getNeedToShipFromShipmentWithLimit: PropTypes.func.isRequired,
    getNeedToShipPendingAndTotalCount: PropTypes.func.isRequired,
    downloadPickUpListPDF: PropTypes.func.isRequired
}
const mapStateToProps = (state) => ({
    needToShipItems: state.warehouse.needToShip.items,
    needToshipItemsLoading: state.warehouse.needToShip.itemsLoading
})

export default connect(mapStateToProps, {
    getNeedToShipFromShipmentWithLimit,
    getNeedToShipPendingAndTotalCount,
    downloadPickUpListPDF
})(NeedToShip);