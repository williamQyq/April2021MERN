import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import { Table, Switch, Radio, Form } from 'antd';
import OperationNestedTable from 'component/OperationProductListNestedTable.js';
import { EditableCell, mergedColumns } from 'component/utility/OperationEditableEle.js';
import { getProductPricing } from 'reducers/actions/amazonActions.js';

const expandable = {
    expandRowByClick: true,
    expandedRowRender: record => <OperationNestedTable record={record} />
};
const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';
const pagination = { position: 'bottom' };

class OperationProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bordered: false,
            pagination,
            size: 'default',
            expandable,
            title: undefined,
            showHeader,
            footer,
            rowSelection: {},
            scroll: undefined,
            hasData: true,
            data: undefined,
            tableLayout: undefined,
            top: 'none',
            bottom: 'bottomRight',
            editingKey: '',
        };
    }

    formRef = React.createRef();

    componentDidMount() {
        const { sellingPartner } = this.props

        this.props.getProductPricing()
        this.setTableData(sellingPartner);

    }

    setTableData = (sp) => {
        const data = sp.map(record => {
            record.key = record._id
            return record;
        })
        this.setState({ data })
    }

    isEditing = (record) => record.key === this.state.editingKey

    edit = (record) => {
        this.formRef.current.setFieldsValue({
            ...record
        })
        this.setState({
            editingKey: record.key
        })

    }
    cancel = () => {
        this.setState({
            editingKey: ""
        })
    }

    save = async (key) => {
        try {
            const row = await this.formRef.current.validateFields();
            const newData = [...this.state.data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                this.setState({ data: newData });
                this.setState({ editingKey: "" });
            } else {
                newData.push(row);
                this.setState({ newData });
                this.setState({ editingKey: "" });
            }
        } catch (err) {
            console.log("Validate Failed:", err);
        }
    }

    publish = (record) => {
        //publish record to amazon seller central...

    }

    handleToggle = prop => enable => {
        this.setState({ [prop]: enable });
    };

    handleSizeChange = e => {
        this.setState({ size: e.target.value });
    };

    handleTableLayoutChange = e => {
        this.setState({ tableLayout: e.target.value });
    };

    handleExpandChange = enable => {
        this.setState({ expandable: enable ? expandable : undefined });
    };

    handleEllipsisChange = enable => {
        this.setState({ ellipsis: enable });
    };

    handleTitleChange = enable => {
        this.setState({ title: enable ? title : undefined });
    };

    handleHeaderChange = enable => {
        this.setState({ showHeader: enable ? showHeader : false });
    };

    handleFooterChange = enable => {
        this.setState({ footer: enable ? footer : undefined });
    };

    handleRowSelectionChange = enable => {
        this.setState({ rowSelection: enable ? {} : undefined });
    };

    handleYScrollChange = enable => {
        this.setState({ yScroll: enable });
    };

    handleXScrollChange = e => {
        this.setState({ xScroll: e.target.value });
    };

    handleDataChange = hasData => {
        this.setState({ hasData });
    };
    handlePaginationTopChange = e => {
        this.setState({ top: e.target.value })
    }
    handlePaginationBottomChange = e => {
        this.setState({ bottom: e.target.value })
    }

    render() {
        const { xScroll, yScroll, ...state } = this.state;
        const { loading } = this.props;
        const editableAction = {
            isEditing: this.isEditing,
            edit: this.edit,
            cancel: this.cancel,
            save: this.save,
            publish: this.publish,
            editingKey: this.state.editingKey
        }
        const handler = {
            handleToggle: this.handleToggle,
            handleSizeChange: this.handleSizeChange,
            handleTableLayoutChange: this.handleTableLayoutChange,
            handleExpandChange: this.handleExpandChange,
            handleEllipsisChange: this.handleEllipsisChange,
            handleTitleChange: this.handleTitleChange,
            handleHeaderChange: this.handleHeaderChange,
            handleFooterChange: this.handleFooterChange,
            handleRowSelectionChange: this.handleRowSelectionChange,
            handleYScrollChange: this.handleYScrollChange,
            handleXScrollChange: this.handleXScrollChange,
            handleDataChange: this.handleDataChange,
            handlePaginationTopChange: this.handlePaginationTopChange,
            handlePaginationBottomChange: this.handlePaginationBottomChange
        }

        const columns = mergedColumns(editableAction)

        const scroll = {};
        if (yScroll) {
            scroll.y = "calc(100vh - 335px)";
        }
        if (xScroll) {
            scroll.x = '100vw';
        }

        return (
            <>
                <Form
                    layout="inline"
                    className="components-table-demo-control-bar"
                    style={{ marginBottom: 16 }}
                >
                    <Form.Item label="Bordered">
                        <Switch checked={state.bordered} onChange={handler.handleToggle('bordered')} />
                    </Form.Item>
                    <Form.Item label="Title">
                        <Switch checked={!!state.title} onChange={handler.handleTitleChange} />
                    </Form.Item>
                    <Form.Item label="Column Header">
                        <Switch checked={!!state.showHeader} onChange={handler.handleHeaderChange} />
                    </Form.Item>
                    <Form.Item label="Footer">
                        <Switch checked={!!state.footer} onChange={handler.handleFooterChange} />
                    </Form.Item>
                    <Form.Item label="Expandable">
                        <Switch checked={!!state.expandable} onChange={handler.handleExpandChange} />
                    </Form.Item>
                    <Form.Item label="Checkbox">
                        <Switch checked={!!state.rowSelection} onChange={handler.handleRowSelectionChange} />
                    </Form.Item>
                    <Form.Item label="Fixed Header">
                        <Switch checked={!!yScroll} onChange={handler.handleYScrollChange} />
                    </Form.Item>
                    <Form.Item label="Has Data">
                        <Switch checked={!!state.hasData} onChange={handler.handleDataChange} />
                    </Form.Item>
                    <Form.Item label="Ellipsis">
                        <Switch checked={!!state.ellipsis} onChange={handler.handleEllipsisChange} />
                    </Form.Item>
                    <Form.Item label="Size">
                        <Radio.Group value={state.size} onChange={handler.handleSizeChange}>
                            <Radio.Button value="default">Default</Radio.Button>
                            <Radio.Button value="middle">Middle</Radio.Button>
                            <Radio.Button value="small">Small</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Table Scroll">
                        <Radio.Group value={xScroll} onChange={handler.handleXScrollChange}>
                            <Radio.Button value={undefined}>Unset</Radio.Button>
                            <Radio.Button value="scroll">Scroll</Radio.Button>
                            <Radio.Button value="fixed">Fixed Columns</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Table Layout">
                        <Radio.Group value={state.tableLayout} onChange={handler.handleTableLayoutChange}>
                            <Radio.Button value={undefined}>Unset</Radio.Button>
                            <Radio.Button value="fixed">Fixed</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Pagination Top">
                        <Radio.Group
                            value={state.top}
                            onChange={handler.handlePaginationTopChange}
                        >
                            <Radio.Button value="topLeft">TopLeft</Radio.Button>
                            <Radio.Button value="topCenter">TopCenter</Radio.Button>
                            <Radio.Button value="topRight">TopRight</Radio.Button>
                            <Radio.Button value="none">None</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Pagination Bottom">
                        <Radio.Group
                            value={state.bottom}
                            onChange={handler.handlePaginationBottomChange}
                        >
                            <Radio.Button value="bottomLeft">BottomLeft</Radio.Button>
                            <Radio.Button value="bottomCenter">BottomCenter</Radio.Button>
                            <Radio.Button value="bottomRight">BottomRight</Radio.Button>
                            <Radio.Button value="none">None</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
                <Form ref={this.formRef} component={false}>
                    <Table
                        {...this.state}
                        loading={loading}
                        components={{
                            body: {
                                cell: EditableCell,
                            }
                        }}
                        pagination={{ position: [this.state.top, this.state.bottom] }}
                        columns={columns}
                        dataSource={state.hasData ? state.data : null}
                        scroll={scroll}
                    />
                </Form>
            </>
        );
    }
}

OperationProductList.prototypes = {
    getProductPricing: PropTypes.func.isRequired,
    sellingPartner: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,

}
const mapStateToProps = (state) => ({
    sellingPartner: state.amazon.sellingPartner,
    loading: state.amazon.loading
})

export default connect(mapStateToProps, { getProductPricing })(OperationProductList);