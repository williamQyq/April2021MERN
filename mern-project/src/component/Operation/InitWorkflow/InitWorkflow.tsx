import React, { useState } from 'react';
import 'styles/ProcessStreamStartUp.scss';
import { ContentHeader } from 'component/utility/Layout';
import { StepStatus } from 'types';
import ProdDetachSpecInput from './ProdDetachSpecInput';
import InitSkuAsinMapping from './InitSkuAsinMapping';

import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { SiAmazonaws } from 'react-icons/si';
import { IoHardwareChipOutline } from 'react-icons/io5';
import { TbListDetails } from 'react-icons/tb';

import { Typography, Row, Col, Steps } from 'antd';
import ProdKeySpecInput from './ProdKeySpecInput';


const { Title } = Typography;
const { Step } = Steps;

const InitNewProdWorkflow: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    //Set current Step status: error, process finish,wait
    const getStepStatus = (index: number): StepStatus => {
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
            key: "init-product-detachable-spec",
            title: 'Detachable Specification',
            description: "RAM Slots, SSD Slots...",
            icon: <IoHardwareChipOutline />,
            content: <ProdDetachSpecInput nextCatag={next} prevCatag={prev} />
        },
        {
            key: "init-product-key-spec",
            title: 'Key Specification',
            description: "CPU, GPU, Screen...",
            icon: <TbListDetails />,
            content: <ProdKeySpecInput nextCatag={next} prevCatag={prev} />
        },
        {
            key: "init-sku",
            title: "Init Amazon SKU",
            description: "Generate SKU for AWS Selling Partner",
            icon: <SiAmazonaws />,
            content: <InitSkuAsinMapping nextCatag={next} prevCatag={prev} />
        }
    ]

    return (
        <>
            <Row align='middle'>
                <Col>
                    <ContentHeader title="Init New Product" />
                </Col>
                <Col>
                    <MdOutlineTipsAndUpdates />
                </Col>
            </Row>

            <Row gutter={[8, 16]}>
                <Col span={20}>
                    <div className='steps-content'>
                        <Title level={3}> {steps[currentStep].title} </Title>
                        {steps[currentStep].content}
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
                                let status = getStepStatus(index);
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
export default InitNewProdWorkflow;