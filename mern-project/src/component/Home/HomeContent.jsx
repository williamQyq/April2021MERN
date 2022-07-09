import { Switch } from 'react-router-dom'
import { Layout } from "antd";
import ProtectedRoutes from 'component/auth/ProtectedRoutes.js';
import openAlertNotification from 'component/utility/errorAlert.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
const { Content } = Layout;

const HomeContent = () => {
    const dispatch = useDispatch();
    const { status, msg } = useSelector((state) => state.error);
    const clearErrors = () => {
        dispatch(clearErrors())
    }
    const clearMessages = () => {
        dispatch(clearMessages())
    }

    useEffect(() => {
        if (status && status !== 200)
            openAlertNotification('error', msg, clearErrors)
        else if (status === 200)
            openAlertNotification('success', msg, clearMessages)

    })

    return (
        < Content className="site-layout-content" >
            <Switch>
                <ProtectedRoutes />
            </Switch>
        </Content >
    )
}

export default HomeContent;