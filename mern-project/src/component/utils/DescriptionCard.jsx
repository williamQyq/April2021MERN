import React from "react";
import { Descriptions, Card, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

const DescriptionCard = (props) => {
    const [detail, setDetail] = useState(props.detail)
    useEffect(() => {
        setDetail(props.detail)
    }, [props.detail])
    return (
        <Card hoverable>
            <Card.Meta
                description={
                    <Descriptions title="Order Info">
                        {
                            Object.entries(detail).map(([key, value]) => {
                                let jsxKey = `${detail["tracking"]}-${key}`;
                                if (value.constructor === Array) {
                                    return value.map((content, contentIndex) => (
                                        <Descriptions.Item key={`${jsxKey}-${contentIndex}`}>
                                            {
                                                Object.entries(content).map(([contentKey, contentValue], index) => (
                                                    <Text
                                                        key={`${jsxKey}-${contentIndex}-${index}`}
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
                                return (<Descriptions.Item key={jsxKey} label={key}>{value}</Descriptions.Item>);
                            })
                        }
                    </Descriptions>
                } />
        </Card>
    )
}

export default DescriptionCard;