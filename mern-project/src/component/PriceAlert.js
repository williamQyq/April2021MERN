import React from 'react';
import { connect } from 'react-redux';
import { getItems, deleteItem } from '../reducers/actions/itemActions';
import PropTypes from 'prop-types';
import '../styles/priceAlert.scss';
import {
    LaptopOutlined,
} from '@ant-design/icons';
import { Typography, Layout, Row, Col, Button, List } from 'antd';

import AddItemModal from "./AddItemModal";
import ItemDetail from "./ItemDetail";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

class PriceAlert extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            socket: this.props.socket,
            change: {},
        }
    }
    componentDidMount() {
        const socket = this.state.socket;
        this.props.getItems();
        
        socket.on(`server:changestream`, listing => {
            this.setState({ change: listing });
            this.props.getItems();

        });
    }

    onDeleteClick = (_id) => {
        this.props.deleteItem(_id);

    }
    getItemName = (item) => {
        return item.name ? item.name : "Loading";
    }

    getMostRecentPrice = (item) => {
        return item.price_timestamps.at(-1).price ? item.price_timestamps.at(-1).price : "Loading";
    }

    getPriceBeforeChanged = (item) => {
        const price_timestamps = item.price_timestamps;
        const most_recent_price = this.getMostRecentPrice(item);
        for (let i = price_timestamps.length - 1; i >= 0; i--) {
            if (price_timestamps[i].price !== most_recent_price && price_timestamps[i].price !== null) {
                return price_timestamps[i].price;
            }
        }
        // return price_timestamps[1].price;
    }
    getItemUPC = (item)=> {
        return item.upc ? item.upc : ""
    }

    render() {
        const data = this.props.item.items;
        return (

            <React.Fragment>
                <Row gutter={16} style={{ alignItems: 'center' }}>
                    <Title className="title">Lists</Title>
                    <AddItemModal />
                </Row>

                <List 
                    className= "item-list"
                    alignItems='center'
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item className="list-item" actions={[<Button danger type="link" onClick={this.onDeleteClick.bind(this, item._id)}> Delete </Button>]}>

                            <Link to='/item-detail' className="list-item-link">
                                
                                <List.Item.Meta className="list-item-meta"
                                    avatar={<LaptopOutlined twoToneColor="#52c41a" />}
                                    title={<Title level={5}>{this.getItemName(item)}</Title>}
                                    description={<React.Fragment>
                                    <Text className="list-item-upc">UPC: {this.getItemUPC}</Text>
                                    <Text>{item.created_date}</Text>
                                    </React.Fragment>
                                }
                                />


                                {this.getPriceBeforeChanged(item) > 0 ?
                                    <Text className="list-item-price-before-changed" delete>${this.getPriceBeforeChanged(item)}</Text> :
                                    <Text className="list-item-price-before-changed" delete> Was $ </Text>
                                }


                                {this.getMostRecentPrice(item) !== -1 ?
                                    <Text className={this.getMostRecentPrice(item) < this.getPriceBeforeChanged(item) ? "list-item-price-down" : "list-item-price-up"}>
                                        ${this.getMostRecentPrice(item)}</Text> : <Text className="list-item-price-oos">OUT OF STOCK
                                    </Text>
                                }
                            </Link>
                        </List.Item>
                    )}
                />
            </React.Fragment>
        );
    }
}

PriceAlert.prototypes = {
    getItems: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    item: state.item
})

export default connect(mapStateToProps, { getItems, deleteItem })(PriceAlert);