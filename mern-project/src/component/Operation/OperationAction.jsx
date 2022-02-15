import { Space, Typography, Dropdown, Menu } from "antd";
import { DownOutlined } from '@ant-design/icons';

const { Link } = Typography;

const ActionMenu = ({ actions, record }) => {
    const editable = actions.isEditing(record);
    return editable ? (
        <Space size="middle">
            <Link
                onClick={(e) => {
                    e.stopPropagation();
                    actions.save(record.key)
                }}
            >
                Save
            </Link>
            <Link
                onClick={(e) => {
                    e.stopPropagation();
                    actions.cancel();
                }}
            >
                Cancel
            </Link>
        </Space>) : (
        <Space size="middle">
            <Link
                disabled
                onClick={(e) => {
                    e.stopPropagation();
                    actions.publish(record)
                }}
            >Publish</Link>
            <Link
                disabled={actions.editingKey !== ""}
                onClick={(e) => {
                    e.stopPropagation();
                    actions.edit(record)
                }}
            >
                Edit
            </Link>
            <Dropdown overlay={menu}>
                <Link onClick={(e) => { e.stopPropagation(); }}>
                    More <DownOutlined />
                </Link>
            </Dropdown>
        </Space>
    )
}

/* 
 * @usage: main table and nested child tables action  
 */
const menu = (
    <Menu disabled>
        <Menu.Item key='action1'>Action 1</Menu.Item>
        <Menu.Item key='action2'>Action 2</Menu.Item>
    </Menu>
)

export default ActionMenu;
