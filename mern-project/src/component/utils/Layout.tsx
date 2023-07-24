import React from 'react';
import { Divider, Typography } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";
import { Row, Col } from 'antd';

const { Title } = Typography;
interface IProps {
    title: string,
    subTitle?: string
}
export const ContentHeader: React.FC<IProps> = ({ title, subTitle }: IProps) => {

    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    }
    return (
        <PageHeader
            // className="site-page-header"
            style={{ width: '100%', paddingBlock: 0, paddingInline: 0 }}
            onBack={handleGoBack}
            title={
                <Title level={2} style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{title}</Title>
            }
            subTitle={subTitle}
        />
    );
}

export const SubContentHeader: React.FC<IProps> = ({ title, subTitle }) => {
    return (
        <Divider plain>
            <PageHeader className="site-page-header" title={title} subTitle={subTitle} />
        </Divider>

    );
}

export const ContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Row gutter={[24, 24]} style={{ display: "flex", justifyContent: "center" }}>
            <Col span={18}>
                {children}
            </Col>
        </Row>
    )
}