import { Space, Typography, Dropdown, Menu, Button } from "antd";
import { DownOutlined } from '@ant-design/icons';

const { Link, Text } = Typography;

const ActionMenu = ({ actions, record }) => {
    const editable = actions.isEditing(record);

    return editable ? (
        <OnEditingActionMenu onClick={(e) => { e.stopPropagation() }} actions={actions} record={record} />
    ) : (
        <Space size="middle" onClick={(e) => { e.stopPropagation() }}>
            <Link
                disabled
                onClick={() => { actions.publish(record) }}
            >
                Publish
            </Link>
            <Link
                disabled={actions.editingKey !== ""}
                onClick={() => { actions.edit(record) }}
            >
                Edit
            </Link>
            <Dropdown trigger={["click"]} overlay={DropDownMoreActionMenu}>
                <Link>More <DownOutlined /></Link>
            </Dropdown>
        </Space>
    )
}

/* 
 * @usage: main table and nested child tables action  
 */
const DropDownMoreActionMenu = () => {
    const handleDelete = () => {

    }
    const menuItems = [
        {
            key: 'action1',
            label: (<Button type='default'>Action 1</Button>)
        },
        {
            key: 'delete',
            label: (<Button onclick={() => handleDelete()} type='danger'>Delete</Button>)
        }
    ]

    return (
        <Menu items={menuItems} />
    );
}

const OnEditingActionMenu = ({ actions, record }) => {
    return (
        <Space size="middle" onClick={(e) => { e.stopPropagation() }}>
            <Link onClick={(e) => { actions.save(record.key) }}>Save</Link>
            <Link onClick={(e) => { actions.cancel(); }}>Cancel</Link>
        </Space >
    );
}


export default ActionMenu;
