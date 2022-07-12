import { Form, Radio, Switch, Typography } from 'antd';
import OperationNestedTable from 'component/Operation/OperationProductListNestedTable.jsx';
import { EditableCell } from './OperationEditableEle.js';

const { Title } = Typography;

export const title = () => <Title level={4}>All Products</Title>
export const footer = () => 'Here is footer';

export const expandable = {
    expandRowByClick: true,
    expandedRowRender: record => (<OperationNestedTable record={record} />)
};


export const defaultSettings = {
    bordered: true,
    showHeader: true,
    hasData: true,
    scroll: {},
    yScroll: true,
    size: 'default',
    top: 'topRight',
    bottom: 'bottomRight',
    rowKey: "_id",
    tableLayout: "fixed",
    title,
    footer,
    expandable,
    pagination: { position: ['topRight', 'bottomRight'] },
    components: {
        body: {
            cell: EditableCell
        }
    }
}


export const Settings = ({
    handler,
    bordered,
    title,
    showHeader,
    footer,
    rowSelection,
    yScroll,
    xScroll,
    hasData,
    ellipsis,
    size,
    tableLayout,
    top,
    bottom,
}) => {
    return (
        <Form
            layout="inline"
            className="components-table-demo-control-bar"
            style={{ marginBottom: 16 }}
        >
            <Form.Item label="Bordered">
                <Switch checked={bordered} onChange={handler.handleToggle('bordered')} />
            </Form.Item>
            <Form.Item label="Title">
                <Switch checked={!!title} onChange={handler.handleTitleChange} />
            </Form.Item>
            <Form.Item label="Column Header">
                <Switch checked={!!showHeader} onChange={handler.handleHeaderChange} />
            </Form.Item>
            <Form.Item label="Footer">
                <Switch checked={!!footer} onChange={handler.handleFooterChange} />
            </Form.Item>
            {/* <Form.Item label="Expandable">
                <Switch checked={!!state.expandable} onChange={handler.handleExpandChange} />
            </Form.Item> */}
            <Form.Item label="Checkbox">
                <Switch checked={!!rowSelection} onChange={handler.handleRowSelectionChange} />
            </Form.Item>
            <Form.Item label="Fixed Header">
                <Switch checked={!!yScroll} onChange={handler.handleYScrollChange} />
            </Form.Item>
            <Form.Item label="Has Data">
                <Switch checked={!!hasData} onChange={handler.handleDataChange} />
            </Form.Item>
            <Form.Item label="Ellipsis">
                <Switch checked={!!ellipsis} onChange={handler.handleEllipsisChange} />
            </Form.Item>
            <Form.Item label="Size">
                <Radio.Group value={size} onChange={handler.handleSizeChange}>
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
                <Radio.Group value={tableLayout} onChange={handler.handleTableLayoutChange}>
                    <Radio.Button value={undefined}>Unset</Radio.Button>
                    <Radio.Button value="fixed">Fixed</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Pagination Top">
                <Radio.Group
                    value={top}
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
                    value={bottom}
                    onChange={handler.handlePaginationBottomChange}
                >
                    <Radio.Button value="bottomLeft">BottomLeft</Radio.Button>
                    <Radio.Button value="bottomCenter">BottomCenter</Radio.Button>
                    <Radio.Button value="bottomRight">BottomRight</Radio.Button>
                    <Radio.Button value="none">None</Radio.Button>
                </Radio.Group>
            </Form.Item>
        </Form>
    );
}