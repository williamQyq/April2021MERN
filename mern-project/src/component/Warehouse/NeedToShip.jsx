import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NeedToShipMenu } from 'component/Warehouse/Menus.jsx';
import {
    downloadPickUpListPDF,
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
            isDownloading: false,
            shipmentInfo: {
                pending: 0,
                total: 0,
                confirm: 0
            }
        };
    }

    componentDidMount() {
        let orgNm = "M" //@Warning: get shipment count on orgNm no code yet
        this.props.getNeedToShipPendingAndTotalCount(orgNm)  //set pending, total, and confirm count
            .then(shipmentInfo => { this.setState({ shipmentInfo }); })
    }

    componentWillUnmount() {
        // let socket = this.context
        // socket.emit(`unsubscribe`, `OutboundRoom`)
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
        const { shipmentInfo, isDownloading } = this.state;
        console.log(shipmentInfo)
        return (
            <>
                <ContentHeader title="NeedToShip" />
                <NeedToShipMenu shipmentInfo={shipmentInfo} />
                <SubContentHeader title="Awaiting Shipment" />
                <Row >
                    <Col xs={10} sm={12} md={14} lg={16} xl={18}>
                        <AwaitingShipmentList shipmentInfo={shipmentInfo} />
                    </Col>
                    <Col xs={14} sm={12} md={10} lg={8} xl={6}>
                        <Button type="primary" loading={isDownloading} icon={<DownloadOutlined />} onClick={this.handlePickUpDownload}>WMS PickUp PDF</Button>
                    </Col>
                </Row>
            </>

        );
    }
}
NeedToShip.prototypes = {
    getNeedToShipPendingAndTotalCount: PropTypes.func.isRequired,
    downloadPickUpListPDF: PropTypes.func.isRequired
}

export default connect(null, {
    getNeedToShipPendingAndTotalCount,
    downloadPickUpListPDF
})(NeedToShip);