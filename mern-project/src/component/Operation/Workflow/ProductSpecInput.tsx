import {
    ProCard,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    StepsForm,
} from '@ant-design/pro-components';
import { message, Steps } from 'antd';
import React, { useState } from 'react';
import { IoHardwareChipOutline } from 'react-icons/io5';
import { FcInspection } from 'react-icons/fc';
import { TbListDetails } from 'react-icons/tb';
import FileUpload from 'component/utility/FileUpload';
import { Submitter, waitTime } from './utilities';
import { HDD, OS, RAM, SSD } from './types';

interface IProps {
    nextCatag?: () => void;
    prevCatag?: () => void;
}

const ProductSpecInput: React.FC<IProps> = (props: IProps) => {
    const { nextCatag } = props;
    const ramOptions: RAM[] = [RAM.DDR4_4, RAM.DDR4_8, RAM.DDR4_16, RAM.DDR4_32];
    const ssdOptions: SSD[] = [SSD.PCIE_128, SSD.PCIE_256];
    const hddOptions: HDD[] = [HDD.HDD_1TB, HDD.HDD_2TB];
    const osOptions: OS[] = [OS.W10H, OS.W10P];

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
            name: "done",
            title: "Done",
            icon: <FcInspection />
        }
    ]

    return (
        <StepsForm
            //cutomize next prev
            submitter={{
                render: (props, _) => Submitter({
                    form: props.form,
                    stepsCount: steps.length,
                    curStep: props.step,
                    next,
                    prev,
                    nextCatag
                })
            }}
            current={currentStep}
            stepsRender={(_) =>
                <Steps current={currentStep}>{
                    steps.map(step =>
                        <Steps.Step key={step.name}{...step} />
                    )
                }</Steps>
            }
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
                            mode: 'multiple',
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
    );
};

export default ProductSpecInput;