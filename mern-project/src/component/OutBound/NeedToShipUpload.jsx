import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List } from 'antd';
import { SocketContext } from 'component/socket/socketContext';
import { NeedToShipMenu } from 'component/OutBound/Menus.jsx';
import DescriptionCard from 'component/utility/DescriptionCard.jsx';
import { getNeedToShipFromShipment } from 'reducers/actions/outboundActions.js';

class NeedToShipUpload extends React.Component {
    // static contextType = SocketContext //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        this.props.getNeedToShipFromShipment();
        // let socket = this.context
        // socket.emit(`subscribe`, `OutboundRoom`);

    }

    componentWillUnmount() {
        // let socket = this.context
        // socket.emit(`unsubscribe`, `OutboundRoom`)
    }

    render() {
        const { needToShipItems } = this.props;
        return (
            <>
                <NeedToShipMenu />
                <List
                    dataSource={needToShipItems}
                    size="default"
                    renderItem={(item) => (
                        <List.Item key={item.orderID}> <DescriptionCard detail={item} /></List.Item>
                    )}
                />
            </>

        );
    }
}

NeedToShipUpload.prototypes = {
    needToShipItems: PropTypes.array.isRequired,
    needToShipItemsLoading: PropTypes.bool.isRequired,
    getNeedToShipFromShipment: PropTypes.func.isRequired,
}
const mapStateToProps = (state) => ({
    needToShipItems: state.warehouse.needToShip.items,
    needToshipItemsLoading: state.warehouse.needToShip.itemsLoading
})

export default connect(mapStateToProps, { getNeedToShipFromShipment })(NeedToShipUpload);