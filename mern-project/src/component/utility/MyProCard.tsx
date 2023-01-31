import React from 'react';
import { ProCard } from '@ant-design/pro-components';

interface IProps {
    title: string;
    extra?: React.ReactNode;
    collapsible?: boolean;
    children: React.ReactNode;
}
const MyProCard: React.FC<IProps> = (props) => {
    const { title, extra, collapsible } = props
    return (
        <ProCard
            title={title}
            extra={extra}
            bordered
            headerBordered
            collapsible={collapsible !== undefined ? collapsible : true}
            style={{
                marginBlockEnd: 16,
                minWidth: 800,
                maxWidth: '100%',
            }}
        >
            {props.children}
        </ProCard>
    );
}
export default MyProCard