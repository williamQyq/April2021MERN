import { Loading3QuartersOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';


const antIcon = (
    <Loading3QuartersOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
);

const LoadingPage = () => {

    return (
        <Spin indicator={antIcon} />
    );
}

export default LoadingPage;