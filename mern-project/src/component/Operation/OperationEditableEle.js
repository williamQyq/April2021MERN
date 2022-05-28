import { InputNumber, Input, Form, Space, Typography, Badge, Dropdown, Menu } from "antd";
import { mainColumnGroup, nestedColumnGroup } from "component/Operation/columns";
/*
 *  @usage: Nested child table elements
 */
export const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber min={0} /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                    style={{"marginBottom":0}}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

/*  
 * @usage: Main Table
 * @desc: Columns of parent table
 */
const mergedColumns = (columns, actions) => {

    return columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.inputType ? col.inputType : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: actions.isEditing(record),
            }),

        }
    });

}

export const mainColumns = (actions) => {
    const columnGroup = mainColumnGroup(actions);
    return mergedColumns(columnGroup, actions);
}
export const nestedColumns = (actions) => {
    const columnGroup = nestedColumnGroup(actions);
    return mergedColumns(columnGroup, actions)
}