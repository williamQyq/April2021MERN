import React from 'react';
import { ProCard } from '@ant-design/pro-components';

interface IProps {
    title: string;
    children: React.ReactNode;
}
const MyProCard: React.FC<IProps> = (props) => {
    const { title } = props
    return (
        <ProCard
            title={title}
            bordered
            headerBordered
            collapsible
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