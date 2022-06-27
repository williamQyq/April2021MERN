import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List } from 'antd';
import { SocketContext } from 'component/socket/socketContext';
import { NeedToShipMenu } from 'component/OutBound/Menus.jsx';
import DescriptionCard from 'component/utility/DescriptionCard.jsx';
import { getNeedToShipFromShipment } from 'reducers/actions/outboundActions.js';


const data = [
    {
        _id: "1ZA813770292991910",
        orderID: "2022627-202202-M07084-Upgrade-111-7031300-5425820",
        orgNm: "M",
        rcIts: [{ UPC: "123", qty: 1 }],
        crtTm: "2022-06-27 T 09H19M59S"
    },
    {
        _id: "1ZA813770292991910",
        orderID: "2022627-202202-M07084-Upgrade-111-7031300-5425820",
        orgNm: "M",
        rcIts: [{ UPC: "123", qty: 1 }],
        crtTm: "2022-06-27 T 09H19M59S"
    }

]


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

        return (
            <>
                <NeedToShipMenu />
                <List
                    size="small"
                    dataSource={data}
                    renderItem={item =>
                        <List.Item> <DescriptionCard detail={item} /></List.Item>
                    }
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
    // needToShipItems: state.needToShip.items,
    // needToshipItemsLoading: state.needToShip.itemsLoading
})

export default connect(mapStateToProps, { getNeedToShipFromShipment })(NeedToShipUpload);