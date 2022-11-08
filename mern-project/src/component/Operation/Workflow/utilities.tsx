import {
    ProColumns,
    EditableProTable,
    ProCard,
    ProFormField,
    ProFormRadio
} from '@ant-design/pro-components';
import { FormInstance, Button } from "antd";
import React, { useState } from "react";
import { ReactNode } from "react";
import { DataSourceType, HDD, HddEnum, OS, OsEnum, RAM, RamEnum, SSD, SsdEnum } from './types';

export const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

interface SubmitterProps {
    form?: FormInstance<any>,
    stepsCount: number,
    curStep: number,
    next: (step: number) => void,
    prev: () => void,
    nextCatag?: () => void
}

export const Submitter = (props: SubmitterProps): ReactNode => {
    const { form, curStep, stepsCount, next, prev, nextCatag } = props;

    const handleSubmit = async () => {
        form?.submit();
        await waitTime(2000);
        nextCatag?.();
    }
    const handleNext = async () => {
        form?.validateFields()
            .then(() => next(curStep))
    }
    const handlePrev = () => {
        prev();
    }

    const hasNext = curStep < stepsCount ? true : false;
    const hasPrev = curStep > 0 ? true : false;
    const isLastStep = curStep === stepsCount - 1 ? true : false;
    return (
        <>
            {
                hasNext && !isLastStep && <Button type="primary" onClick={handleNext}>Next </Button>
            }
            {
                hasPrev && <Button type="primary" onClick={handlePrev}>Prev</Button>
            }
            {
                isLastStep && <Button type="primary" onClick={handleSubmit}>Done</Button>
            }
        </>
    );
}

export const EditableSkuCreatTable: React.FC = () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);

    const defaultData: DataSourceType[] = [
        {
            id: 624748504,
            upc: "123",
            asin: "BAA",
            ram: ["16_st"]
        },
        {
            id: 624748503,
            upc: "123",
            asin: "BAA",
            ram: ["16_st"]
        },
        {
            id: 624748502,
            upc: "123",
            asin: "BAA",
            ram: ["16_st"]
        },
        {
            id: 624748501,
            upc: "123",
            asin: "BAA",
            ram: ["16_st"]
        }
    ];
    const ramEnum: RamEnum = {
        "4_st": {
            text: RAM.DDR4_4,
            status: 'Success'
        },
        "4_nd": {
            text: RAM.DDR4_4,
            status: 'Success'
        },
        "8_st": {
            text: RAM.DDR4_8,
            status: 'Success',
        },
        "8_nd": {
            text: RAM.DDR4_8,
            status: 'Success',
        },
        "16_st": {
            text: RAM.DDR4_16,
            status: 'Success',
        },
        "16_nd": {
            text: RAM.DDR4_16,
            status: 'Success',
        },
        "32_st": {
            text: RAM.DDR4_32,
            status: 'Success'
        },
        "32_nd": {
            text: RAM.DDR4_32,
            status: 'Success'
        }
    }

    const ssdEnum: SsdEnum = {
        "128": {
            text: SSD.PCIE_128,
            status: "Success"
        },
        "256": {
            text: SSD.PCIE_256,
            status: "Success"
        },
        "512": {
            text: SSD.PCIE_512,
            status: "Success"
        },
        "1024": {
            text: SSD.PCIE_1024,
            status: "Success"
        },
        "2048": {
            text: SSD.PCIE_2048,
            status: "Success"
        }
    }
    const hddEnum: HddEnum = {
        "1": {
            text: HDD.HDD_1TB,
            status: "Success"
        },
        "2": {
            text: HDD.HDD_2TB,
            status: "Success"
        }
    }
    const osEnum: OsEnum = {
        W10H: {
            text: OS.W10H,
            status: "Success"
        },
        W10P: {
            text: OS.W10P,
            status: "Success"
        },
        W11H: {
            text: OS.W11H,
            status: "Success"
        },
        W11P: {
            text: OS.W11P,
            status: "Success"
        },

    }

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: 'UPC',
            dataIndex: 'upc',
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules: [{ required: true, message: 'Required' }]
                };
            },
            width: '15%',
        },
        {
            title: 'Asin',
            dataIndex: 'asin',
            // readonly: true,
            width: '15%',
        },
        {
            title: 'RAM',
            key: 'ram',
            tooltip: "Unit GB",
            dataIndex: 'ram',
            valueType: "select",
            fieldProps: {
                mode: "multiple"
            },
            valueEnum: ramEnum,
        },
        {
            title: "SSD",
            key: 'ssd',
            tooltip: "Unit GB",
            dataIndex: "ssd",
            valueType: "select",
            fieldProps: {
                mode: "multiple"
            },
            valueEnum: ssdEnum
        },
        {
            title: 'HDD',
            key: 'hdd',
            tooltip: "Unit TB",
            dataIndex: 'hdd',
            valueType: "select",
            valueEnum: hddEnum,
        },
        {
            title: 'OS',
            key: 'os',
            tooltip: "Operating System",
            dataIndex: 'os',
            valueType: "select",
            valueEnum: osEnum,
        },
        {
            title: 'Action',
            valueType: 'option',
            width: 200,
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.id);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item.id !== record.id));
                    }}
                >
                    删除
                </a>,
                <EditableProTable.RecordCreator
                    key="copy"
                    record={{
                        ...record,
                        id: (Math.random() * 1000000).toFixed(0),
                    }}
                >
                    <a>复制</a>
                </EditableProTable.RecordCreator>,
            ],
        },
    ];

    return (
        <>
            <EditableProTable<DataSourceType>
                rowKey="id"
                maxLength={5}
                // scroll={{
                //     x: 960,
                // }}
                columnsState={{ persistenceType: "localStorage" }}
                recordCreatorProps={{
                    position: "bottom",
                    record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                }}
                loading={false}
                columns={columns}
                request={async () => ({
                    data: defaultData,
                    total: 3,
                    success: true,
                })}
                value={dataSource}
                onChange={setDataSource}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: async (rowKey, data, row) => {
                        // await waitTime(500);
                    },
                    onChange: setEditableRowKeys,
                }}
            />
            <ProCard title="table data" headerBordered collapsible defaultCollapsed>
                <ProFormField
                    ignoreFormItem
                    fieldProps={{
                        style: {
                            width: '100%',
                        },
                    }}
                    mode="read"
                    valueType="jsonCode"
                    text={JSON.stringify(dataSource)}
                />
            </ProCard>
        </>
    )
}