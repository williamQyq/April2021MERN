import React, { useState } from 'react';
import { message, Typography } from 'antd';
import { createAccessoriesEnumObj, waitTime } from './utilities';
import { HDD, RAM, SSD } from 'component/utility/types.enum';
import SkuEditableCreationTable from './SkuEditableTable';
import MyProCard from 'component/utility/MyProCard';
import FileUpload from 'component/utility/FileUploader';
import { downloadProductPrimeCostTemplate, uploadProductsPrimeCost } from 'reducers/actions/operationAction';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'reducers/store/store';
import {
    StepsFormDataType,
    StepComponentProps,
    InitSkuDataSourceType,
    FileUploadRequestOption,
    Accessories
} from 'component/utility/cmpt.interface.d';
import {
    ProDescriptions,
    ProFormCheckbox,
    ProFormRadio,
    ProFormSelect,
    ProFormSlider,
    StepsForm
} from '@ant-design/pro-components';
import TemplateDownloader from './TemplateDownloader';


const { StepForm } = StepsForm;

const defaultStepsData: Partial<StepsFormDataType> = {
    amzAccts: ["RS"],
    shippingTemplate: "USPrime"
}

const InitSkuAsinMapping: React.FC<StepComponentProps> = () => {
    const [dataSource, setDataSource] = useState<readonly InitSkuDataSourceType[]>([]);
    const [stepsFormData, setStepsFormData] = useState<Partial<StepsFormDataType> | null>(null);
    const dispatch: AppDispatch = useDispatch();

    //Accessories key, type Map, e.g <4GB_0, 4GB>
    const ramValueEnum = createAccessoriesEnumObj([RAM.DDR4_4, RAM.DDR4_8, RAM.DDR4_16, RAM.DDR4_32]);
    const ssdValueEnum = createAccessoriesEnumObj([SSD.PCIE_2048, SSD.PCIE_1024, SSD.PCIE_512, SSD.PCIE_256, SSD.PCIE_128]);

    //stepsFormData combine each step form field data and sku editableTable datasource
    const collectInfoOnFinish = (values: Partial<StepsFormDataType>): void => {
        setStepsFormData({ ...values, dataSource: dataSource });
    }

    const handlePrimeCostUpload = (options: FileUploadRequestOption) => {
        dispatch(uploadProductsPrimeCost(options));
    }

    //download sample prime cost template xlxs
    const handlePrimeCostTemplateDownload = () => {
        console.log('download PrimeCostTemplate Xlsx.')
        dispatch(downloadProductPrimeCostTemplate());
    }

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
                    <SkuEditableCreationTable
                        dataSource={dataSource}
                        setDataSource={setDataSource}
                        accessoriesValueEnum={{
                            ramValueEnum,
                            ssdValueEnum
                        }}
                    />
                </MyProCard>
                <MyProCard title="Supplement Info">
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
                <MyProCard
                    title="Prime Cost Upload"
                    collapsible={false}
                    extra={<TemplateDownloader
                        handleTemplateDownload={handlePrimeCostTemplateDownload} />
                    }>
                    <FileUpload customizedUpload={handlePrimeCostUpload} />
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
            // request={async () => {
            //     return true;
            // }}
            >
                <MyProCard title="Generated SKU and Price">


                </MyProCard>

                <MyProCard title="Last Input Data Info">
                    {
                        stepsFormData?.dataSource?.map(skuRowData => {
                            // let columns = createDescriptionColumns(skuRowData);
                            console.log(skuRowData);
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
                                            render: (values) => {
                                                let accsValues = values as Exclude<Accessories, HDD>[];
                                                return accsValues.map((accs) => (
                                                    <Typography.Text key={accs}>{accs} </Typography.Text>
                                                ))
                                            }
                                        },
                                        {
                                            title: "SSD",
                                            key: "ssd",
                                            dataIndex: "ssd",
                                            render: (values) => {
                                                let accsValues = values as Exclude<Accessories, HDD>[];
                                                return accsValues.map((accs) => (
                                                    <Typography.Text key={accs}>{accs} </Typography.Text>
                                                ))
                                            }
                                        },
                                        {
                                            title: "HDD",
                                            key: "hdd",
                                            dataIndex: "hdd",
                                        },
                                        {
                                            title: "OS",
                                            key: "os",
                                            dataIndex: "os",
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