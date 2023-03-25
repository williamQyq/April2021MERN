import { SmileOutlined } from "@ant-design/icons";
import { notification, Typography } from "antd";

const { Text } = Typography;

const openAlertNotification = (type, msg, handleAction, context) => {
    let color, background, msgSubject, durationSec = 0;
    switch (type) {
        case 'success':
            color = "#389e0d";
            background = "#b7eb8f";
            msgSubject = "Affirmative!";
            durationSec = 3;
            break;
        case 'error':
            color = "#D8000C";
            background = "#FFD2D2";
            msgSubject = "Oops! Error!";
            durationSec = 0;
            break;
        default:
            color = "#9254de";
            background = "#efdbff";
            msgSubject = "What's going on?";
            durationSec = 3;
            break;
    }

    notification[type]({
        message: <Text style={{ color }}>{msgSubject}</Text>,
        description:
            <>
                <Text style={{ color }}>{msg}</Text>
                {(
                    context && typeof context === 'string' ? <div>{context}</div>
                        :
                        <div>{JSON.stringify(context, null, 4)}</div>

                )}
            </>,
        icon: <SmileOutlined style={{ color }} />,
        duration: durationSec,
        style: { background },
        onClose: () => handleAction()
    })
}

export default openAlertNotification;