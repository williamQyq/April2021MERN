import React from 'react';
import { ConnectedProps, connect } from 'react-redux';
import { Table, Input, Button, Space } from 'antd';
import type { InputRef } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { saveUserTableSettings } from '@redux-action/deal.action';
import '@src/assets/FormTable.scss';
import { normalizeStringValue } from './helper';

import type { ColumnType, TableProps } from 'antd/es/table';
import { ExpandableConfig, FilterConfirmProps } from 'antd/es/table/interface';

interface IProps extends TableProps<any>, PropsFromRedux {
    tableUserSettings?: Partial<TableProps<any>>;
    handleRowClick?: (record: Record<string, string>) => void;
}
interface TableUserSettingsType extends Record<string, string> {
    searchText: string;
    searchedRowId: string;
    searchedColumn: string;
}
interface IState extends TableUserSettingsType { };

export type ColumnTypeWithSearchable<T> = ColumnType<T> & {
    dataIndex: string;
    searchable?: boolean;
    editable?: boolean;
}
// interface TableDataType extends Readonly<Record<string, string>> {
//     _id: string;
// }
class FormTable extends React.Component<IProps, IState> {
    searchInput: React.RefObject<InputRef>;
    constructor(props: IProps) {
        super(props);

        this.state = {
            searchText: '',
            searchedRowId: '',
            searchedColumn: '',
        };
        this.searchInput = React.createRef<InputRef>();
    }

    componentDidMount() {
        const data = this.props.dataSource as { _id: string; }[];
        if (data)
            this.handleScrollPosition(data, { ...this.state });  //scroll to clicked row
    }

    componentDidUpdate<T = Record<string, string>>(_prevProps: Readonly<IProps>, prevState: Readonly<IState>) {

        if (this.state.searchText !== prevState.searchText) {
            this.props.saveUserTableSettings({
                ...this.state
            })
        }
    }

    /**
     * @description preserve the table user settings
     * @status not completed
     * @param tableUserSettings 
     */
    setTableUserSettings = (tableUserSettings: TableUserSettingsType) => {
        const { searchText, searchedRowId, searchedColumn } = tableUserSettings;
        if (searchText !== "") {
            this.setState({ searchText, searchedRowId, searchedColumn })
        }
    }

    addSearchPropsToColumns = <T extends Record<string, string | number | undefined>>(
        columns: ColumnTypeWithSearchable<T>[],
        getColumnSearchProps: (dataIndex: string) => any
    ) => {
        return columns.map((col) => {
            if (col.searchable) {
                return {
                    ...col,
                    ...getColumnSearchProps(col.dataIndex)
                }
            }

            return {
                ...col,
            }
        })
    }

    handleScrollPosition = <T extends { _id: string }>(
        items: T[],
        tableUserSettings: TableUserSettingsType
    ) => {
        if (tableUserSettings.searchedRowId !== "") {
            let clickedItem = this.locateSearchedItem(items, tableUserSettings.searchedRowId);
            this.setState({ searchedRowId: clickedItem._id });
            this.scrollToTableRow(document, clickedItem.index);
        }
    }

    locateSearchedItem = <T extends { _id: string }>(items: T[], searchedRowId: string) => {
        const searchedItem = items.find(row => row._id === searchedRowId);
        const index = items.findIndex(row => row._id === searchedRowId);
        let searchItem = {
            index: index ? index : 0,
            _id: searchedItem ? searchedItem._id : ""
        }

        return searchItem;  //return default first index item.
    }

    scrollToTableRow = (document: Document, rowIndex: number) => {
        const tableRowHight = 75.31;
        let v = document.getElementsByClassName("ant-layout-content site-layout-content")[0];
        v.scrollTop = tableRowHight * (rowIndex - 0);
    }

    handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: string
    ) => {
        confirm();
        let trimSearchText = normalizeStringValue(selectedKeys[0]);
        this.setState({
            searchText: trimSearchText,
            searchedColumn: dataIndex,
        });
    };

    handleReset = (clearFilters: (() => void) | undefined) => {
        if (clearFilters)
            clearFilters();
        this.setState({ searchText: '' });
    };


    getColumnSearchProps = <T extends Record<string, string>>(dataIndex: string): ColumnType<T> => {
        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={this.searchInput}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [''])}
                        onPressEnter={() => this.handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => this.handleSearch(selectedKeys as string[], confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >Search</Button>
                        <Button
                            size="small"
                            style={{ width: 90 }}
                            onClick={() => this.handleReset(clearFilters)}
                        >Reset</Button>
                        {/* <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({ closeDropdown: false });
                                this.setState({
                                    searchText: selectedKeys[0],
                                    searchedColumn: dataIndex,
                                });
                            }}
                        >
                            Filter
                        </Button> */}
                    </Space>
                </div>
            ),
            filteredValue: this.state.searchedColumn === dataIndex ? [this.state.searchText] : [],
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => {
                if (value === undefined) return false;  //if empty searchText, filter no data
                let isValueIncluded = record[dataIndex] ? (
                    record[dataIndex].toString().toLowerCase().includes(value.toString().toLowerCase())
                ) : (
                    false
                );
                return isValueIncluded
            },
            onFilterDropdownOpenChange: visible => {
                if (visible) {
                    setTimeout(() => this.searchInput.current?.select(), 100);
                }
            },
            render: (text, record) => (
                this.state.searchedColumn === dataIndex ? (
                    <a target="_blank" rel="noopener noreferrer" href={record.link}>
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#c7edcc', padding: 0 }}
                            searchWords={[this.state.searchText]}
                            autoEscape
                            textToHighlight={text ? text.toString() : ''}
                        />
                    </a>
                ) : (
                    this.state.searchedRowId === record._id ?
                        <a target="_blank" rel="noopener noreferrer" href={record.link}>
                            <Highlighter
                                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                                searchWords={[text]}
                                autoEscape
                                textToHighlight={text ? text.toString() : ''}
                            />
                        </a>
                        :
                        <a target="_blank" rel="noopener noreferrer" href={record.link}>{text}</a>
                ))
        };
    }

    render() {
        const {
            dataSource,
            loading,
            handleRowClick,
            tableUserSettings } = this.props;
        const columns = this.props.columns as ColumnTypeWithSearchable<Record<string, string | number | undefined>>[];
        const searchPropsColumns = this.addSearchPropsToColumns(columns, this.getColumnSearchProps);

        return (
            <Table
                dataSource={dataSource}
                loading={loading}
                showSorterTooltip
                // pagination={pagination}
                // expandable={expandable as ExpandableConfig<object> | undefined}
                columns={searchPropsColumns}
                onRow={handleRowClick ? (record) => ({
                    onClick: () => handleRowClick(record as Record<string, string>)
                }) : undefined}
                {...tableUserSettings}
            />
        )
    }
}
const connector = connect(null, { saveUserTableSettings });
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(FormTable);