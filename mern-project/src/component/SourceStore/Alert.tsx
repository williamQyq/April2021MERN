import React from 'react';
import { CiShoppingTag } from 'react-icons/ci';
import IconCover from 'component/utility/IconCover.jsx'
import { ContentHeader } from 'component/utility/Layout.jsx';
import { Row, Col, Card } from 'antd';
import { Link } from 'react-router-dom';
import { MenuOption } from 'types';

const alertFeatures: MenuOption[] = [
    {
        key: "bestbuy-list",
        title: "Bestbuy Deal",
        description: "Bestbuy Deal Lookup",
        cover: <IconCover Icon={CiShoppingTag} />
    },
    {
        key: "microsoft-list",
        title: "Microsoft Deal",
        description: "MicroSoft Deal Lookup",
        cover: <IconCover Icon={CiShoppingTag} />
    },
    {
        key: "walmart-list",
        title: "Walmart Deal",
        description: "Walmart Deal Lookup",
        cover: <IconCover Icon={CiShoppingTag} />
    }
]

const Alert: React.FC = () => {
    return (
        <>
            <ContentHeader title="Deal Alert" />
            <Row gutter={[8, 12]}>
                {
                    alertFeatures.map((feature, i) => {
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

export default Alert;