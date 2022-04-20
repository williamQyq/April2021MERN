import React from 'react';
import { Card, Col, Row } from 'antd';
import { SubContentHeader } from './StoreTableUtilities';

const gridStyle = {
    width: '50%',
    textAlign: 'center',
};
const mostViewedProducts = new Array(10).fill({
    sku: "6457790",
    title: "Samsung - Galaxy Book Pro 360 15.6\" AMOLED Touch-Screen Laptop - Intel Evo Platform Core i7 - 16GB Memory - 1TB SSD - Mystic Navy",
    prices: {
        regular: 1499.99,
        current: 1499.99
    },
    rank: "1",
})
const mostViewedUltiBoughtProducts = new Array(10).fill({
    sku: "6457790",
    title: "Samsung - Galaxy Book Pro 360 15.6\" AMOLED Touch-Screen Laptop - Intel Evo Platform Core i7 - 16GB Memory - 1TB SSD - Mystic Navy",
    prices: {
        regular: 1499.99,
        current: 1499.99
    },
    rank: "1",
})
export default class StoreAnalyticCards extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }

    handleCardGridClick = () => {

    }

    render() {

        return (
            <>
                <SubContentHeader title="Most Viewed" />
                <Row gutter={[16, 16]}>
                    {
                        mostViewedProducts.map((mvProduct, i) => {
                            return (
                                <Col span={8} key={i.toString()} >
                                    <Card title="MVUB">
                                        {
                                            mostViewedUltiBoughtProducts.map((product, j) => (
                                                <Card.Grid
                                                    key={`${i}-${j}`}
                                                    hoverable={true}
                                                    style={gridStyle}
                                                    onClick={this.handleCardGridClick}
                                                >
                                                    {product.title}
                                                </Card.Grid>
                                            ))
                                        }
                                    </Card>
                                </Col>
                            )
                        })
                    }

                </Row>
            </>
        );
    }

}