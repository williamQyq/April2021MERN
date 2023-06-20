import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { SocketContext } from '@src/component/socket/SocketProvider';
import StoreTable, { DealsDataTableProps } from '@view/Bot/DealsTable';
import { storeType } from '@src/component/utils/cmpt.global';
import {
    handlePriceCrawlError,
    handlePriceCrawlFinished
} from '@redux-action/deal.action';
import { getMicrosoftDeals } from '@redux-action/microsoft.action';
import { RootState } from '@src/redux/store/store';
import { SocketAction } from '@src/component/socket/type';
import { ContentLayout } from '@src/component/utils/Layout';

interface IProps extends PropsFromRedux {
}
interface IState {
    targetStore: string
}

class MicrosoftDeals extends React.Component<IProps, IState> {
    static contextType = SocketContext;
    declare context: React.ContextType<typeof SocketContext>;
    constructor(props: IProps) {
        super(props);
        this.state = {
            targetStore: storeType.MICROSOFT
        };

    }

    componentDidMount() {
        const { socket } = this.context!;
        const { targetStore } = this.state;
        this.props.getMicrosoftDeals();
        if (socket && socket.active) {
            socket.emit(`subscribe`, `StoreListingRoom`);
            socket.on('Store Listings Update', () => {
                this.props.getMicrosoftDeals();
            })
            socket.on(SocketAction.retrievedMSItemsOnlinePrice, (data) => {
                console.log(targetStore, data);
                this.props.handlePriceCrawlFinished(targetStore);
            })
            socket.on(SocketAction.retrievedMSItemsOnlinePriceErr, (data) => {
                this.props.handlePriceCrawlError(targetStore);
            })
        }
    }
    componentWillUnmount() {
        const { socket } = this.context!;
        if (socket) socket.emit(`unsubscribe`, `StoreListingRoom`)
    }

    render() {
        const data: DealsDataTableProps = {
            storeName: this.state.targetStore,
            items: this.props.items,
            loading: this.props.loading
        }
        return (
            <ContentLayout>
                <StoreTable {...data} />
            </ContentLayout>
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

export default connector(MicrosoftDeals);