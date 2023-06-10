import React, { useEffect, useState } from 'react';
import '@src/assets/ProcessStreamStartUp.scss';
import { ContentHeader, ContentLayout } from '@src/component/utils/Layout';
import ProdDetachSpecInput from './ProdDetachSpecInput';
import InitSkuAsinMapping from './InitSkuProcess/InitSkuAsinMapping';

import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { SiAmazonaws } from 'react-icons/si';
import { IoHardwareChipOutline } from 'react-icons/io5';
import { TbListDetails } from 'react-icons/tb';

import { Row, Col, Steps } from 'antd';
import ProdKeySpecInput from './ProdKeySpecInput';

const InitNewProdWorkflow: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isScreenMaxWidthReach, setScreenMaxWidthReach] = useState<boolean>(window.innerWidth > 1470);

    useEffect(() => {
        const handleResize = () => {
            setScreenMaxWidthReach(window.innerWidth > 1470);
        };

        handleResize(); // Call the handler once on initial render

        window.addEventListener('resize', handleResize); // Add event listener

        return () => {
            window.removeEventListener('resize', handleResize); // Clean up the event listener
        };
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
            title: "Generate Amazon SKU",
            // description: "",
            icon: <SiAmazonaws />,
            content: <InitSkuAsinMapping nextCatag={next} prevCatag={prev} />
        },
        {
            key: "init-product-detachable-spec",
            title: 'Detachable Parts',
            // description: "RAM Slots, SSD Slots...",
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

        isScreenMaxWidthReach ? (
            <>
                <Row>
                    <Col>
                        <ContentHeader title="Init New Product" subTitle={steps[currentStep].title} />
                    </Col>
                    <Col>
                        <MdOutlineTipsAndUpdates />
                    </Col>
                </Row>
                <Row >
                    <Col span={21} style={{ overflow: "auto" }}>
                        {steps[currentStep].content}
                    </Col>
                    <Col span={3}>
                        <Steps
                            responsive
                            labelPlacement='vertical'
                            size='small'
                            type='navigation'
                            direction='vertical'
                            current={currentStep}
                            onChange={(current: number) => setCurrentStep(current)}
                            items={steps}
                        />
                    </Col>
                </Row>
            </>
        ) : (
            <ContentLayout>
                <Row align="middle">
                    <Col>
                        <ContentHeader title="Init New Product" subTitle={steps[currentStep].title} />
                    </Col>
                    <Col>
                        <MdOutlineTipsAndUpdates />
                    </Col>
                </Row>
                <Row>
                    <div style={{ display: "flex", flexDirection: 'row', alignItems: "center" }}>
                        <Steps
                            type='default'
                            style={{ alignItems: "center", marginRight: "4px" }}
                            direction='horizontal'
                            current={currentStep}
                            onChange={(current: number) => setCurrentStep(current)}
                            items={miniSteps}
                        />
                        {/* <GiRun className={css`
                                    stroke: ${token.colorTextSecondary};
                                    fill: ${token.colorTextSecondary};
                                    font-size: 18px;
                                    `} /> */}
                    </div>
                </Row>
                <Row>
                    <Col span={24}>
                        {steps[currentStep].content}
                    </Col>
                </Row>

            </ContentLayout >
        )
    );

}
export default InitNewProdWorkflow;