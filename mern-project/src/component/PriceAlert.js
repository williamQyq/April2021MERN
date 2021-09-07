import React from 'react';
import { connect } from 'react-redux';
import { getItems, deleteItem } from '../reducers/actions/itemActions';
import PropTypes from 'prop-types';
import { Button, List, Row } from 'antd';
import '../styles/priceAlert.scss';
import {
    LaptopOutlined,
} from '@ant-design/icons';
import { Typography, Layout } from 'antd';

import AddItemModal from "./AddItemModal";
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
        return item.price_timestamps.at(-1).price ?  item.price_timestamps.at(-1).price : "Loading";
    }

    getRecentChangedPrice = (item) => {
        const price_timestamps = item.price_timestamps;
        const most_recent_price = this.getMostRecentPrice(item);
        for(let i = price_timestamps.length-1; i>=0; i--){
            if(price_timestamps[i].price !== most_recent_price){
                return price_timestamps[i].price;
            }
        }
    }

    render() {
        const data = this.props.item.items;
        return (
            <React.Fragment>
                <Row gutter={16} style= {{alignItems: 'center'}}>
                    <Title className="title">Lists</Title>
                    <AddItemModal/>
                </Row>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta className="list-item"
                                avatar={<LaptopOutlined twoToneColor="#52c41a" />}
                                title={<a href={item.link} target="_blank" rel="noopener noreferrer">{this.getItemName(item)}</a>}
                                description={item.created_date}
                            />
                            {this.getRecentChangedPrice(item) > 0?
                                <Text className="list-item-recent-changed-price" delete>${this.getRecentChangedPrice(item)}</Text> : 
                                <Text className="list-item-recent-changed-price" delete> Was $ </Text>
                            }
                            
                            {this.getMostRecentPrice(item)!==-1? 
                                <Text className={this.getMostRecentPrice(item)<this.getRecentChangedPrice(item)? "list-item-price-down":"list-item-price-up" }>
                                    ${this.getMostRecentPrice(item)}</Text> : <Text className="list-item-price-oos">OUT OF STOCK
                                </Text>
                            }
                            <Button danger type="link" onClick={this.onDeleteClick.bind(this, item._id)}> Delete </Button>
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