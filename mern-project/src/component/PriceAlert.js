import React from 'react';
import { List, Avatar } from "antd";
import { connect } from 'react-redux';
import { getItems } from '../reducers/actions/itemActions';
import PropTypes from 'prop-types';



class PriceAlert extends React.Component {
    componentDidMount(){
        this.props.getItems();
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
                    </List.Item>
                )}
            />
        );
    }
}

PriceAlert.propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    item: state.item
})

export default connect(mapStateToProps, {getItems})(PriceAlert);