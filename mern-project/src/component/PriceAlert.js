import React from 'react';
import PropTypes from 'prop-types';
import 'styles/priceAlert.scss';
import {
    LaptopOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    DownOutlined
} from '@ant-design/icons';
import { Typography, Row, Button, List, Menu, Dropdown, Divider } from 'antd';
import { connect } from 'react-redux';
import { getItems, deleteItem } from 'reducers/actions/itemActions';
import AddItemModal from "component/utility/AddItemModal.js";

const { Title, Text } = Typography;

class PriceAlert extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            socket: this.props.socket,
            change: false,
        }
    }
    componentDidMount() {
        const socket = this.state.socket;
        this.props.getItems();

        socket.on(`server:changestream`, () => {
            this.setState({ change: true });
            this.props.getItems();
        });

        this.setState({ change: false });
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
        return false
    }
    getItemUPC = (item) => {
        return item.upc ? item.upc : ""
    }

    render() {

        const data = this.props.item.items;
        const menu = (
            <Menu>
                <Menu.Item disabled>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                        <SearchOutlined />
                    </a>
                </Menu.Item>
                <Menu.Item disabled>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                        <ShoppingCartOutlined />
                    </a>
                </Menu.Item>
            </Menu>
        );

        return (

            <React.Fragment>
                <Row gutter={16}>
                    <Title level={3} className="title">Watch List</Title>
                    <AddItemModal />
                </Row>
                <Divider />
                <List
                    className="item-list"
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item className="list-item" actions={[
                            <Button danger type="link" onClick={this.onDeleteClick.bind(this, item._id)}> Delete </Button>,
                            <Dropdown overlay={menu} placement="bottomCenter">
                                <a href="# " className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                    Actions<DownOutlined />
                                </a>
                            </Dropdown>
                        ]}>

                            {/* <Link to='/item-detail' className="list-item-link"> */}

                                <List.Item.Meta
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
                                    <Text className="list-item-price-before-changed" delete>${this.getMostRecentPrice(item)}</Text>
                                }

                                {this.getMostRecentPrice(item) !== -1 ?
                                    <Text className={this.getMostRecentPrice(item) < this.getPriceBeforeChanged(item) ? "list-item-price-down" : "list-item-price-up"}>
                                        ${this.getMostRecentPrice(item)}</Text> : <Text className="list-item-price-oos">OUT OF STOCK
                                    </Text>
                                }
                            {/* </Link> */}
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