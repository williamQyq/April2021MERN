import React from 'react';
import { MenuOption } from 'types';
import { ContentHeader } from './Layout';
import { Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

interface CategoryOption extends MenuOption { };

interface IProps {
    title: string;
    categories: CategoryOption[];
}
const { Meta } = Card;
const Category: React.FC<IProps> = (props) => {
    const { title, categories } = props;
    return (
        <>
            <ContentHeader title={title} />
            <Row gutter={[2,16]} >
                {
                    categories.map((ctg, i) => {
                        return (
                            <Col key={i} xs={24} lg={12} xl={8} xxl={6}>
                                <Link to={`${ctg.key}`}>
                                    <Card
                                        style={{ width: 300, height: 400, borderRadius: "8px" }}
                                        hoverable
                                        cover={ctg.cover}
                                    >
                                        <Meta title={ctg.title} description={ctg.description} />
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

export default Category;