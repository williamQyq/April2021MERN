import React from 'react';
import { ProCard, ProFormCheckbox, ProFormRadio, ProFormSelect, ProFormSlider, StepsForm } from '@ant-design/pro-components';
import { message } from 'antd';
import { waitTime } from './utilities';
import { StepComponentProps, IMyStep } from './types';
import CreateSkuEditableTable from './SkuEditableTable';

const { StepForm } = StepsForm;

const defaultData = {
    amzAccts: ["RS", "PRO"],
    shippingTemplate: "USPrime"
}

const InitSkuAsinMapping: React.FC<StepComponentProps> = () => {

    return (
        <StepsForm
            stepsRender={(_) => <></>}
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
            <StepForm
                name="verifySku"
                title="Verify SKU"
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
                    title="Verify SKU"
                    bordered
                    headerBordered
                    style={{
                        marginBlockEnd: 16,
                        minWidth: 800,
                        maxWidth: '100%',
                    }}
                >

                </ProCard>
            </StepForm>
            <StepForm
                name="done"
                title="Done"
                onFinish={async () => {
                    message.success("Downloaded Generated SKU Success");
                }}
            >
                <ProCard
                    style={{
                        marginBlockEnd: 16,
                        minWidth: 800,
                        maxWidth: '100%',
                        minHeight: 600
                    }}
                >

                </ProCard>
            </StepForm>
        </StepsForm>
    );
};

export default InitSkuAsinMapping;