import React from 'react';
import { SmileOutlined } from "@ant-design/icons";
import { notification, Typography } from "antd";

import type { NotificationPlacement } from "antd/es/notification/interface";

type AlertStatus = "success" | "error" | "warning";
export interface INotificationProps {
    status: AlertStatus;
    msg: string;
    context: React.ReactNode | string | unknown;
    handleAction: () => void;
}

const openAlertNotification = ({ status, msg, handleAction, context }: INotificationProps) => {

    let color, background, subject, durationSec = 0;
    switch (status) {
        case 'success':
            color = "#389e0d";
            background = "#b7eb8f";
            subject = "Affirmative!";
            durationSec = 3;
            break;
        case 'error':
            color = "#D8000C";
            background = "#FFD2D2";
            subject = "Oops! Error!";
            durationSec = 0;
            break;
        default:
            color = "#9254de";
            background = "#efdbff";
            subject = "What's going on?";
            durationSec = 3;
            break;
    }

    notification.open({
        message: <Typography.Text strong underline>{subject}</Typography.Text>,
        description: <>
            <Typography.Text style={{ color }}>{msg}</Typography.Text>
            {
                context && typeof context === "string" ? <div>{context}</div> :
                    <div>{JSON.stringify(context, null, 4)}</div>
            }
        </>,
        icon: <SmileOutlined style={{ color }} />,
        duration: durationSec,
        style: { background },
        onClose: () => handleAction()
    });
}

export default openAlertNotification;