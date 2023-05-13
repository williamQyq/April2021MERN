import React, { useState, useCallback, useMemo } from 'react';
import { Typography, theme } from 'antd';
import { waitTime } from '../utilities';
import { HDD } from '@src/component/utils/types.enum';
import MyProCard from '@src/component/utils/MyProCard';
import {
    downloadInitSkuforAmzSPFeeds,
} from '@src/redux/actions/operationAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@src/redux/store/store';
import {
    InitSkuStepsFormDataType,
    StepComponentProps,
    SkuDataSourceType,
    Accessories,
    SkuConfig,
    VerifiedSellerAllowedPriceDataType
} from '@src/component/utils/cmpt.interface';
import {
    ProDescriptions,
    StepsForm
} from '@ant-design/pro-components';
import { VscUnverified, VscVerified } from 'react-icons/vsc';
import { ReduxRootState } from '@src/redux/interface';
import { parseSsdDataSource, parseRamDataSource } from '@src/redux/actions/actionsHelper';
import SkuConfigInputStepForm from './SkuConfigInputStepForm';
import { GET_SKU_PRIME_COST } from '@src/redux/actions/types';
import { css } from '@emotion/css';

const { StepForm } = StepsForm;
const { useToken } = theme;

const InitSkuAsinMapping: React.FC<StepComponentProps> = () => {
    const dispatch: AppDispatch = useDispatch();
    const { token } = useToken();   //antd theme token
    //sku specification data source
    const [dataSource, setDataSource] = useState<readonly SkuDataSourceType[]>([]);
    //steps form data source, include sku specification data source in dataSource
    const [stepsFormData, setStepsFormData] = useState<Partial<InitSkuStepsFormDataType> | null>(null);

    //generated sku, prices from sku specification data source
    const verifiedSkuDataSource = useSelector((state: ReduxRootState) => state.amazon.primeCost);
    const calcPrimeCostHasError = useSelector((state: ReduxRootState) => state.error.id === GET_SKU_PRIME_COST ? true : false);

    //stepsFormData combine each step form field data and sku editableTable datasource
    const initEditableConfigOnFinish = (values: Partial<InitSkuStepsFormDataType>, skuDataSource: readonly SkuDataSourceType[]): void => {
        setStepsFormData({ ...values, dataSource: skuDataSource });
    }

    const handleProfitRateOnchange = (newProfitRate: number | null) => {
        if (newProfitRate) {
            console.log(`[profit rate] set new profit rate ${newProfitRate}.`)
            setStepsFormData({ ...stepsFormData, profitRate: newProfitRate })
        }
    }

    const profitRate = useMemo(() => stepsFormData?.profitRate, [stepsFormData?.profitRate]);
    // download sku feeds xlsx for Amz skus upload
    const downloadSkuUploadFeeds = useCallback((skuConfigValues: SkuConfig | null) => {
        console.log('download sku upload feeds Xlsx.');
        dispatch(downloadInitSkuforAmzSPFeeds(skuConfigValues));
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
            <SkuConfigInputStepForm
                dataSource={dataSource}
                setDataSource={setDataSource}
                handleProfitRateOnChange={handleProfitRateOnchange}
                profitRate={profitRate}
                initEditableConfigOnFinish={initEditableConfigOnFinish}
            />

            {/**...Verification Step... */}
            <StepForm
                name="verifySku"
                title="Verify SKU"
                isKeyPressSubmit={true}
                onFinish={async (_) => {
                    await waitTime(1000);
                    // message.success("Downloaded Generated SKU Success");
                    downloadSkuUploadFeeds(verifiedSkuDataSource);
                    return true;
                }}

            >
                <MyProCard
                    title="Generated SKU and Price"
                    extra={calcPrimeCostHasError ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <VscUnverified className={css`
                            fill:${token.colorError};
                            font-size:24px;
                            `} />
                            <Typography.Text type='danger'>Warning! Missing Important Prime Cost </Typography.Text>
                        </div>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <VscVerified className={css`
                            fill: ${token.colorSuccess};
                            font-size: 24px;
                            `} />
                            <Typography.Text type="success" style={{ height: "100%" }}>Price Verified</Typography.Text>
                        </div>
                    )}>
                    {
                        verifiedSkuDataSource ? verifiedSkuDataSource.map((skuDescr: VerifiedSellerAllowedPriceDataType) => (
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
                                        valueType: (_) => ({
                                            type: 'money',
                                            locale: 'en-US'
                                        })
                                    }
                                ]}
                            />
                        )) : null
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
                                                let accumulatedValue = accsValues.reduce((accumSsd: number, unparsedSsd: string) => {
                                                    const ssdValue = parseSsdDataSource(unparsedSsd);
                                                    return accumSsd + ssdValue;
                                                }, 0);

                                                return <Typography.Text>PCIE{accumulatedValue}</Typography.Text>
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