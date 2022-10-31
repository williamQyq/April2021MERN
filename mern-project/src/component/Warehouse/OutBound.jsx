import React from 'react';
import { ContentHeader } from 'component/utility/Layout.jsx';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import IconCover from 'component/utility/IconCover.jsx';
import { FaTruckLoading, FaWarehouse, FaSearch } from 'react-icons/fa';

const outboundMenuFeatures = [
    {
        key: "needToShip",
        title: "Need to Ship",
        description: "Update Seller Inventory Quantity",
        cover: <IconCover Icon={FaTruckLoading} />
    },
    {
        key: "inventoryReceived",
        title: "Inventory Receive",
        description: "Manage received Inventory",
        cover: <IconCover Icon={FaWarehouse} />
    },
    {
        key: "searchRecord",
        title: "Search",
        description: "Search Records",
        cover: <IconCover Icon={FaSearch} />
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
                <Row gutter={[8, 12]}>
                    {
                        outboundMenuFeatures.map((feature, i) => {
                            return (
                                <Col key={i} span={6}>
                                    <Link to={`${feature.key}`}>
                                        <Card
                                            style={{ width: 300, height: 400, borderRadius: "8px" }}
                                            hoverable
                                            cover={feature.cover}
                                        >
                                            <Card.Meta title={feature.title} description={feature.description} />
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