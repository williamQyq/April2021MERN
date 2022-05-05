import { SmileOutlined } from "@ant-design/icons";
import { notification, Typography } from "antd";

const { Text } = Typography;

const openAlertNotification = (type, msg, action) => {
    notification[type]({
        message: <Text style={{ color: "#D8000C" }}>Oops! Error</Text>,
        description: <Text style={{ color: "#D8000C" }}>{msg}</Text>,
        icon: <SmileOutlined style={{ color: '#D8000C' }} />,
        duration: 0,
        style: { background: "#FFD2D2" },
        onClose: () => action.clearErrors()
    })
    // return status ? (
    //     <Alert
    //         message={msg}
    //         type={"warning"}
    //         showIcon
    //         banner
    //         closable
    //         afterClose={() => dispatch(clearErrors())}
    //     />
    // ) : <></>
}

export default openAlertNotification;