import React, { useState, useCallback } from 'react';
import { message, Typography } from 'antd';
import { createAccessoriesEnumObj, waitTime } from './utilities';
import { HDD, RAM, SSD } from 'component/utility/types.enum';
import SkuEditableCreationTable from './SkuEditableTable';
import MyProCard from 'component/utility/MyProCard';
import FileUploader from 'component/utility/FileUploader';
import {
    downloadInitSkuforAmzSPFeeds,
    downloadProductPrimeCostTemplate,
    uploadProductsPrimeCost
} from 'reducers/actions/operationAction';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'reducers/store/store';
import {
    InitSkuStepsFormDataType,
    StepComponentProps,
    InitSkuDataSourceType,
    FileUploadRequestOption,
    Accessories,
    SkuConfig,
    VerifiedSkuDataSourceType
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

const defaultStepsData: Partial<InitSkuStepsFormDataType> = {
    amzAccts: ["RS"],
    shippingTemplate: "USPrime"
}

const tempSkuDataSource1 = {
    id: 1,
    sku: "196801739468-32102400H00P-AZM-B0BPHP6D2Z",
    price: 863.99,
    minPrice: 858.99,
    maxPrice: 1717.98
};
const tempSkuDataSource2 = {
    id: 2,
    sku: "196801739468-32102400H00P-AZM-B0BPHP6D2Z",
    price: 863.99,
    minPrice: 858.99,
    maxPrice: 1717.98
};
const InitSkuAsinMapping: React.FC<StepComponentProps> = () => {
    const dispatch: AppDispatch = useDispatch();

    //sku specification data source
    const [dataSource, setDataSource] = useState<readonly InitSkuDataSourceType[]>([]);
    //steps form data source, include sku specification data source in dataSource
    const [stepsFormData, setStepsFormData] = useState<Partial<InitSkuStepsFormDataType> | null>(null);

    //generated sku, prices from sku specification data source
    const [verifiedSkuDataSource, setVerifiedSkuDataSource] = useState<VerifiedSkuDataSourceType[]>([tempSkuDataSource1, tempSkuDataSource2]);

    //Accessories key, type Map, e.g <4GB_0, 4GB>
    const ramValueEnum = createAccessoriesEnumObj([RAM.DDR4_4, RAM.DDR4_8, RAM.DDR4_16, RAM.DDR4_32]);
    const ssdValueEnum = createAccessoriesEnumObj([SSD.PCIE_2048, SSD.PCIE_1024, SSD.PCIE_512, SSD.PCIE_256, SSD.PCIE_128]);

    //stepsFormData combine each step form field data and sku editableTable datasource
    const collectEditableConfigOnFinish = (values: Partial<InitSkuStepsFormDataType>): void => {
        setStepsFormData({ ...values, dataSource: dataSource });
    }

    const handlePrimeCostUpload = (options: FileUploadRequestOption) => {
        dispatch(uploadProductsPrimeCost(options));
    }

    //download sample prime cost template xlxs
    const handlePrimeCostTemplateDownload = useCallback(() => {
        console.log('download PrimeCostTemplate Xlsx.');
        dispatch(downloadProductPrimeCostTemplate());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //download sku feeds xlsx for Amz skus upload
    const downloadSkuUploadFeeds = useCallback((skuConfigValues: SkuConfig | null) => {
        console.log('download sku upload feeds Xlsx.');
        dispatch(downloadInitSkuforAmzSPFeeds(skuConfigValues));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const calcAndVerifiedSkuPrices = useCallback((stepsFormData: InitSkuStepsFormDataType) => {
        dispatch(calcAndVerifiedSkuPrices(stepsFormData))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    collectEditableConfigOnFinish(values);
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
                                { label: 'HDMI CABLE', value: 'hdmiCable' },
                                { label: 'Pen', value: 'pen' },
                            ].filter(({ value, label }) => {
                                return value.includes(keyWords) || label.includes(keyWords);
                            });
                        }}
                    />
                </MyProCard>
                <MyProCard
                    title="Prime Cost Upload"
                    tooltip="If any prime cost of bundle cost not being recorded..."
                    collapsible={false}
                    extra={<TemplateDownloader
                        handleTemplateDownload={handlePrimeCostTemplateDownload} />
                    }>
                    <FileUploader customizedUpload={handlePrimeCostUpload} />
                </MyProCard>
            </StepForm>
            <StepForm
                name="verifySku"
                title="Verify SKU"
                isKeyPressSubmit={true}
                onFinish={async (_) => {
                    await waitTime(1000);
                    message.success("Downloaded Generated SKU Success");
                    downloadSkuUploadFeeds(stepsFormData);
                    return true;
                }}
            >
                <MyProCard title="Generated SKU and Price">
                    {
                        verifiedSkuDataSource.map((skuDescr: VerifiedSkuDataSourceType) => (
                            <ProDescriptions
                                key={skuDescr.id}
                                column={2}
                                dataSource={skuDescr}
                                columns={[
                                    {
                                        title: "SKU",
                                        key: "sku",
                                        dataIndex: "sku",
                                        copyable: true
                                    },
                                    {
                                        title: "Price",
                                        key: "price",
                                        dataIndex: "price",
                                        valueType: (item) => ({
                                            type: 'money',
                                            locale: 'en-US'
                                        })
                                    },
                                    {
                                        title: "Min Price",
                                        key: "minPrice",
                                        dataIndex: "minPrice",
                                        valueType: (item) => ({
                                            type: 'money',
                                            locale: 'en-US'
                                        })
                                    },
                                    {
                                        title: "Max Price",
                                        key: "maxPrice",
                                        dataIndex: "maxPrice",
                                        valueType: (item) => ({
                                            type: 'money',
                                            locale: 'en-US'
                                        })
                                    }
                                ]}
                            />
                        ))
                    }
                </MyProCard>

                <MyProCard title="Last Input Data Info">
                    {
                        stepsFormData?.dataSource?.map(skuRowData => {
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