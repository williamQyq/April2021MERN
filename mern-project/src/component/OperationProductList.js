import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import { Table, Switch, Radio, Form } from 'antd';
import OperationNestedTable from 'component/OperationProductListNestedTable';
import { EditableCell, mergedColumns } from 'component/OperationEditableEle';
import { getProductPricing } from 'reducers/actions/amazonActions';


const data = [];
for (let i = 1; i < 2; i++) {
    data.push({
        key: i,
        upc: 1921681010,
        name: `HP DELL ASUS...`,
        wmsQuantity: `${i}`,
        unitCost: `${i * 100}`,
        settleRateUniv: 0.15
    });
}

const expandable = {
    expandRowByClick: true,
    expandedRowRender: record => <OperationNestedTable />
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
            loading: false,
            pagination,
            size: 'default',
            expandable,
            title: undefined,
            showHeader,
            footer,
            rowSelection: {},
            scroll: undefined,
            hasData: true,
            tableLayout: undefined,
            top: 'none',
            bottom: 'bottomRight',
            editingKey: '',
            data: data,
        };
    }

    formRef = React.createRef();

    componentDidMount() {
        const asins = [
            'B09JBFJN9M',
            'B09JBFF4Q6',
            'B09JBDTRS1'
        ];
        this.props.getProductPricing(asins)
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

    render() {
        const { xScroll, yScroll, ...state } = this.state;
        const editableAction = {
            isEditing: this.isEditing,
            edit: this.edit,
            cancel: this.cancel,
            save: this.save,
            editingKey: this.state.editingKey
        }
        const columns = mergedColumns(editableAction)

        const scroll = {};
        if (yScroll) {
            scroll.y = 240;
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
                        <Switch checked={state.bordered} onChange={this.handleToggle('bordered')} />
                    </Form.Item>
                    <Form.Item label="loading">
                        <Switch checked={state.loading} onChange={this.handleToggle('loading')} />
                    </Form.Item>
                    <Form.Item label="Title">
                        <Switch checked={!!state.title} onChange={this.handleTitleChange} />
                    </Form.Item>
                    <Form.Item label="Column Header">
                        <Switch checked={!!state.showHeader} onChange={this.handleHeaderChange} />
                    </Form.Item>
                    <Form.Item label="Footer">
                        <Switch checked={!!state.footer} onChange={this.handleFooterChange} />
                    </Form.Item>
                    <Form.Item label="Expandable">
                        <Switch checked={!!state.expandable} onChange={this.handleExpandChange} />
                    </Form.Item>
                    <Form.Item label="Checkbox">
                        <Switch checked={!!state.rowSelection} onChange={this.handleRowSelectionChange} />
                    </Form.Item>
                    <Form.Item label="Fixed Header">
                        <Switch checked={!!yScroll} onChange={this.handleYScrollChange} />
                    </Form.Item>
                    <Form.Item label="Has Data">
                        <Switch checked={!!state.hasData} onChange={this.handleDataChange} />
                    </Form.Item>
                    <Form.Item label="Ellipsis">
                        <Switch checked={!!state.ellipsis} onChange={this.handleEllipsisChange} />
                    </Form.Item>
                    <Form.Item label="Size">
                        <Radio.Group value={state.size} onChange={this.handleSizeChange}>
                            <Radio.Button value="default">Default</Radio.Button>
                            <Radio.Button value="middle">Middle</Radio.Button>
                            <Radio.Button value="small">Small</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Table Scroll">
                        <Radio.Group value={xScroll} onChange={this.handleXScrollChange}>
                            <Radio.Button value={undefined}>Unset</Radio.Button>
                            <Radio.Button value="scroll">Scroll</Radio.Button>
                            <Radio.Button value="fixed">Fixed Columns</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Table Layout">
                        <Radio.Group value={state.tableLayout} onChange={this.handleTableLayoutChange}>
                            <Radio.Button value={undefined}>Unset</Radio.Button>
                            <Radio.Button value="fixed">Fixed</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Pagination Top">
                        <Radio.Group
                            value={this.state.top}
                            onChange={e => {
                                this.setState({ top: e.target.value });
                            }}
                        >
                            <Radio.Button value="topLeft">TopLeft</Radio.Button>
                            <Radio.Button value="topCenter">TopCenter</Radio.Button>
                            <Radio.Button value="topRight">TopRight</Radio.Button>
                            <Radio.Button value="none">None</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Pagination Bottom">
                        <Radio.Group
                            value={this.state.bottom}
                            onChange={e => {
                                this.setState({ bottom: e.target.value });
                            }}
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
                        components={{
                            body: {
                                cell: EditableCell,
                            }
                        }}
                        pagination={{ position: [this.state.top, this.state.bottom] }}
                        columns={columns}
                        dataSource={state.hasData ? this.state.data : null}
                        scroll={scroll}
                    />
                </Form>
            </>
        );
    }
}

OperationProductList.prototypes = {
    getUpcAsinMapping: PropTypes.func.isRequired,
    getProductPricing: PropTypes.func.isRequired,
    amazon: PropTypes.array.isRequired,

}
const mapStateToProps = (state) => ({
    amazon: state.amazon.res
})

export default connect(mapStateToProps, { getProductPricing })(OperationProductList);