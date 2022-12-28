import React from "react";
import 'styles/Configuration.scss';
import { Divider, Steps, Typography } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;

const steps = [
    {
        key: 'Product Info Entry',
        title: 'Product Info Entry',
        content: 'first'
    },
    {
        key: 'Product Info Entry',
        title: 'Receive Price Entry',
        content: 'second'
    },
    {
        key: 'Product Info Entry',
        title: 'Product Spec Entry',
        content: 'third'
    },
    {
        key: 'Product Info Entry',
        title: 'step 4',
        content: 'fourth'
    }
]


class Configuration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        }
    }

    onChange = current => {
        console.log('onChange:', current);
        this.setState({ current });
    };

    next = () => {
        let current = this.state.current;
        this.setState({ current: current + 1 })
    }
    prev = () => {
        let current = this.state.current
        this.setState({ current: current - 1 })
    }
    getStatusIcon = (status) => {
        switch (status) {
            case "finish":
                return <CheckCircleOutlined />
            case "process":
                return <LoadingOutlined />
            case "wait":
                return <QuestionCircleOutlined />
            default:
                return;
        }
    }
    getStatus = (key) => {
        switch (key) {
            case "Product Info Entry":
                return "finish";
            case "Receive Price Entry":
                return "process"
            case "Product Spec Entry":
                return "wait"
            default:
                return "error";
        }
    }
    render() {
        const { current } = this.state;
        return (
            <>
                <Title level={4}>Data Entry Procedure</Title>
                <Divider />
                <Steps
                    type="navigation"
                    current={current}
                    onChange={this.onChange}
                    className="site-navigation-steps"
                    items={steps}
                />
                {/* {
                        steps.map(step => {
                            let status = this.getStatus(step.title);
                            return <Step {...step} status={status} icon={this.getStatusIcon(status)} />
                        })
                    }
                </Steps> */}
                <div className="steps-content">{steps[current].content}</div>
            </>
        )
    }
}

export default Configuration