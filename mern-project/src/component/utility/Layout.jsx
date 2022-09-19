import { Divider, PageHeader, Typography } from "antd";
import { useHistory } from "react-router-dom";

const { Title } = Typography;

export const ContentHeader = ({ title, subTitle = "" }) => {

    const history = useHistory();

    return (
        <PageHeader
            className="site-page-header"
            onBack={() => history.goBack()}
            title={
                <Title
                    style={{ margin: 0 }}
                    level={2}
                >
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
