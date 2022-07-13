import React from 'react';
import 'component/SourceStore/Store.scss';
import {
    locateSearchedItem,
    scrollToTableRow,
    defaultTableSettings,
    StoreOperationMenu,
    tableColumns
} from 'component/SourceStore/StoreTableUtilities.js';
import FormTable from 'component/utility/FormTable';
import { connect } from 'react-redux';
import {
    handleOnRetrievedItemsOnlinePrice,
    handleErrorOnRetrievedItemsOnlinePrice
} from 'reducers/actions/itemActions.js';
import { SocketContext, socketType } from 'component/socket/socketContext.js';

// import BackTopHelper from 'component/utility/BackTop';
class StoreTable extends React.Component {
    static contextType = SocketContext
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
        };
        this.socketType = socketType;
    }

    componentDidMount() {
        this.handleScrollPosition(this.props.items, this.props.tableState);
    }

    handleScrollPosition = (items, clickHistory) => {
        if (clickHistory) {
            let itemHistory = locateSearchedItem(items, clickHistory.clickedId)
            this.setState({ searchedRowId: itemHistory._id })
            scrollToTableRow(document, itemHistory.index)
        }
    }
    render() {
        const { items, store, loading } = this.props
        const columns = tableColumns(store)
        return (
            <>
                <StoreOperationMenu store={store} />
                <FormTable
                    loading={loading}
                    tableSettings={{ ...defaultTableSettings, expandable: null }}
                    columns={columns}
                    data={items}
                />
            </>
        )
    }
}
const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, {
    handleOnRetrievedItemsOnlinePrice,
    handleErrorOnRetrievedItemsOnlinePrice
})(StoreTable);