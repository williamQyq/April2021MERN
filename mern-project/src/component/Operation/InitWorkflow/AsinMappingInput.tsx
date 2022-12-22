import React, { useState } from 'react';
import { ProCard, ProFormCheckbox, ProFormRadio, ProFormSelect, ProFormSlider, StepsForm } from '@ant-design/pro-components';
import { GoUnverified } from 'react-icons/go';
import { FcInspection } from 'react-icons/fc';
import { FaWpforms } from 'react-icons/fa';
import { MySteps, Submitter, waitTime } from './utilities';
import { message } from 'antd';
import { StepComponentProps, IMyStep } from './types';
import CreateSkuEditableTable from './SkuEditableTable';

const { StepForm } = StepsForm;

const defaultData = {
    amzAccts: ["RS", "PRO"],
    shippingTemplate: "USPrime"
}
const AsinMappingInput: React.FC<StepComponentProps> = (props: StepComponentProps) => {
    const { nextCatag, prevCatag } = props;

    const [currentStep, setCurrentForm] = useState(0);
    const [skuInfo, setSkuInfo] = useState();

    const next = (currentStep: number) => {
        setCurrentForm(currentStep + 1);
    }

    const prev = () => {
        setCurrentForm(currentStep - 1);
    }

    const steps: IMyStep[] = [
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
            current={currentStep}
            submitter={{
                render:
                    (props, _) => Submitter({
                        form: props.form,
                        stepsCount: steps.length,
                        curStep: props.step,
                        next,
                        prev,
                    })
            }}
            stepsRender={(_) =>
                MySteps({
                    current: currentStep,
                    steps: steps
                })
            }
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
                onFinish={async (values) => {
                    console.log(`collect info`, values);
                    await waitTime(1000);
                    message.success('Submit Success');
                    return true;
                }}
                request={async () => {
                    return defaultData;
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
                    <CreateSkuEditableTable />
                </ProCard>
                <ProCard
                    title="Extra"
                    bordered
                    headerBordered
                    collapsible
                    style={{
                        minWidth: 800,
                        maxWidth: "100%",
                        marginBlockEnd: 16,
                    }}
                >
                    <ProFormCheckbox.Group
                        name="amzAccts"
                        label="RS or/and Pro"
                        options={['RS', 'PRO']}
                        tooltip="These skus are created for which store?"
                        rules={[
                            { required: true, message: "Must create for at least one store.", type: 'array' }
                        ]}
                    />
                    <ProFormSlider
                        name="profitRate"
                        label="Profit Rate"
                        width="md"
                        min={0}
                        max={25}
                        marks={{
                            0: '0%',
                            7: "7%",
                            15: '15%',
                            20: "20%",
                            25: '25%',
                        }}
                    />
                    <ProFormRadio.Group
                        name="shippingTemplate"
                        label="Shipping Template"
                        options={['USPrime', 'Regular']}
                        tooltip="Sku for Prime?"
                        rules={[
                            { required: true, message: "Must select one template.", type: 'string' }
                        ]}
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