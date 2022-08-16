import React from "react";
import { Descriptions, Card, Typography } from "antd";

const { Text } = Typography;

const DescriptionCard = ({ detail }) => {
    return (
        <Card hoverable>
            <Card.Meta
                description={
                    <Descriptions title="Order Info">
                        {
                            Object.entries(detail).map(([key, value]) => {
                                if (value.constructor === Array) {
                                    return value.map((content, index) => (
                                        <Descriptions.Item key={`${content}-${index}`}>
                                            {
                                                Object.entries(content).map(([contentKey, contentValue]) => (
                                                    <Text
                                                        style={{ marginLeft: "8px" }}
                                                        strong={true}
                                                    >
                                                        {contentKey}: {contentValue}
                                                    </Text>
                                                ))
                                            }
                                        </Descriptions.Item>
                                    ))
                                }
                                return (<Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>);
                            })
                        }
                    </Descriptions>
                } />
        </Card>
    )
}

export default DescriptionCard;