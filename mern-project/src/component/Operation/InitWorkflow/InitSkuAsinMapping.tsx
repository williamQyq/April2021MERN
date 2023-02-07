import React, { useState, useCallback } from 'react';
import { message, Typography } from 'antd';
import { createAccessoriesEnumObj, waitTime } from './utilities';
import { HDD, RAM, SSD } from 'component/utility/types.enum';
import SkuEditableCreationTable from './SkuEditableTable';
import MyProCard from 'component/utility/MyProCard';
import FileUploader from 'component/utility/FileUploader';
import {
    calcVerifiedSkuPrimeCost,
    downloadInitSkuforAmzSPFeeds,
    downloadProductPrimeCostTemplate,
    uploadProductsPrimeCost
} from 'reducers/actions/operationAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'reducers/store/store';
import {
    InitSkuStepsFormDataType,
    StepComponentProps,
    SkuDataSourceType,
    FileUploadRequestOption,
    Accessories,
    SkuConfig,
    VerifiedSellerAllowedPriceDataType
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
import { ReduxRootState } from 'reducers/interface';
import { parseMyAccessoryDataSource, parseRamDataSource } from 'reducers/actions/actionsHelper';


const { StepForm } = StepsForm;

const defaultStepsData: Omit<InitSkuStepsFormDataType, "dataSource"> = {
    amzAccts: ["RS"],
    shippingTemplate: "USPrime",
    profitRate: 7,
    addon: []
}

const ramOptions: RAM[] = [RAM.DDR4_4, RAM.DDR4_8, RAM.DDR4_16, RAM.DDR4_32];
const ssdOptions: SSD[] = [SSD.PCIE_2048, SSD.PCIE_1024, SSD.PCIE_512, SSD.PCIE_256, SSD.PCIE_128]

const InitSkuAsinMapping: React.FC<StepComponentProps> = () => {
    const dispatch: AppDispatch = useDispatch();

    //sku specification data source
    const [dataSource, setDataSource] = useState<readonly SkuDataSourceType[]>([]);
    //steps form data source, include sku specification data source in dataSource
    const [stepsFormData, setStepsFormData] = useState<Partial<InitSkuStepsFormDataType> | null>(null);

    //generated sku, prices from sku specification data source
    const verifiedSkuDataSource = useSelector((state: ReduxRootState) => state.amazon.primeCost);
    //Accessories key, type Map, e.g <4GB_0, 4GB>
    const ramValueEnum = createAccessoriesEnumObj(ramOptions);
    const ssdValueEnum = createAccessoriesEnumObj(ssdOptions);

    //stepsFormData combine each step form field data and sku editableTable datasource
    const initEditableConfigOnFinish = (values: Partial<InitSkuStepsFormDataType>, skuDataSource: readonly SkuDataSourceType[]): void => {
        setStepsFormData({ ...values, dataSource: skuDataSource });
    }

    const handlePrimeCostUpload = (options: FileUploadRequestOption) => {
        dispatch(uploadProductsPrimeCost(options));
    }

    // download sample prime cost template xlxs
    const handlePrimeCostTemplateDownload = useCallback(() => {
        console.log('download PrimeCostTemplate Xlsx.');
        dispatch(downloadProductPrimeCostTemplate());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // download sku feeds xlsx for Amz skus upload
    const downloadSkuUploadFeeds = useCallback((skuConfigValues: SkuConfig | null) => {
        console.log('download sku upload feeds Xlsx.');
        dispatch(downloadInitSkuforAmzSPFeeds(skuConfigValues));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // generate sku and seller allowed prices, and update redux state store
    const processComposedItems = useCallback((stepsFormData: Omit<InitSkuStepsFormDataType, "dataSource">, dataSource: readonly SkuDataSourceType[]) => {
        const controller = new AbortController();
        dispatch(calcVerifiedSkuPrimeCost(controller.signal, { ...stepsFormData, dataSource: dataSource }))
        // eslint-disable-next-line react-hooks/exhaustive-deps

        return () => controller.abort();
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
                onFinish={async (formValues: Omit<InitSkuStepsFormDataType, "dataSource">) => {
                    await waitTime(1000);
                    message.success('Init SKU Finished');
                    initEditableConfigOnFinish(formValues, dataSource);
                    processComposedItems(formValues, dataSource);
                    return true;
                }}
                //preset accts, profit rate, shipping method
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

            {/**...Verification Step... */}
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
                        verifiedSkuDataSource.map((skuDescr: VerifiedSellerAllowedPriceDataType) => (
                            <ProDescriptions
                                key={skuDescr['product-id']}
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
                                        dataIndex: "minimum-seller-allowed-price",
                                        valueType: (item) => ({
                                            type: 'money',
                                            locale: 'en-US'
                                        })
                                    },
                                    {
                                        title: "Max Price",
                                        key: "maxPrice",
                                        dataIndex: "maximum-seller-allowed-price",
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

                <MyProCard title="Verify your Input Accessories">
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

                                                let accumulatedValue = accsValues.reduce((prev: number, next: string) => {
                                                    let ramValue: number = parseRamDataSource(next);
                                                    return prev + ramValue;
                                                }, 0);

                                                return <Typography.Text>{accumulatedValue}GB </Typography.Text>
                                            }
                                        },
                                        {
                                            title: "SSD",
                                            key: "ssd",
                                            dataIndex: "ssd",
                                            render: (values) => {
                                                let accsValues = values as Exclude<Accessories, HDD>[];
                                                return accsValues.map((accs) => {
                                                    const parsedSsd = parseMyAccessoryDataSource(accs);
                                                    return <Typography.Text key={accs} style={{ marginRight: 4 }} >{parsedSsd} </Typography.Text>
                                                })
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