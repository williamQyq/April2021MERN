import React from 'react';
import { connect } from 'react-redux';
import {
    getBBItems,
    getMostViewedOnCategoryId,
    getViewedUltimatelyBoughtOnSku,
    getAlsoBoughtOnSku
} from 'reducers/actions/itemBBActions.js';
import PropTypes from 'prop-types';
import { SocketContext, socketType } from 'component/socket/socketContext.js';
import StoreTable from 'component/SourceStore/StoreTable.jsx';
import StoreAnalyticCards from 'component/SourceStore/StoreAnalyticCards.jsx'
// import BackTopHelper from 'component/utility/BackTop.jsx';
import { categoryIdGroup, storeType } from './data.js'
import {
    handleErrorOnRetrievedItemsOnlinePrice,
    handleOnRetrievedItemsOnlinePrice
} from 'reducers/actions/itemActions.js';

class BB extends React.Component {
    static contextType = SocketContext  //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            store: storeType.BESTBUY,
            selectedMostViewedCategoryId: "",
        }
    }

    componentDidMount() {
        let socket = this.context;
        socket.emit(`subscribe`, `StoreListingRoom`);
        this.props.getBBItems();

        socket.on('Store Listings Update', () => {
            this.props.getBBItems()
        })

        socket.on(socketType.ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE, (data) => {
            this.props.handleOnRetrievedOnlinePrice(this.props.store, data.msg);
        })
        socket.on(socketType.FAILED_RETRIEVE_BB_ITEMS_ONLINE_PRICE, (data) => {
            this.props.handleOnRetrievedOnlinePrice(this.props.store, data.msg);
        })
    }
    componentWillUnmount() {
        let socket = this.context;
        socket.emit(`unsubscribe`, `StoreListingRoom`)
    }

    switchContent = (key) => {
        switch (key) {
            case 'allLaptops':
                this.setState({ selectedMostViewedCategoryId: categoryIdGroup.ALL_LAPTOPS });
                this.props.getMostViewedOnCategoryId(categoryIdGroup.ALL_LAPTOPS);

                break;
            case 'asusLaptops':
                this.setState({ selectedMostViewedCategoryId: categoryIdGroup.ASUS_LAPTOPS });
                this.props.getMostViewedOnCategoryId(categoryIdGroup.ASUS_LAPTOPS)

                break;
            case 'dellLaptops':
                this.setState({ selectedMostViewedCategoryId: categoryIdGroup.DELL_LAPTOPS });
                this.props.getMostViewedOnCategoryId(categoryIdGroup.DELL_LAPTOPS)

                break;
            case 'hpLaptops':
                this.setState({ selectedMostViewedCategoryId: categoryIdGroup.HP_LAPTOPS });
                this.props.getMostViewedOnCategoryId(categoryIdGroup.HP_LAPTOPS)

                break;
            case 'lenovoLaptops':
                this.setState({ selectedMostViewedCategoryId: categoryIdGroup.LENOVO_LAPTOPS });
                this.props.getMostViewedOnCategoryId(categoryIdGroup.LENOVO_LAPTOPS);

                break;
            case 'samsungLaptops':
                this.setState({ selectedMostViewedCategoryId: categoryIdGroup.SAMSUNG_LAPTOPS });
                this.props.getMostViewedOnCategoryId(categoryIdGroup.SAMSUNG_LAPTOPS)

                break;
            case 'microsoftSurfaceLaptops':
                this.setState({ selectedMostViewedCategoryId: categoryIdGroup.SURFACE });
                this.props.getMostViewedOnCategoryId(categoryIdGroup.SURFACE)

                break;
            default:
                // this.setState({ selectedMostViewedCategoryId: '' })
                return;
        }
    }

    render() {
        const data = {
            store: this.state.store,
            items: this.props.items,
            loading: this.props.loading
        }

        const categoryProps = {
            switchContent: this.switchContent,
            selectedMostViewedCategoryId: this.state.selectedMostViewedCategoryId,
            selectedMostViewedSku: this.state.selectedMostViewedSku,
            mostViewedItems: this.props.mostViewedItems,
            alsoBoughtItems: this.props.alsoBoughtItems,
        }

        return (
            <>
                <StoreTable {...data} />
                <StoreAnalyticCards {...categoryProps} />
            </>
        )
    }
}

BB.prototypes = {
    getBBItems: PropTypes.func.isRequired,
    getMostViewedOnCategoryId: PropTypes.func.isRequired,
    getAlsoBoughtOnSku: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    mostViewedItems: PropTypes.array.isRequired,
    tableState: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
    items: state.bestbuy.items,
    mostViewedItems: state.bestbuy.mostViewedItems,
    tableState: state.item.tableState,
    loading: state.bestbuy.loading
})

export default connect(mapStateToProps, {
    getBBItems,
    getMostViewedOnCategoryId,
    getViewedUltimatelyBoughtOnSku,
    getAlsoBoughtOnSku,
    handleOnRetrievedItemsOnlinePrice,
    handleErrorOnRetrievedItemsOnlinePrice
})(BB);