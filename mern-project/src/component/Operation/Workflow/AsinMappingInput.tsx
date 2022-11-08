import React, { useState } from 'react';
import { ProCard, ProForm, ProFormCheckbox, ProFormSelect, StepsForm } from '@ant-design/pro-components';
import { GoUnverified } from 'react-icons/go';
import { FcInspection } from 'react-icons/fc';
import { FaWpforms } from 'react-icons/fa';
import { EditableSkuCreatTable, Submitter, waitTime } from './utilities';
import { message, Steps } from 'antd';

const { StepForm } = StepsForm;

const AsinMappingInput: React.FC = () => {

    const [currentStep, setCurrentForm] = useState(0);
    const next = (currentStep: number) => {
        setCurrentForm(currentStep + 1);
    }
    const prev = () => {
        setCurrentForm(currentStep - 1);
    }

    const steps = [
        {
            name: "collectInfo",
            title: "Collect Info",
            icon: <FaWpforms />
        },
        {
            name: "verifySKU",
            title: "Verify SKU",
            icon: <GoUnverified />
        },
        {
            name: "done",
            title: "Done",
            icon: <FcInspection />
        }
    ];

    return (
        <StepsForm
            submitter={{
                render: (props, _) => Submitter({
                    form: props.form,
                    stepsCount: steps.length,
                    curStep: props.step,
                    next,
                    prev,
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
            <StepForm
                name="collectInfo"
                title="Collect Info"
                isKeyPressSubmit={true}
                onFinish={async () => {
                    await waitTime(2000);
                    return true;
                }}
                request={async () => {
                    return {
                        "amzAccts": ["RS", "PRO"]
                    }
                }}
            >
                <ProCard
                    title="Create SKU"
                    bordered
                    headerBordered
                    collapsible
                    style={{
                        marginBlockEnd: 16,
                        minWidth: 800,
                        maxWidth: '100%',
                    }}
                >
                    <EditableSkuCreatTable />
                </ProCard>
                <ProCard
                    title="Extra"
                    bordered
                    headerBordered
                    collapsible
                    style={{
                        minWidth: 800,
                        marginBlockEnd: 16,
                    }}
                >
                    <ProFormCheckbox.Group
                        name="amzAccts"
                        label="RS or/and Pro"
                        options={['RS', 'PRO']}
                    />
                    <ProFormSelect.SearchSelect
                        name="addon"
                        label="Add On 配件"
                        width="lg"
                        fieldProps={{
                            labelInValue: true
                        }}
                        debounceTime={300}
                        request={async ({ keyWords = '' }) => {
                            return [
                                { label: 'HDMI-CABLE', value: 'hdmi-cable' },
                                { label: 'Pen', value: 'pen' },
                            ].filter(({ value, label }) => {
                                return value.includes(keyWords) || label.includes(keyWords);
                            });
                        }}
                    />
                </ProCard>
            </StepForm>
            <StepForm>
            </StepForm>

        </StepsForm>
    );
};

export default AsinMappingInput;