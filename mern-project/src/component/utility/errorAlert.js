import { SmileOutlined } from "@ant-design/icons";
import { notification, Typography } from "antd";

const { Text } = Typography;

const openAlertNotification = (type, msg, action) => {
    let color, background, msgSubject, durationSec = 0;
    switch (type) {
        case 'success':
            color = "#7cb305";
            background = "#f4ffb8";
            msgSubject = "Affirmative!";
            durationSec = 3;
            break;
        case 'error':
            color = "#D8000C";
            background = "#FFD2D2";
            msgSubject = "Oops! Error!";
            break;
        default:
            color = "#b37feb";
            background = "#f9f0ff";
            msgSubject = "What's going on?";
            break;
    }


    notification[type]({
        message: <Text style={{ color }}>{msgSubject}</Text>,
        description: <Text style={{ color }}>{msg}</Text>,
        icon: <SmileOutlined style={{ color }} />,
        duration: durationSec,
        style: { background },
        onClose: () => action()
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