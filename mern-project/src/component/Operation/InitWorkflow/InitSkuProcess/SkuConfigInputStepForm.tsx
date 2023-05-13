import React, { useCallback, useMemo, useState } from 'react';
import {
    StepsForm,
    ProFormCheckbox,
    ProFormRadio,
    ProFormSelect,
    ProFormSlider,
    ProFormGroup,
} from '@ant-design/pro-components';
import { message, Typography, Row, Col, InputNumber } from 'antd';
import {
    InitSkuStepsFormDataType,
    SkuDataSourceType,
    FileUploadRequestOption,
} from '@src/component/utils/cmpt.interface';
import { createAccessoriesEnumObj, waitTime } from '../utilities';
import { AppDispatch, RootState } from '@src/redux/store/store';
import { useDispatch } from 'react-redux';
import {
    calcVerifiedSkuPrimeCost,
    downloadProductPrimeCostTemplate,
    uploadProductsPrimeCost
} from '@src/redux/actions/operationAction';
import MyProCard from '@src/component/utils/MyProCard';
import FileUploader from '@src/component/utils/FileUploader';
import SkuEditableCreationTable from './SkuEditableTable';
import TemplateDownloader from '../TemplateDownloader';
import { RAM, SSD } from '@src/component/utils/types.enum';
import SpreadSheetComponent from '@src/component/utils/SpreadSheetComponent';
import { ThunkAction, AnyAction } from '@reduxjs/toolkit';


const { StepForm } = StepsForm;

interface IProps {
    dataSource: readonly SkuDataSourceType[];
    setDataSource: React.Dispatch<React.SetStateAction<readonly SkuDataSourceType[]>>;
    initEditableConfigOnFinish: (formValues: Partial<InitSkuStepsFormDataType>, dataSource: readonly SkuDataSourceType[]) => void;
    handleProfitRateOnChange: (newProfitRate: number | null) => void;
    profitRate: number | undefined;
}

const defaultStepsData: Omit<InitSkuStepsFormDataType, "dataSource"> = {
    amzAccts: ["RS"],
    shippingTemplate: "USPrime",
    profitRate: 7,
    addon: []
}

const ramOptions: RAM[] = [RAM.DDR4_4, RAM.DDR4_8, RAM.DDR4_16, RAM.DDR4_32];
const ssdOptions: SSD[] = [SSD.PCIE_2048, SSD.PCIE_1024, SSD.PCIE_512, SSD.PCIE_256, SSD.PCIE_128]

const SkuConfigInputStepForm: React.FC<IProps> = (props) => {

    const {
        dataSource,
        setDataSource,
        initEditableConfigOnFinish,
        handleProfitRateOnChange,
        profitRate,
    } = props;

    const dispatch: AppDispatch = useDispatch();
    const [acceptedFile, setAcceptedFile] = useState<string>('.txt');

    // generate sku and seller allowed prices, and update redux state store
    const processComposedItems = useCallback((stepsFormData: Omit<InitSkuStepsFormDataType, "dataSource">, dataSource: readonly SkuDataSourceType[]) => {
        const controller = new AbortController();
        dispatch(calcVerifiedSkuPrimeCost(controller.signal, { ...stepsFormData, dataSource: dataSource }))

        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // download sample prime cost template xlxs
    const handlePrimeCostTemplateDownload = useCallback(() => {
        console.log('[User Action] downloaded PrimeCostTemplate Xlsx.');
        dispatch(downloadProductPrimeCostTemplate());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePrimeCostUpload = (options: FileUploadRequestOption): ThunkAction<void, RootState, any, AnyAction> => {
        return async (dispatch: AppDispatch) => {
            dispatch(uploadProductsPrimeCost(options));
        }
    }
    //Accessories key, type Map, e.g <4GB_0, 4GB>
    const ramValueEnum = createAccessoriesEnumObj(ramOptions);
    const ssdValueEnum = createAccessoriesEnumObj(ssdOptions);

    return (
        <StepForm
            name="collectInfo"
            title="Collect Info"
            isKeyPressSubmit={true}
            grid={true}
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
                    }} />
                <SpreadSheetComponent />
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
                <Row>
                    <Col span={18}>
                        <ProFormSlider
                            fieldProps={{ value: profitRate }}
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
                    </Col>
                    <Col span={4}>
                        <InputNumber
                            style={{ margin: '0 16px' }}
                            value={profitRate}
                            formatter={(value) => `${value}%`}
                            onChange={(value) => handleProfitRateOnChange(value)}
                        />
                    </Col>
                </Row>

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
                title={
                    <ProFormGroup >
                        <Typography.Title level={4} style={{ margin: "auto 12px auto 12px " }}>Prime Cost Upload</Typography.Title>
                        <ProFormRadio.Group
                            radioType="button"
                            layout='vertical'
                            fieldProps={{
                                value: acceptedFile,
                                onChange: (e) => setAcceptedFile(e.target.value)
                            }}
                            colProps={{
                                span: 200,
                            }}
                            options={['.txt']}
                        />
                    </ProFormGroup>
                }
                tooltip="upload any missing prime cost product items in selected file extension..."
                collapsible={false}
                extra={<TemplateDownloader
                    handleTemplateDownload={handlePrimeCostTemplateDownload} />}
            >
                <FileUploader customizedUpload={handlePrimeCostUpload} />
            </MyProCard>

        </StepForm>
    );
}

export default SkuConfigInputStepForm;