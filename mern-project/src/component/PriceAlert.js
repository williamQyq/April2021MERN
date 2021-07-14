import React from 'react';
import { List } from "antd";
import { connect } from 'react-redux';
import { getItems, deleteItem } from '../reducers/actions/itemActions';
// import PropTypes from 'prop-types';
import { Button } from 'antd';
import '../styles/priceAlert.scss';
import {
    LaptopOutlined,
} from '@ant-design/icons';
import AddItemModal from "./AddItemModal"

import io from 'socket.io-client';
const socket = io()

class PriceAlert extends React.Component {
    
    
    componentDidMount(){
        this.props.getItems();
    }

    onDeleteClick = (_id) => {
        this.props.deleteItem(_id);
    }

    render(){
        const data = this.props.item.items;
        return(
            <div>
            <AddItemModal/>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta className="list-item"
                        avatar={
                            // <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            <LaptopOutlined twoToneColor="#52c41a"/>
                        }
                        title={<a href={item.link} target="_blank" rel="noopener noreferrer">{item.name}</a>}
                        description={item.date}
                        />
                        <div className="list-item-price">${item.price}</div>
                        <Button danger onClick={this.onDeleteClick.bind(this, item._id)}> delete </Button>
                    </List.Item>
                )}
            />
            </div>
        );
    }
}

// PriceAlert.propTypes = {
//     getItems: PropTypes.func.isRequired,
//     deleteItem: PropTypes.func.isRequired,
//     item: PropTypes.object.isRequired,
// }

const mapStateToProps = (state) => ({
    item: state.item
})

export default connect( mapStateToProps, { getItems, deleteItem })(PriceAlert);