import {
    ProColumns,
    EditableProTable,
    ProCard,
    ProFormField,
    EditableFormInstance
} from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { DataSourceType, HDD, HddEnum, OS, OsEnum, RAM, RamEnum, SSD, SsdEnum } from './types';

const CreateSkuEditableTable: React.FC = () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
    const editableFormRef = useRef<EditableFormInstance>();

    const defaultData: DataSourceType[] = [
        {
            id: 624748504,
            upc: "123",
            asin: "BAA",
            ram: ["4_st"]
        },

    ];
    const ramEnum: RamEnum = {
        "4_st": RAM.DDR4_4,
        "4_nd": RAM.DDR4_4,
        "4_rd": RAM.DDR4_4,
        "4_th": RAM.DDR4_4,
        "4_5": RAM.DDR4_4
    }
    const ssdEnum: SsdEnum = {
        "128": SSD.PCIE_128
    }
    const hddEnum: HddEnum = {
        "1": HDD.HDD_1TB
    }
    const osEnum: OsEnum = {
        "w10H": OS.W10H
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
                editableFormRef={editableFormRef}
                maxLength={5}
                // controlled
                scroll={{
                    x: true,
                }}
                formItemProps={{
                    rules: [
                        {
                            validator: async (_, value) => {
                                if (value.length < 1) {
                                    throw new Error('请至少添加一个题库');
                                }

                                if (value.length > 5) {
                                    throw new Error('最多可以设置五个题库');
                                }
                            },
                        }
                    ]
                }}
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

export default CreateSkuEditableTable;