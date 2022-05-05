import { Switch } from 'react-router-dom'
import { Layout } from "antd";
import ProtectedRoutes from 'component/auth/ProtectedRoutes.js';
import openAlertNotification from 'component/utility/errorAlert.js';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { clearErrors } from 'reducers/actions/errorActions';
const { Content } = Layout;

const HomeContent = () => {
    const dispatch = useDispatch();
    const { status, msg } = useSelector((state) => state.error);
    const action = {
        clearErrors: () => {
            dispatch(clearErrors())
        }
    }

    useEffect(() => {
        if (status)
            openAlertNotification('error', msg, action)
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