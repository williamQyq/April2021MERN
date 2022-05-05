import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Col, Row, Skeleton, Typography, Menu } from 'antd';
import { SubContentHeader, SearchBox } from './StoreTableUtilities';
import './Store.scss';
import { getAlsoBoughtOnSku, getViewedUltimatelyBoughtOnSku } from 'reducers/actions/itemBBActions';
const { Text } = Typography;

const menuItems = [
    {
        key: "allLaptops",
        label: "All Laptops"
    },
    {
        key: "asusLaptops",
        label: "Asus Laptops"
    },
    {
        key: "dellLaptops",
        label: "Dell Laptops",
    },
    {
        key: "hpLaptops",
        label: "Hp Laptops"
    },
    {
        key: "samsungLaptops",
        label: "Samsung Laptops"
    },
    {
        key: "microsoftSurfaceLaptops",
        label: "Surface"
    },
    {
        key: "alsoBoughtOnSku",
        label: <SearchBox name={'alsoBoughtOnSku'} reduxAction={getAlsoBoughtOnSku} />
    },
    {
        key: "ultiBoughtOnSku",
        label: <SearchBox name={'ultimatelyBoughtOnSku'} reduxAction={getViewedUltimatelyBoughtOnSku} />
    }
]


class StoreAnalyticCards extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedMenuKey: 'allLaptops'
        }

    }

    handleCardGridClick = () => {

    }
    handleSelectedMenuKeyChange = (key) => {
        this.setState({ selectedMenuKey: key })
        this.props.switchContent(key)
    }
    render() {
        const mostViewedItems = this.props.mostViewedItems ? this.props.mostViewedItems : []
        const { selectedMenuKey } = this.state;
        return (
            <>
                <SubContentHeader title="Most Viewed Ultimately Bought" />
                <Menu
                    onClick={e => this.handleSelectedMenuKeyChange(e.key)}
                    selectedKeys={[selectedMenuKey]}
                    mode="horizontal"
                    items={menuItems}
                />
                <Skeleton active loading={this.props.loading}>
                    <Row gutter={[16, 16]}>
                        {
                            mostViewedItems.map((item, i) => {
                                return (
                                    <Col span={6} key={i.toString()} >
                                        <Card
                                            className='most-viewed-cards'
                                            hoverable
                                            title={item.names.title}
                                            cover={
                                                <div className='card-cover'>
                                                    <img className="card-image" alt="laptop" src={item.images.standard} />
                                                </div>
                                            }
                                        >
                                            <Card.Meta
                                                className='card-content'
                                                title={`rank - ${i + 1}`}
                                                description={
                                                    <>
                                                        <Text>Sku - {item.sku}</Text><br />
                                                        <Text>Regular - ${item.prices.regular}</Text><br />
                                                        <Text>Current - ${item.prices.current}</Text><br />
                                                        <Text>Score: {item.customerReviews.averageScore}    Count: {item.customerReviews.count}</Text>
                                                    </>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Skeleton>

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