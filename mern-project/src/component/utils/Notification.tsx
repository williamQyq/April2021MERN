import React, { useEffect } from 'react';
import { SmileOutlined } from "@ant-design/icons";
import { notification, Button, Space, Typography } from "antd";
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux/store/store';
import { useDispatch } from 'react-redux';
import { loadUser } from '@redux-action/authActions';
import { clearMessages } from '@redux-action/messageActions';
import { clearErrors } from '@redux-action/errorActions';
import { AUTH_ERROR } from '@redux-action/types';

type AlertStatus = "success" | "error" | "warning";
export interface INotificationProps {
    status: AlertStatus;
    msg: string;
    context: React.ReactNode | string | unknown;
    handleAction: () => void;
}

// const openAlertNotification = ({ status, msg, handleAction, context }: INotificationProps) => {

//     let color, background, subject, durationSec = 0;
//     switch (status) {
//         case 'success':
//             color = "#389e0d";
//             background = "#b7eb8f";
//             subject = "Affirmative!";
//             durationSec = 3;
//             break;
//         case 'error':
//             color = "#D8000C";
//             background = "#FFD2D2";
//             subject = "Oops! Error!";
//             durationSec = 0;
//             break;
//         default:
//             color = "#9254de";
//             background = "#efdbff";
//             subject = "What's going on?";
//             durationSec = 3;
//             break;
//     }

//     notification.open({
//         message: <Typography.Text strong underline>{subject}</Typography.Text>,
//         description: <>
//             <Typography.Text style={{ color }}>{msg}</Typography.Text>
//             {
//                 context && typeof context === "string" ? <div>{context}</div> :
//                     <div>{JSON.stringify(context, null, 4)}</div>
//             }
//         </>,
//         icon: <SmileOutlined style={{ color }} />,
//         duration: durationSec,
//         style: { background },
//         onClose: () => handleAction()
//     });
// }

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const Notification: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();

    const error = useSelector((state: RootState) => state.error)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        let type: NotificationType;
        let duration: number = 4.5;

        if (error.status) {
            switch (error.status) {
                case 200:
                    type = "success";
                    break;
                case 202:
                    type = "info";
                    break;
                case 401:
                case 400:
                    type = "error";
                    duration = 0;
                    break;
                default:
                    type = "warning";
                    break;
            }

            const openNotificationWithIcon = (type: NotificationType) => {
                api[type]({
                    duration,
                    message: error.id ? error.id : 'Notification',
                    description: error.msg,
                    onClose: () => handleNotificationClose()
                });
            };

            openNotificationWithIcon(type);

        }
        return () => {

        }
    }, [error]);

    const handleNotificationClose = () => {
        // dispatch(clearMessages());
        dispatch(clearErrors());
    }

    return (
        <>
            {contextHolder}
        </>
    );
};
