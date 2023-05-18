import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { SocketContext, socketType } from '@src/component/socket/SocketProvider';
import StoreTable from '@view/Bot/StoreTable.jsx';
import { storeType } from '@src/component/utils/cmpt.global';
import {
    handlePriceCrawlError,
    handlePriceCrawlFinished
} from '@redux-action/deal.action';
import { getMicrosoftDeals } from '@redux-action/itemMSActions.js';
import { RootState } from '@src/redux/store/store';

interface IProps extends PropsFromRedux {
}
interface IState {
    targetStore: string
}

class MS extends React.Component<IProps, IState> {
    static contextType = SocketContext;
    declare context: React.ContextType<typeof SocketContext>;
    constructor(props: IProps) {
        super(props);
        this.state = {
            targetStore: storeType.MICROSOFT
        };

    }

    componentDidMount() {
        let socket = this.context!;
        const { targetStore } = this.state;
        socket.emit(`subscribe`, `StoreListingRoom`);
        this.props.getMicrosoftDeals();
        socket.on('Store Listings Update', () => {
            this.props.getMicrosoftDeals();
        })
        socket.on(socketType.ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE, (data) => {
            console.log(targetStore, data);
            this.props.handlePriceCrawlFinished(targetStore);
        })
        socket.on(socketType.RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR, (data) => {

            this.props.handlePriceCrawlError(targetStore);
        })
    }
    componentWillUnmount() {
        let socket = this.context!;
        socket.emit(`unsubscribe`, `StoreListingRoom`)
    }

    render() {
        const data = {
            storeName: this.state.targetStore,
            items: this.props.items,
            loading: this.props.loading
        }
        return (
            <StoreTable {...data} />
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    items: state.microsoft.items,
    tableState: state.item.tableState,
    loading: state.microsoft.loading
})


const connector = connect(mapStateToProps, {
    getMicrosoftDeals,
    handlePriceCrawlFinished,
    handlePriceCrawlError
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(MS);