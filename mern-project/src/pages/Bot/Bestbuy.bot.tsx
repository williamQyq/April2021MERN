import React from 'react';
import { connect } from 'react-redux';
import { storeType } from '@src/component/utils/cmpt.global';
import {
    getBestbuyDeals,
    getMostViewedOnCategoryId,
    getViewedUltimatelyBoughtOnSku,
    getAlsoBoughtOnSku
} from '@redux-action/bestbuy.action.js';
import { SocketContext, socketType } from '@src/component/socket/SocketProvider';
import StoreTable from './StoreTable.jsx';
import StoreAnalyticCards from './StoreAnalyticCards.jsx'
// import BackTopHelper from 'component/utility/BackTop.jsx';
import {
    handleErrorOnRetrievedItemsOnlinePrice,
    handleOnRetrievedItemsOnlinePrice
} from '@redux-action/itemActions.js';
import { ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '@src/redux/store/store.js';

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

interface IProps {
    items: any;
    loading: boolean;
    getBestBuyDeals: () => ThunkAction<void, RootState, any, AnyAction>;
    getMostViewedOnCategoryId: (catgId: string) => ThunkAction<void, RootState, any, AnyAction>;
    handleOnRetrievedItemsOnlinePrice: (targetStore: string, msg: unknown) => ThunkAction<void, RootState, any, AnyAction>;
    handleErrorOnRetrievedItemsOnlinePrice: (targetStore: string, msg: unknown) => ThunkAction<void, RootState, any, AnyAction>;
}
interface IState {
    targetStore: string;
    mostViewedCatgId: string | undefined;
    mostViewedSku: string | undefined;
    mostViewedItems: {};
    alsoBoughtItems: {};
}

class BestBuyDeals extends React.Component<IProps, IState> {
    static contextType = SocketContext  //This part is important to access context values which are socket
    declare context: React.ContextType<typeof SocketContext>;

    constructor(props: IProps) {
        super(props);
        this.state = {
            targetStore: storeType.BESTBUY,
            mostViewedCatgId: undefined,
            mostViewedSku: undefined,
            mostViewedItems: {},
            alsoBoughtItems: {}
        }
    }

    /**
     * @socket
     * Trigger View updates on retrieve "bestbuy deals update"
     */
    componentDidMount() {
        let socket = this.context!;
        const { targetStore } = this.state;
        socket.emit(`subscribe`, `StoreListingRoom`);
        this.props.getBestBuyDeals();

        socket.on('Store Listings Update', () => {
            this.props.getBestBuyDeals();
        })

        socket.on(socketType.ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE, (data) => {
            console.log(this.state.targetStore, data)
            this.props.handleOnRetrievedItemsOnlinePrice(targetStore, data.msg);
        })
        socket.on(socketType.RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR, (err) => {
            this.props.handleErrorOnRetrievedItemsOnlinePrice(targetStore, err.msg);
        })
    }

    componentWillUnmount() {
        let socket = this.context!;
        socket.emit(`unsubscribe`, `StoreListingRoom`)
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
        const data = {
            storeName: this.state.targetStore,
            items: this.props.items,
            loading: this.props.loading
        }

        const categoryProps = {
            switchContent: this.switchContent,
            selectedMostViewedCategoryId: this.state.mostViewedCatgId,
            selectedMostViewedSku: this.state.mostViewedSku,
            mostViewedItems: this.state.mostViewedItems,
            alsoBoughtItems: this.state.alsoBoughtItems,
        }

        return (
            <>
                <StoreTable {...data} />
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

export default connect(mapStateToProps, {
    getBestbuyDeals,
    getMostViewedOnCategoryId,
    getViewedUltimatelyBoughtOnSku,
    getAlsoBoughtOnSku,
    handleOnRetrievedItemsOnlinePrice,
    handleErrorOnRetrievedItemsOnlinePrice
})(BestBuyDeals);