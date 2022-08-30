import { Divider, PageHeader } from "antd";
import { useHistory } from "react-router-dom";


export const ContentHeader = ({ title, subTitle = "" }) => {

    const history = useHistory();

    return (
        <Divider plain>
            <PageHeader
                className="site-page-header"
                onBack={() => history.goBack()}
                title={title}
                subTitle={subTitle}
            />
        </Divider>
    );
}

export const SubContentHeader = ({ title, subTitle = "" }) => {
    return (
        <Divider plain>
            <PageHeader className="site-page-header" title={title} subTitle={subTitle} />
        </Divider>

    );
}
