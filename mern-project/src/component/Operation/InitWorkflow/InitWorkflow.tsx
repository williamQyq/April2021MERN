import React, { useEffect, useState } from 'react';
import '@src/assets/ProcessStreamStartUp.scss';
import { css } from '@emotion/css';
import { ContentHeader } from '@src/component/utils/Layout';
// import { StepStatus } from 'types';
import ProdDetachSpecInput from './ProdDetachSpecInput';
import InitSkuAsinMapping from './InitSkuProcess/InitSkuAsinMapping';

import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { SiAmazonaws } from 'react-icons/si';
import { IoHardwareChipOutline } from 'react-icons/io5';
import { TbListDetails } from 'react-icons/tb';
import { GiRun } from 'react-icons/gi';

import { Typography, Row, Col, Steps, theme } from 'antd';
import ProdKeySpecInput from './ProdKeySpecInput';

const { Title } = Typography;

const InitNewProdWorkflow: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { token } = theme.useToken();
    const [isScreenMaxWidthReach, setScreenMaxWidthisReach] = useState<boolean>(window.matchMedia("(max-width: 1600px)").matches);

    useEffect(() => {
        const handler = (e: MediaQueryListEvent) => setScreenMaxWidthisReach(e.matches)
        window.matchMedia("(max-width: 1600px)").addEventListener('change', handler);

    }, []);
    //Set current Step status: error, process finish,wait
    // const getStepStatus = (index: number): StepStatus => {
    //     let status = StepStatus.error;
    //     if (index < currentStep) {
    //         status = StepStatus.finish;
    //     } else if (index === currentStep) {
    //         status = StepStatus.process;
    //     } else if (index > currentStep) {
    //         status = StepStatus.wait;
    //     }

    //     return status;
    // }
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
            key: "init-sku",
            title: "Init Amazon SKU",
            description: "Generate SKU for AWS Selling Partner",
            icon: <SiAmazonaws />,
            content: <InitSkuAsinMapping nextCatag={next} prevCatag={prev} />
        },
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
        }
    ]
    const miniSteps = [
        {
            key: "init-product-detachable-spec",
            icon: <IoHardwareChipOutline />,
            content: <ProdDetachSpecInput nextCatag={next} prevCatag={prev} />
        },
        {
            key: "init-product-key-spec",
            icon: <TbListDetails />,
            content: <ProdKeySpecInput nextCatag={next} prevCatag={prev} />
        },
        {
            key: "init-sku",
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
                    <Title level={3}> {steps[currentStep].title} </Title>
                    {steps[currentStep].content}
                </Col>
                <Col span={4}>
                    {
                        isScreenMaxWidthReach ?
                            <div style={{ display: "flex", flexDirection: 'row', alignItems: "center", minWidth: "180px" }}>

                                <Steps
                                    style={{ alignItems: "center", marginRight: "4px" }}
                                    direction='horizontal'
                                    current={currentStep}
                                    onChange={(current: number) => setCurrentStep(current)}
                                    items={miniSteps}
                                />
                                <GiRun className={css`
                                stroke: ${token.colorTextSecondary};
                                fill: ${token.colorTextSecondary};
                                font-size: 18px;
                                `} />
                            </div>
                            :
                            <Steps
                                style={{ marginTop: "36px", height: "70vh" }}
                                direction='vertical'
                                current={currentStep}
                                onChange={(current: number) => setCurrentStep(current)}
                                items={steps}
                            />
                    }

                </Col>
            </Row>
        </>
    );

}
export default InitNewProdWorkflow;