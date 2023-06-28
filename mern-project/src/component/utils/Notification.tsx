import React, { useEffect } from 'react';
import { notification } from "antd";
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux/store/store';
import { useDispatch } from 'react-redux';
import { clearErrors } from '@redux-action/errorActions';

type AlertStatus = "success" | "error" | "warning";
export interface INotificationProps {
    status: AlertStatus;
    msg: string;
    context: React.ReactNode | string | unknown;
    handleAction: () => void;
}

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
