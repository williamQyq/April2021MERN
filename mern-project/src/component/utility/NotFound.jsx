import { Empty, Typography } from "antd";
const { Title } = Typography;

const NotFound = () => {
    return (
        <div style={{"marginTop":"20vh"}}>
        <Empty
            description={
                <>
                    <Title level={3}>The page you visited does not exist!</Title>
                    <Title level={1} >404 Not Found</Title>
                </>
            }
        />
        </div>
    );
}

export default NotFound;