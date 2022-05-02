import React from 'react';
import { connect } from 'react-redux';
import {
    getBBItems,
    getMostViewedOnCategoryId,
    getViewedUltimatelyBoughtOnSku,
    getAlsoBoughtOnSku
} from 'reducers/actions/itemBBActions';
import PropTypes from 'prop-types';
import { SocketContext } from 'component/socket/socketContext.js';
import StoreTable from 'component/SourceStore/StoreTable.jsx';
import StoreAnalyticCards from 'component/SourceStore/StoreAnalyticCards.jsx'
import BackTopHelper from 'component/utility/BackTop.jsx';
import { categoryIdGroup } from './data.js'

class BB extends React.Component {
    static contextType = SocketContext  //This part is important to access context values which are socket
    constructor(props) {
        super(props);
        this.state = {
            store: "BESTBUY",
            selectedMostViewedCategoryId: 'pcmcat138500050001',
            selectedMostViewedSku: '',
            selectedUltimatelyBoughtOnSku: '',
            selectedAlsoBoughtSku: '',
        }
    }

    componentDidMount() {
        let socket = this.context;
        const defaultMostViewedCategoryId = this.state.selectedMostViewedCategoryId;
        socket.emit(`subscribe`, `StoreListingRoom`);
        this.props.getBBItems();
        // this.props.getMostViewedOnCategoryId(defaultMostViewedCategoryId)
        socket.on('Store Listings Update', () => {
            this.props.getBBItems()
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
            case 'samsungLaptops':
                this.setState({ selectedMostViewedCategoryId: categoryIdGroup.SAMSUNG_LAPTOPS });
                this.props.getMostViewedOnCategoryId(categoryIdGroup.SAMSUNG_LAPTOPS)

                break;
            case 'microsoftSurfaceLaptops':
                this.setState({ selectedMostViewedCategoryId: categoryIdGroup.SURFACE });
                this.props.getMostViewedOnCategoryId(categoryIdGroup.SURFACE)

                break;
            case 'alsoBoughtOnSku':
                return this.props.getAlsoBoughtOnSku();
            default:
                this.setState({ selectedMostViewedCategoryId: '' })
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

export default connect(mapStateToProps, { getBBItems, getMostViewedOnCategoryId, getViewedUltimatelyBoughtOnSku, getAlsoBoughtOnSku })(BB);