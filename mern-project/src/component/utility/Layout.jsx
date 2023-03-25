import { Divider, Typography } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export const ContentHeader = ({ title = "", subTitle = "" }) => {

    const navigate = useNavigate();

    return (
        <PageHeader
            className="site-page-header"
            onBack={() => navigate(-1)}
            title={
                <Title style={{ margin: 0 }} level={2}>
                    {title}
                </Title>
            }
            subTitle={subTitle}
        />
    );
}

export const SubContentHeader = ({ title, subTitle = "" }) => {
    return (
        <Divider plain>
            <PageHeader className="site-page-header" title={title} subTitle={subTitle} />
        </Divider>

    );
}
