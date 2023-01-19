import React, { useState } from 'react';
import { ProDescriptions, ProFormCheckbox, ProFormRadio, ProFormSelect, ProFormSlider, StepsForm } from '@ant-design/pro-components';
import { message } from 'antd';
import { waitTime } from './utilities';
import { DataSourceType, ShippingTemplate, StepComponentProps } from './types';
import SkuEditableCreationTable from './SkuEditableTable';
import MyProCard from 'component/utility/MyProCard';

const { StepForm } = StepsForm;

const defaultStepsData: Partial<StepsFormDataType> = {
    amzAccts: ["RS"],
    shippingTemplate: "USPrime"
}
interface StepsFormDataType {
    dataSource: readonly DataSourceType[];
    amzAccts: string[];
    shippingTemplate: ShippingTemplate;
    profitRate: number;
    addon: any[];
}
const InitSkuAsinMapping: React.FC<StepComponentProps> = () => {
    const [dataSource, setDataSource] = useState<readonly DataSourceType[]>([]);
    const [stepsFormData, setStepsFormData] = useState<Partial<StepsFormDataType> | null>(null);

    //stepsFormData combine each step form field data and sku editableTable datasource
    const collectInfoOnFinish = (values: Partial<StepsFormDataType>): void => {
        setStepsFormData({ ...values, dataSource: dataSource });
    }
    // const createDescriptionColumns = (skuRowData: Partial<DataSourceType>) => {
    //     return Object.entries(skuRowData).map(([key, value]) => (
    //         {
    //             title: value,
    //             key: key,
    //             dataIndex: key,
    //             copyable: true
    //         }
    //     ));
    // }

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
                    await waitTime(1000);
                    message.success('Init SKU Finished');
                    collectInfoOnFinish(values);
                    return true;
                }}
                request={async () => {
                    return defaultStepsData;
                }}
            >
                <MyProCard title="Create SKU">
                    <SkuEditableCreationTable dataSource={dataSource} setDataSource={setDataSource} />
                </MyProCard>
                <MyProCard title="Create SKU">
                    <ProFormCheckbox.Group
                        name="amzAccts"
                        label="Amazon Accounts"
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
                </MyProCard>
            </StepForm>
            <StepForm
                name="verifySku"
                title="Verify SKU"
                isKeyPressSubmit={true}
                onFinish={async () => {
                    await waitTime(1000);
                    message.success("Downloaded Generated SKU Success");
                    console.log(`values: `, stepsFormData)
                    return true;
                }}
            >
                <MyProCard title="Verify SKU">
                    {
                        stepsFormData?.dataSource?.map(skuRowData => {
                            // let columns = createDescriptionColumns(skuRowData);
                            return (
                                <ProDescriptions
                                    key={skuRowData.id}
                                    dataSource={skuRowData}
                                    column={6}
                                    colon={false}
                                    columns={[
                                        {
                                            // title: skuRowData.asin,
                                            key: "asin",
                                            dataIndex: "asin",
                                            copyable: true
                                        },
                                        {
                                            key: "upc",
                                            dataIndex: "upc",
                                            copyable: true
                                        },
                                        {
                                            title: "RAM",
                                            key: "ram",
                                            dataIndex: "ram",
                                        },
                                    ]}
                                />
                            )
                        })}

                </MyProCard>
            </StepForm>
        </StepsForm>
    );
};

export default InitSkuAsinMapping;