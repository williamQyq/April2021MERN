import { Descriptions, Card } from "antd";
import React from "react";

const DescriptionCard = ({ detail }) => {
    return (
        <Card hoverable>
            <Card.Meta
                description={
                    <Descriptions title="Order Info">
                        {
                            Object.entries(detail).map(([key, value]) => (
                                <Descriptions.Item key={key} label={key}>{JSON.stringify(value)}</Descriptions.Item>
                            ))
                        }
                    </Descriptions>
                } />
        </Card>
    )
}

export default DescriptionCard;