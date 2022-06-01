import React from 'react';
import { ContentHeader, SubContentHeader } from 'component/utility/Layout.jsx';
import { Card, Col, Row } from 'antd';
import { Link, withRouter } from 'react-router-dom';


const outboundFeatures = [
    {
        title: "need to ship",
        description: "Update Seller Inventory Quantity",
        link: ''
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
                <SubContentHeader title="What do you want to do💩¿¿¿" />
                <Row gutter={[16, 16]}>
                    {
                        outboundFeatures.map((feature, i) => {
                            return (
                                <Col>
                                    <Link to={`${path}/needToShipUpload`}>
                                        <Card hoverable title={feature.title}>
                                            <Card.Meta
                                                title={i}
                                                description={feature.description}
                                            />
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