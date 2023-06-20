import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    downloadPickUpListPDF,
    getNeedToShipPendingAndTotalCount,
    getNeedToShipPickUpPendingAndTotalCount
} from '@redux-action//outboundActions.js';
import AwaitingShipmentList from './AwaitingShipmentList.jsx';
import NeedToShipControlPanel from '@view/Warehouse/NeedToShipControlPanel.jsx';
import { ContentHeader, SubContentHeader } from '@src/component/utils/Layout';
import { Button, Col, Progress, Row } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

class NeedToShip extends React.Component {
    // static contextType = SocketContext //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            initDownloading: false,
            shipmentInfo: {
                pending: 0,
                total: 0,
                confirm: 0,
                pickUpPending: 0,
                pickUpCreated: 0
            }
        };
    }

    componentDidMount() {
        let orgNm = "M" //@Warning: get shipment count on orgNm no code yet

        //set pending, total, pickUpPending and confirm count
        this.props.getNeedToShipPendingAndTotalCount(orgNm).then(shipmentInfo => {
            this.props.getNeedToShipPickUpPendingAndTotalCount().then(pickUpCount => {
                this.setState({ shipmentInfo: { ...shipmentInfo, ...pickUpCount } })
            })
        })
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
        this.setState({ initDownloading: true });
        this.props.downloadPickUpListPDF(requiredFields);
    }
    getDownloadPercent = (isDownloading, receivedBytes, totalBytes) => {
        console.log(`received: `, receivedBytes);
        let curPercent = totalBytes !== undefined ?
            (receivedBytes / totalBytes).toFixed(2) * 100
            : 0;

        if (curPercent === 100 && isDownloading === false) {
            setTimeout(() => {
                this.setState({ initDownloading: false });
            }, 1000);
        }
        return curPercent;
    }

    render() {
        const { shipmentInfo, initDownloading } = this.state;
        const { isDownloading, receivedBytes, totalBytes } = this.props;
        return (
            <>
                <ContentHeader title="NeedToShip" />
                <NeedToShipControlPanel shipmentInfo={shipmentInfo} />
                <SubContentHeader title="Awaiting Shipment" />
                <Row >
                    <Col xs={12} lg={12} xl={18}>
                        <AwaitingShipmentList shipmentInfo={shipmentInfo} />
                    </Col>
                    <Col xs={4} sm={8} md={10} lg={12} xl={6}>
                        <Button
                            style={{ width: "200px" }}
                            type="primary"
                            loading={isDownloading}
                            icon={<DownloadOutlined />}
                            onClick={this.handlePickUpDownload}
                        >
                            WMS PickUp PDF
                        </Button>
                        {(
                            initDownloading ?
                                <Progress
                                    style={{ width: "200px" }}
                                    percent={this.getDownloadPercent(isDownloading, receivedBytes, totalBytes)}
                                    size="small"
                                    showInfo={false}
                                    success={{ percent: 100, strokeColor: "#52c41a" }}
                                />
                                : <></>
                        )}
                    </Col>
                </Row>
            </>

        );
    }
}
NeedToShip.prototypes = {
    getNeedToShipPendingAndTotalCount: PropTypes.func.isRequired,
    getNeedToShipPickUpPendingAndTotalCount: PropTypes.func.isRequired,
    downloadPickUpListPDF: PropTypes.func.isRequired
}
const mapStateToProps = state => {
    const { isDownloading, receivedBytes, totalBytes } = state.warehouse.needToShip.download;
    return ({
        isDownloading,
        receivedBytes,
        totalBytes
    })
}
export default connect(mapStateToProps, {
    getNeedToShipPendingAndTotalCount,
    getNeedToShipPickUpPendingAndTotalCount,
    downloadPickUpListPDF
})(NeedToShip);