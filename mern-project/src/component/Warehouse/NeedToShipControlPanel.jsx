import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { syncFromNeedToShipGsheet, uploadNeedToShip } from "reducers/actions/inboundActions";
import NeedToShipTable from "./NeedToShipTable";
import { BsUiChecksGrid } from 'react-icons/bs';
import { Collapse, Menu } from 'antd';
import { AreaChartOutlined } from "@ant-design/icons";
import FileUpload from 'component/utility/FileUploader';
const { Panel } = Collapse;

const needToShipMenuItems = [
    {
        key: 'unstantiatedShipment',
        icon: <AreaChartOutlined />,
        label: 'Confirm Shipment'
    },
    {
        key: 'uploadNeedToShip',
        icon: <AreaChartOutlined />,
        label: 'Upload Need To Ship'
    },
    {
        disabled: true,
        key: 'loadFromGsheet',
        icon: <AreaChartOutlined />,
        label: 'Load From Gsheet'
    }
]

const NeedToShipControlPanel = ({ shipmentInfo }) => {
    const shipmentCount = useMemo(() => shipmentInfo, [shipmentInfo]);
    const dispatch = useDispatch();

    const [menuKey, setMenuKey] = useState("unstantiatedShipment")

    const handleClick = (key) => {
        switch (key) {
            case "uploadNeedToShip":
                break;
            case "loadFromGsheet":
                dispatch(syncFromNeedToShipGsheet());
                break;
            default:
                console.warn(`clicked key not found `, key);
                return;
        }
    }

    const handleContentSwitch = (key) => {
        switch (key) {
            case 'unstantiatedShipment':
                return <NeedToShipTable shipmentInfo={shipmentCount} />
            case 'uploadNeedToShip':
                return <FileUpload customizedUpload={uploadNeedToShip} />
            case 'loadFromGsheet':
                break;
            default:
                return <NeedToShipTable />
        }
    }
    return (
        <Collapse accordion ghost collapsible='header'>
            <Panel
                header={
                    <BsUiChecksGrid style={{ fontSize: "200%" }} />
                }
                key="1"
            >
                <Menu
                    onClick={(e) => {
                        handleClick(e.key);
                        setMenuKey(e.key);
                    }}
                    selectedKeys={[menuKey]}
                    mode="horizontal"
                    items={needToShipMenuItems}
                />
                {
                    handleContentSwitch(menuKey)
                }
            </Panel>
        </Collapse >

    )
}

export default NeedToShipControlPanel;