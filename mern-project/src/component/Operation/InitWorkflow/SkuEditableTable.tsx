import {
    ProColumns,
    EditableProTable,
    ProCard,
    ProFormField,
    EditableFormInstance,
    ProConfigProvider
} from '@ant-design/pro-components';
import { Rule } from 'antd/es/form';
import React, { useRef, useState } from 'react';
import { DataSourceType, HDD, HddEnum, OS, OsEnum, RAM, SSD } from './types';
import { createAccessoriesEnumObj } from './utilities';

interface IProps {
    dataSource: readonly DataSourceType[];
    setDataSource: React.Dispatch<React.SetStateAction<readonly DataSourceType[]>>
}

const SkuEditableTable: React.FC<IProps> = (props) => {
    const { dataSource, setDataSource } = props;
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const editableFormRef = useRef<EditableFormInstance>();

    const defaultData: DataSourceType[] = [
        {
            id: 624748504,
            upc: "123",
            asin: "BAA",
            ram: ["8GB_0", "8GB_1"],
            ssd: [SSD.PCIE_1024],
            hdd: "None",
            os: OS.W11H
        },

    ];

    const ramValueEnum = createAccessoriesEnumObj([RAM.DDR4_4, RAM.DDR4_8, RAM.DDR4_16, RAM.DDR4_32]);
    const ssdValueEnum = createAccessoriesEnumObj([SSD.PCIE_2048, SSD.PCIE_1024, SSD.PCIE_512, SSD.PCIE_256, SSD.PCIE_128]);

    const hddValueEnum: HddEnum = {
        "1TB": HDD.HDD_1TB,
        "2TB": HDD.HDD_2TB,
        "3TB": HDD.HDD_3TB,
        "None": "None"
    }
    const osValueEnum: OsEnum = {
        "W11H": OS.W11H,
        "W11P": OS.W11P,
        "W10H": OS.W10H,
        "W10P": OS.W10P,
        "None": "None"
    }

    const noSpaceRules: Rule[] = [
        { required: true, message: 'Required' },
        { pattern: new RegExp(/^[a-zA-Z0-9]*$/), message: "No Space or Special Characters Allowed" }
    ]

    const columns: ProColumns<DataSourceType>[] = [
        {
            title: 'UPC',
            dataIndex: 'upc',
            formItemProps: (_) => ({ rules: noSpaceRules }),
            width: '15%'
        },
        {
            title: 'Asin',
            dataIndex: 'asin',
            // readonly: true,
            width: '15%',
            formItemProps: (_) => ({ rules: noSpaceRules }),
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
            valueEnum: ramValueEnum,
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
            valueEnum: ssdValueEnum
        },
        {
            title: 'HDD',
            key: 'hdd',
            tooltip: "Unit TB",
            dataIndex: 'hdd',
            valueType: "select",
            valueEnum: hddValueEnum,
        },
        {
            title: 'OS',
            key: 'os',
            tooltip: "Operating System",
            dataIndex: 'os',
            valueType: "select",
            valueEnum: osValueEnum,
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
                editableFormRef={editableFormRef}
                // maxLength={5}
                // controlled
                scroll={{
                    x: true,
                }}
                formItemProps={{
                    rules: [
                        {
                            validator: async (_, value) => {
                                if (value.length < 1) {
                                    throw new Error('请至少添加一行记录');
                                }

                                // if (value.length > 5) {
                                //     throw new Error('最多可以设置五个题库');
                                // }
                            },
                        }
                    ]
                }}
                columnsState={{ persistenceType: "localStorage" }}
                recordCreatorProps={{
                    newRecordType: "dataSource",
                    position: "bottom",
                    record: {
                        id: (Math.random() * 1000000).toFixed(0),
                        hdd: "None",
                        os: OS.W11H
                    },
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
                <ProConfigProvider dark={true}>
                    <ProFormField
                        style={{ "backgroundColor": "black" }}
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
                </ProConfigProvider>
            </ProCard>
        </>
    )
}

export default SkuEditableTable;