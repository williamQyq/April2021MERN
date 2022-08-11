import React from 'react';
import { ContentHeader, SubContentHeader } from 'component/utility/Layout.jsx';
import { Card, Col, Row } from 'antd';
import { Link, withRouter } from 'react-router-dom';


const outboundMenuFeatures = [
    {
        key: "needToShip",
        title: "Need to Ship",
        description: "Update Seller Inventory Quantity",
    },
    {
        key: "inventoryReceived",
        title: "Inventory Receive",
        description: "Manage received Inventory"
    }
]

class Outbound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { match: { path } } = this.props;

        return (
            <>
                <ContentHeader title="Outbound" />
                <SubContentHeader title="Wut you want💩¿¿¿" />
                <Row gutter={[24, 16]}>
                    {
                        outboundMenuFeatures.map((feature, i) => {
                            return (
                                <Col key={i} xs={16} xl={8}>
                                    <Link to={`${path}/${feature.key}`}>
                                        <Card
                                            hoverable
                                            title={feature.title}
                                        >
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

export default withRouter(Outbound);