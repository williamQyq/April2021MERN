import React from 'react';
import 'component/SourceStore/Store.scss';
import FormTable from 'component/utility/FormTable';
import { SocketContext, socketType } from 'component/socket/socketContext.js';
import { connect } from 'react-redux';
import {
    handleOnRetrievedItemsOnlinePrice,
    handleErrorOnRetrievedItemsOnlinePrice
} from 'reducers/actions/itemActions.js';
import {
    defaultTableSettings,
    StoreOperationMenu,
    tableColumns
} from 'component/SourceStore/StoreTableUtilities.js';
import { ContentHeader } from 'component/utility/Layout';

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
    }

    render() {
        const { items, storeName, loading, tableState } = this.props
        const columns = tableColumns(storeName)
        return (
            <>
                <ContentHeader title={storeName} />
                <StoreOperationMenu store={storeName} />
                <FormTable
                    loading={loading}
                    tableSettings={{ ...defaultTableSettings, expandable: null, tableState: tableState }}
                    columns={columns}
                    data={items}
                />
            </>
        )
    }
}
const mapStateToProps = (state) => ({
    tableState: state.item.tableState,

})

export default connect(mapStateToProps, {
    handleOnRetrievedItemsOnlinePrice,
    handleErrorOnRetrievedItemsOnlinePrice
})(StoreTable);