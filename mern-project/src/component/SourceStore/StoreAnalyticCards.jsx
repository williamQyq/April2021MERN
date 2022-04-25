import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Col, Row, Typography } from 'antd';
import { SubContentHeader } from './StoreTableUtilities';
import './Store.scss';
const { Text } = Typography;

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
class StoreAnalyticCards extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mostViewedItems: []
        }

    }

    handleCardGridClick = () => {

    }

    render() {
        const { mostViewedItems } = this.props
        return (
            <>
                <SubContentHeader title="Most Viewed Ultimately Bought" />
                <Row gutter={[16, 16]}>
                    {
                        mostViewedItems.map((item, i) => {
                            return (
                                <Col span={6} key={i.toString()} >
                                    <Card
                                        className='most-viewed-cards'
                                        hoverable
                                        title={item.names.title}
                                        cover={<img className="card-image" alt="laptop" src={item.images.standard}
                                        />}>
                                        <Card.Meta
                                            className='card-content'
                                            title={`rank - ${i + 1}`}
                                            description={
                                                <>
                                                    <Text>Sku - {item.sku}</Text><br/>
                                                    <Text>Regular - ${item.prices.regular}</Text><br/>
                                                    <Text>Current - ${item.prices.current}</Text><br/>
                                                    <Text>Score: {item.customerReviews.averageScore}    Count: {item.customerReviews.count}</Text>
                                                </>
                                            }
                                        />

                                        {/* {
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
                                        } */}

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

StoreAnalyticCards.proppTypes = {
    mostViewedItems: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    mostViewedItems: state.bestbuy.mostViewedItems,
    loading: state.bestbuy.mostViewedItemsLoading
})

export default connect(mapStateToProps, null)(StoreAnalyticCards);