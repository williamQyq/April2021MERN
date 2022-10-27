import React, { useEffect, useState } from 'react';
import 'styles/ProcessStreamStartUp.scss';
import { ContentHeader } from 'component/utility/Layout';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { SiAmazonaws } from 'react-icons/si';
import { ImSmile } from 'react-icons/im';
import { StepStatus } from 'types';
import ProductSpecInput from './Workflow/ProductSpecInput';
import Finish from './Workflow/Finish';
import AsinMappingInput from './Workflow/AsinMappingInput';
import { Typography, Row, Col, Button, message, Steps } from 'antd';


const { Text, Title } = Typography;
const { Step } = Steps;

const ProcessStreamStartUp: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    //Set current Step status: error, process finish,wait
    const getStatus = (index: number): StepStatus => {
        let status = StepStatus.error;
        if (index < currentStep) {
            status = StepStatus.finish;
        } else if (index === currentStep) {
            status = StepStatus.process;
        } else if (index > currentStep) {
            status = StepStatus.wait;
        }

        return status;
    }
    const next = () => {
        if (currentStep + 1 < steps.length)
            setCurrentStep(currentStep + 1);
    }
    const prev = () => {
        if (currentStep - 1 >= 0)
            setCurrentStep(currentStep - 1);
    }

    const steps = [
        {
            key: "product-specification",
            title: 'Specification',
            description: "CPU, RAM, GPU, Screen...",
            icon: <MdOutlineTipsAndUpdates />,
            content: <ProductSpecInput />
        },
        {
            key: "asin-mapping",
            title: "SKU",
            description: "Generate SKU for AWS Selling Partner",
            icon: <SiAmazonaws />,
            content: <AsinMappingInput />
        },
        {
            key: "Done",
            title: "All Set",
            icon: <ImSmile />,
            content: <Finish />
        }
    ]

    return (
        <>
            <ContentHeader title="Init New Product" />
            <Row gutter={[8, 16]}>
                <Col span={20}>
                    <div className='steps-content'>
                        <Row justify='center'>
                            <Col span={8} offset={8}>
                                <Title className="steps-title" level={3}> {steps[currentStep].title} </Title>
                            </Col>
                            <Col span={4} offset={4}>
                                <div className='steps-actions'>
                                    {currentStep < steps.length - 1 && (
                                        <Button type="primary" onClick={() => next()}>
                                            Next
                                        </Button>
                                    )}
                                    {currentStep === steps.length - 1 && (
                                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                            Done
                                        </Button>
                                    )}
                                    {currentStep > 0 && (
                                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                            Previous
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                        <Row justify='center'>
                            <Col sm={8} md={12} lg={16} xl={20} xxl={24}>
                                {steps[currentStep].content}
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={4}>
                    <Steps
                        style={{ marginTop: "36px", height: "70vh" }}
                        direction='vertical'
                        current={currentStep}
                        onChange={(current: number) => setCurrentStep(current)}
                    >
                        {
                            steps.map((step, index) => {
                                let status = getStatus(index);

                                return (
                                    <Step status={status} {...step} />
                                );
                            })
                        }
                    </Steps>
                </Col>
            </Row>
        </>
    );

}
export default ProcessStreamStartUp;