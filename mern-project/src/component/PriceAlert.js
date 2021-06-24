import React from 'react';
import { List, Avatar } from "antd";
import { connect } from 'react-redux';
import { getItems, deleteItem } from '../reducers/actions/itemActions';
import PropTypes from 'prop-types';
import { Button } from 'antd';


class PriceAlert extends React.Component {
    
    componentDidMount(){
        this.props.getItems();
    }

    onDeleteClick = (id) => {
        this.props.deleteItem(id);
    }

    render(){
        const data = this.props.item.items;
        return(
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        }
                        title={<a href="https://ant.design">{item.name}</a>}
                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                        <div>{item.price}</div>
                        <Button danger onClick={this.onDeleteClick.bind(this, item.id)}> delete </Button>
                    </List.Item>
                )}
            />
        );
    }
}

PriceAlert.propTypes = {
    getItems: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    item: state.item
})

export default connect( mapStateToProps, { getItems, deleteItem })(PriceAlert);