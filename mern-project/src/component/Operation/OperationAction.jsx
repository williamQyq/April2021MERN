import { Space, Typography, Dropdown, Menu, Button } from "antd";
import { DownOutlined } from '@ant-design/icons';

const { Link, Text } = Typography;

const ActionMenu = ({ actions, record }) => {
    const editable = actions.isEditing(record);

    const saveAction = () => {

    }


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
            <Dropdown trigger={["click"]} overlay={MoreActionMenu}>
                <Link>More <DownOutlined /></Link>
            </Dropdown>
        </Space>
    )
}

/* 
 * @usage: main table and nested child tables action  
 */
const MoreActionMenu = () => {
    const handleDelete = () => {

    }


    return (
        <Menu>
            <Menu.Item key='action1' disabled>Action 1</Menu.Item>
            <Menu.Item key='delete' onClick={() => handleDelete()}>
                <Button type='danger'>Delete</Button>
            </Menu.Item>
        </Menu >
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
