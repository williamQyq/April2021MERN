import React from 'react';
import 'component/SourceStore/Store.scss';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, } from '@ant-design/icons';
import {
    locateSearchedItem,
    scrollToTableRow,
    defaultTableSettings,
    StoreOperationMenu,
    tableColumns
} from 'component/SourceStore/StoreTableUtilities.js';
import FormTable from 'component/utility/FormTable';
import { defaultSettings } from 'component/Operation/Settings';
// import BackTopHelper from 'component/utility/BackTop';


export default class StoreTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
        };

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
                    tableSettings={{ ...defaultSettings, expandable: null }}
                    columns={columns}
                    data={items}
                />
            </>
        )
    }
}