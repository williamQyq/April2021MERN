import React from 'react';
import { GrAmazon } from 'react-icons/gr';
import { TbHeartRateMonitor } from 'react-icons/tb';
import { RiUploadCloud2Line } from 'react-icons/ri';
import IconCover from 'component/utility/IconCover.jsx'
import { ContentHeader } from 'component/utility/Layout.jsx';
import { Row, Col, Card } from 'antd';
import { Link } from 'react-router-dom';
import { MenuOption } from 'types';


const operationFeatures: MenuOption[] = [
    {
        key: "amazon-products-list",
        title: "Amazon Management",
        description: "Amazon SKU management",
        cover: <IconCover Icon={GrAmazon} />
    },
    {
        key: "amazon-surveillance",
        title: "Amazon Surveillance",
        description: "Amazon sku follower surveillance, Amazon price surveillance, wrong config surveillance",
        cover: <IconCover Icon={TbHeartRateMonitor} />
    },
    {
        key: "amazon-listing-template",
        title: "Amazon Listing Template",
        description: "Generate Amazon Listing Upload Template",
        cover: <IconCover Icon={RiUploadCloud2Line} />
    }
]

const Operation: React.FC = () => {
    return (
        <>
            <ContentHeader title="Amazon" />
            <Row gutter={[8, 12]}>
                {
                    operationFeatures.map((feature, i) => {
                        return (
                            <Col key={i} span={8}>
                                <Link to={`${feature.key}`}>
                                    <Card
                                        style={{ width: 400, height: 500, borderRadius: "8px" }}
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

export default Operation;