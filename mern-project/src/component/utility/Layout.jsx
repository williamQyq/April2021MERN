import { Typography, Row, Col, PageHeader } from "antd";
import { useHistory } from "react-router-dom";

const { Text, Title } = Typography;

export const ContentHeader = ({ title }) => {

    const history = useHistory();

    return (
        <PageHeader
            className="site-page-header"
            onBack={() => history.goBack()}
            title={title}
            subTitle=""
        />
        // <Title level={4}>{title}</Title>
    );
}

export const SubContentHeader = ({ title }) => {
    return (
        <PageHeader
            className="site-page-header"
            title={title}
            // subTitle=""
        />
       
    );
}
