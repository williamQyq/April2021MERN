import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { storeType } from '@src/component/utils/cmpt.global';
import {
    getBestbuyDeals,
    getMostViewedOnCategoryId,
    getViewedUltimatelyBoughtOnSku,
    getAlsoBoughtOnSku
} from '@redux-action/bestbuy.action';
import { SocketContext } from '@src/component/socket/SocketProvider';
import DealsTable, { DealsDataTableProps } from '@view/Bot/DealsTable';
import StoreAnalyticCards from './StoreAnalyticCards.jsx'
// import BackTopHelper from 'component/utility/BackTop.jsx';
import {
    handlePriceCrawlError,
    handlePriceCrawlFinished
} from '@redux-action/deal.action';
import { RootState } from '@src/redux/store/store';
import { SocketAction, SocketRoom } from '@src/component/socket/type';
import { Outlet } from 'react-router-dom';

interface BestbuyElectronicsCatgIds {
    ALL_LAPTOPS: string,
    ASUS_LAPTOPS: string,
    DELL_LAPTOPS: string,
    HP_LAPTOPS: string,
    LENOVO_LAPTOPS: string,
    SAMSUNG_LAPTOPS: string,
    SURFACE: string
}

export const categoryIdGroup: BestbuyElectronicsCatgIds = {
    ALL_LAPTOPS: 'pcmcat247400050000',
    ASUS_LAPTOPS: 'pcmcat190000050007',
    DELL_LAPTOPS: 'pcmcat140500050010',
    HP_LAPTOPS: 'pcmcat1513015098109',
    LENOVO_LAPTOPS: 'pcmcat230600050000',
    SAMSUNG_LAPTOPS: 'pcmcat1496261338353',
    SURFACE: 'pcmcat1492808199261'
}

interface IProps extends PropsFromRedux { };
interface IState {
    targetStore: string;
    mostViewedCatgId?: string;
    mostViewedSku?: string;
    mostViewedItems?: any[];
    alsoBoughtItems?: any[];
}

class BestBuyDeals extends React.Component<IProps, IState> {
    static contextType = SocketContext  //This part is important to access context values which are socket
    declare context: React.ContextType<typeof SocketContext>;
    abortController?: AbortController;

    constructor(props: IProps) {
        super(props);
        this.state = {
            targetStore: storeType.BESTBUY,
            mostViewedCatgId: undefined,
            mostViewedSku: undefined,
            mostViewedItems: undefined,
            alsoBoughtItems: undefined
        }
    }

    /**
     * @socket
     * Trigger View updates on retrieve "bestbuy deals update"
     */
    componentDidMount() {
        let socket = this.context!;
        const { targetStore } = this.state;
        // let abortSignal = this.abortController ? this.abortController.signal : undefined;
        this.abortController = new AbortController();
        this.props.getBestbuyDeals(this.abortController.signal);
        if (socket && socket.active) {
            socket.emit(SocketAction.subscribe, SocketRoom.dealsRoom);

            socket.on(SocketAction.dealsUpdated, () => {
                this.props.getBestbuyDeals(this.abortController?.signal);
            })
            socket.on(SocketAction.retrievedBBItemsOnlinePrice, (data) => {
                console.log(this.state.targetStore, data)
                this.props.handlePriceCrawlFinished(targetStore);
            })
            socket.on(SocketAction.retrievedMSItemsOnlinePrice, (err) => {
                console.error(targetStore, err);
                this.props.handlePriceCrawlError(targetStore);
            })
        }
    }

    cancelRequest = () => {
        this.abortController?.abort();
    }
    componentWillUnmount() {
        let socket = this.context;
        if (socket) socket.off(`DEAL_UPDATED`);
        this.cancelRequest();
    }

    /**
     * @description dispatch thunkAction on request mostViewed bestbuy catg products
     * @param laptopCatg 
     * @returns 
     */
    switchContent = (laptopCatg: string) => {
        let mostViewedCatgId = undefined;

        switch (laptopCatg) {
            case 'allLaptops':
                mostViewedCatgId = categoryIdGroup.ALL_LAPTOPS;
                break;
            case 'asusLaptops':
                mostViewedCatgId = categoryIdGroup.ASUS_LAPTOPS;
                break;
            case 'dellLaptops':
                mostViewedCatgId = categoryIdGroup.DELL_LAPTOPS;
                break;
            case 'hpLaptops':
                mostViewedCatgId = categoryIdGroup.HP_LAPTOPS
                break;
            case 'lenovoLaptops':
                mostViewedCatgId = categoryIdGroup.LENOVO_LAPTOPS;
                break;
            case 'samsungLaptops':
                mostViewedCatgId = categoryIdGroup.SAMSUNG_LAPTOPS;
                break;
            case 'microsoftSurfaceLaptops':
                mostViewedCatgId = categoryIdGroup.SURFACE
                break;
            default:
                mostViewedCatgId = categoryIdGroup.ALL_LAPTOPS;
                return;
        }

        if (mostViewedCatgId) {
            this.props.getMostViewedOnCategoryId(mostViewedCatgId);
            this.setState({ mostViewedCatgId });
        }
    }

    render() {
        const data: DealsDataTableProps = {
            storeName: this.state.targetStore,
            items: this.props.items,
            loading: this.props.loading
        }

        const categoryProps = {
            ...this.state,
            switchContent: this.switchContent
        }

        return (
            <>
                <DealsTable {...data} />
                <StoreAnalyticCards {...categoryProps} />
            </>
        )
    }
}


const mapStateToProps = (state: RootState) => ({
    tableState: state.item.tableState,
    loading: state.bestbuy.loading,
    items: state.bestbuy.items,
    mostViewedItems: state.bestbuy.mostViewedItems,
})

const mapDispatchToProps = {
    getBestbuyDeals,
    getAlsoBoughtOnSku,
    getMostViewedOnCategoryId,
    getViewedUltimatelyBoughtOnSku,
    handlePriceCrawlFinished,
    handlePriceCrawlError
}
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BestBuyDeals);
