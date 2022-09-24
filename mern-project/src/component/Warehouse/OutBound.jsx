import React from 'react';
import { ContentHeader } from 'component/utility/Layout.jsx';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';


const outboundMenuFeatures = [
    {
        key: "needToShip",
        title: "Need to Ship",
        description: "Update Seller Inventory Quantity",
    },
    {
        key: "inventoryReceived",
        title: "Inventory Receive",
        description: "Manage received Inventory",
    },
    {
        key: "searchRecord",
        title: "Search",
        description: "Search Records"
    }
]

export default class Outbound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <>
                <ContentHeader title="Outbound" />
                <Row gutter={[24, 16]}>
                    {
                        outboundMenuFeatures.map((feature, i) => {
                            return (
                                <Col key={i} xs={16} xl={8}>
                                    <Link to={`${feature.key}`}>
                                        <Card hoverable title={feature.title}>
                                            <Card.Meta description={feature.description} />
                                        </Card>
                                    </Link>
                                </Col>
                            )
                        })
                    }
                </Row>
            </>
        );
    }

}