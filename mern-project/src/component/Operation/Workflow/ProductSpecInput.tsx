import {
    ProCard,
    ProForm,
    ProFormCheckbox,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormDigit,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    StepsForm,
} from '@ant-design/pro-components';
import { Button, FormInstance, message, Steps } from 'antd';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import { IoHardwareChipOutline } from 'react-icons/io5';
import { FcInspection } from 'react-icons/fc';
import { TbListDetails } from 'react-icons/tb';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import FileUpload from 'component/utility/FileUpload';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};
interface IProps {
    nextCatag?: () => void;
    prevCatag?: () => void;
}

const ProductSpecInput: React.FC<IProps> = (props: IProps) => {
    const { nextCatag } = props;
    const ramOptions: string[] = ["Empty", "DDR4-4L", "DDR4-8L", "DDR4-16L", "DDR5-8L", "DDR5-16L"]
    const ssdOptions: string[] = ["Empty", "PCIE-512", "PCIE-1024"]
    const hddOptions: string[] = ["Empty", "1TB", "2TB"]
    const osOptions: string[] = ["Windows 10 Home", "Windows 10 Pro", "Windows 11 Home", "Windows 11 Pro"]

    const [currentStep, setCurrentForm] = useState(0);
    const next = (currentStep: number) => {
        setCurrentForm(currentStep + 1);
    }
    const prev = () => {
        setCurrentForm(currentStep - 1);
    }

    const handlePictureUpload = () => {

    }

    const steps = [
        {
            name: "detachableSpecs",
            title: "Detachable Specs",
            icon: <IoHardwareChipOutline />
        }, {
            name: "keySpecs",
            title: "Key Specs",
            icon: <TbListDetails />
        }, {
            name: "Verify SKU",
            title: "Verify SKU",
            icon: <AiOutlineCloudDownload />
        }, {
            name: "done",
            title: "Done",
            icon: <FcInspection />
        }
    ]
    const renderSubmitter = (form: FormInstance<any> | undefined): ReactNode[] => {
        const handleSubmit = async () => {
            form?.submit?.();
            await waitTime(2000);
            nextCatag?.();
        }
        const handleNext = async () => {
            form?.validateFields()
                .then(() => next(currentStep))
        }

        let submitterGroup: ReactNode[] = [];
        const NextBtn = () => <Button type="primary" onClick={() => handleNext()}>Next</Button>
        const PrevBtn = () => <Button type="ghost" onClick={() => prev()}>Prev</Button>
        // const ResetBtn = () => <Button type="primary" onClick={() => form?.resetFields()}>Reset</Button>
        const DoneBtn = () => <Button type="primary" onClick={() => handleSubmit()}>Done</Button>

        const hasNext = currentStep < steps.length ? true : false;
        const hasPrev = currentStep > 0 ? true : false;
        const isLastStep = currentStep === steps.length - 1 ? true : false;

        if (hasNext && !isLastStep)
            submitterGroup.push(<NextBtn key="next" />);
        if (hasPrev)
            submitterGroup.push(<PrevBtn key="prev" />);
        if (isLastStep) {
            submitterGroup.push(<DoneBtn key="done" />);
        }

        return submitterGroup;
    }

    return (
        <>
            <StepsForm
                submitter={{
                    render: (props, dom) => renderSubmitter(props.form)
                }}
                current={currentStep}
                stepsRender={(_, dom) => {
                    return (
                        <Steps current={currentStep}>
                            {
                                steps.map(step => <Steps.Step key={step.name}{...step} />)
                            }
                        </Steps>
                    )
                }}
                onFinish={async (values) => {
                    /*
                    save form values to db
                    ....
                    */
                    await waitTime(1000);
                    message.success('Submit Success');
                }}
                formProps={{
                    validateMessages: {
                        required: 'Info is required',
                    },
                }}
            >
                <StepsForm.StepForm
                    name="detachableSpecs"
                    title="Detachable Specs"
                    initialValues={{
                        ramOnboard: 'None',
                        hdd: ["Empty"]
                    }}
                    isKeyPressSubmit={true}
                    onFinish={async () => {
                        await waitTime(2000);
                        return true;
                    }}
                >
                    <ProCard
                        title="Detachable Hardware"
                        bordered
                        headerBordered
                        // collapsible
                        style={{
                            marginBlockEnd: 16,
                            minWidth: 800,
                            maxWidth: '100%',
                        }}
                    >
                        <ProFormText
                            name="upc"
                            width="lg"
                            label="UPC"
                            tooltip="Product UPC"
                            placeholder="Enter product upc"
                            rules={[{ required: true }]}
                        />
                        <ProFormSelect
                            name="ram"
                            label="RAM Specs"
                            fieldProps={{
                                mode: 'tags',
                            }}
                            width="lg"
                            placeholder={"Pick RAM"}
                            rules={[{ required: true }]}
                            options={ramOptions.map((ram) => ({
                                label: ram,
                                value: ram,
                            }))}
                        />
                        <ProFormRadio.Group
                            name="ramOnboard"
                            label="RAM Onboard"
                            width="lg"
                            options={['None', '4GB', '8GB', '16GB']}
                            rules={[{ required: true }]}
                        />
                        <ProFormSelect
                            name="ssd"
                            label="SSD"
                            fieldProps={{
                                mode: 'tags',
                            }}
                            width="lg"
                            placeholder={"Pick SSD"}
                            rules={[{ required: true }]}
                            options={ssdOptions.map((option) => ({
                                label: option,
                                value: option
                            }))}
                        />
                        <ProFormSelect
                            name="hdd"
                            label="HDD"
                            fieldProps={{
                                mode: 'tags',
                            }}
                            width="lg"
                            placeholder={"Pick HDD"}
                            rules={[{ required: true }]}
                            options={hddOptions.map((option) => ({
                                label: option,
                                value: option
                            }))}
                        />
                        <ProFormSelect
                            name="os"
                            label="Operating System"
                            fieldProps={{
                                mode: 'tags',
                            }}
                            width="lg"
                            placeholder={"Pick Operating System"}
                            rules={[{ required: true }]}
                            options={osOptions.map((option) => ({
                                label: option,
                                value: option
                            }))}
                        />
                    </ProCard>

                    <ProCard
                        title="Relative Pictures"
                        bordered
                        headerBordered
                        collapsible
                        style={{
                            minWidth: 800,
                            marginBlockEnd: 16,
                        }}
                    >
                        <FileUpload customizedUpload={() => handlePictureUpload} />
                    </ProCard>
                </StepsForm.StepForm>
                <StepsForm.StepForm name="keySpecs" title="Key Specs">
                    <ProCard
                        style={{
                            minWidth: 800,
                            marginBlockEnd: 16,
                            maxWidth: '100%',
                        }}
                    >
                    </ProCard>
                </StepsForm.StepForm>
                <StepsForm.StepForm name="verifySKU" title="Verify SKU">
                    <ProCard
                        style={{
                            marginBlockEnd: 16,
                            minWidth: 800,
                            maxWidth: '100%',
                        }}
                    >
                    </ProCard>
                </StepsForm.StepForm>
                <StepsForm.StepForm name="done" title="Done">
                    <ProCard
                        style={{
                            marginBlockEnd: 16,
                            minWidth: 800,
                            maxWidth: '100%',
                        }}
                    >
                    </ProCard>
                </StepsForm.StepForm>
            </StepsForm>
        </>
    );
};

export default ProductSpecInput;