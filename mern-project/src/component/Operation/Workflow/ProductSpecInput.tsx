import {
    ProCard,
    ProForm,
    ProFormCheckbox,
    ProFormDatePicker,
    ProFormDateRangePicker,
    ProFormDigit,
    ProFormSelect,
    ProFormText,
    StepsForm,
} from '@ant-design/pro-components';
import { Button, message, Steps } from 'antd';
import React from 'react';

import { IoHardwareChipOutline } from 'react-icons/io5';

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const ProductSpecInput: React.FC = () => {
    const ramOptions: string[] = ["Empty", "DDR4-4L", "DDR4-8L", "DDR4-16L", "DDR5-8L", "DDR5-16L"]
    const ssdOptions: string[] = ["Empty", "PCIE-512", "PCIE-1024"]
    const osOptions: string[] = ["Windows 10 Home", "Windows 10 Pro", "Windows 11 Home", "Windows 11 Pro"]

    return (
        <>
            <StepsForm
                stepsRender={(steps, dom) => {
                    return (
                        <Steps>{
                            steps.map(step => <Steps.Step {...step} icon={<IoHardwareChipOutline />} />)
                        }
                        </Steps>
                    )
                }}
                onFinish={async (values) => {
                    console.log(values);
                    await waitTime(1000);
                    message.success('Submit Success');
                }}
                formProps={{
                    validateMessages: {
                        required: 'Info is required',
                    },
                }}
            >
                <StepsForm.StepForm
                    name="detachable specs"
                    title="Detachable Specs"

                    onFinish={async () => {
                        await waitTime(2000);
                        return true;
                    }}
                >
                    <ProCard
                        title="Detachable Hardware"
                        bordered
                        headerBordered
                        // collapsible
                        style={{
                            marginBlockEnd: 16,
                            minWidth: 800,
                            maxWidth: '100%',
                        }}
                    >
                        <ProFormText
                            name="upc"
                            width="md"
                            label="UPC"
                            tooltip="Product UPC"
                            placeholder="Enter product upc"
                            rules={[{ required: true }]}
                        />
                        <ProFormSelect
                            name="ram"
                            label="RAM Specs"
                            fieldProps={{
                                mode: 'tags',
                            }}
                            width="lg"
                            placeholder={"Pick RAM"}
                            // initialValue={['smart boss', 'sofa potatoes']}
                            options={ramOptions.map((ram) => ({
                                label: ram,
                                value: ram,
                            }))}
                        />
                        <ProFormSelect
                            name="ssd"
                            label="SSD"
                            fieldProps={{
                                mode: 'tags',
                            }}
                            width="lg"
                            placeholder={"Pick SSD"}
                            // initialValue={['smart boss', 'sofa potatoes']}
                            options={ssdOptions.map((ssd) => ({
                                label: ssd,
                                value: ssd
                            }))}
                        />
                        <ProFormSelect
                            name="os"
                            label="Operating System"
                            fieldProps={{
                                mode: 'tags',
                            }}
                            width="lg"
                            placeholder={"Pick Operating System"}
                            // initialValue={['smart boss', 'sofa potatoes']}
                            options={osOptions.map((option) => ({
                                label: option,
                                value: option
                            }))}
                        />

                        {/* <ProForm.Group title="节点" size={8}>
                            <ProFormSelect width="sm" name="source" placeholder="选择来源节点" />
                            <ProFormSelect width="sm" name="target" placeholder="选择目标节点" />
                        </ProForm.Group> */}
                    </ProCard>

                    <ProCard
                        title="Relative Pictures"
                        bordered
                        headerBordered
                        collapsible
                        style={{
                            minWidth: 800,
                            marginBlockEnd: 16,
                        }}
                    >
                        {/* <ProFormDigit
                            name="xs"
                            label="XS号表单"
                            initialValue={9999}
                            tooltip="悬浮出现的气泡。"
                            placeholder="请输入名称"
                            width="xs"
                        /> */}
                        {/* <ProFormText name="s" label="S号表单" placeholder="请输入名称" width="sm" /> */}
                        {/* <ProFormDateRangePicker name="m" label="M 号表单" /> */}

                    </ProCard>
                </StepsForm.StepForm>
                <StepsForm.StepForm name="Key Specs" title="Key Specs">
                    <ProCard
                        style={{
                            minWidth: 800,
                            marginBlockEnd: 16,
                            maxWidth: '100%',
                        }}
                    >
                        <ProFormCheckbox.Group
                            name="checkbox"
                            label="迁移类型"
                            width="lg"
                            options={['结构迁移', '全量迁移', '增量迁移', '全量校验']}
                        />
                        <ProForm.Group>
                            <ProFormText name="dbname" label="业务 DB 用户名" />
                            <ProFormDatePicker name="datetime" label="记录保存时间" width="sm" />
                        </ProForm.Group>
                        <ProFormCheckbox.Group
                            name="checkbox"
                            label="迁移类型"
                            options={['完整 LOB', '不同步 LOB', '受限制 LOB']}
                        />
                    </ProCard>
                </StepsForm.StepForm>
                <StepsForm.StepForm name="generateSKU" title="Download created SKU">
                    <ProCard
                        style={{
                            marginBlockEnd: 16,
                            minWidth: 800,
                            maxWidth: '100%',
                        }}
                    >
                        <ProFormCheckbox.Group
                            name="checkbox"
                            label="部署单元"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            options={['部署单元1', '部署单元2', '部署单元3']}
                        />
                        <ProFormSelect
                            label="部署分组策略"
                            name="remark"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            width="md"
                            initialValue="1"
                            options={[
                                {
                                    value: '1',
                                    label: '策略一',
                                },
                                { value: '2', label: '策略二' },
                            ]}
                        />
                        <ProFormSelect
                            label="Pod 调度策略"
                            name="remark2"
                            width="md"
                            initialValue="2"
                            options={[
                                {
                                    value: '1',
                                    label: '策略一',
                                },
                                { value: '2', label: '策略二' },
                            ]}
                        />
                    </ProCard>
                </StepsForm.StepForm>
            </StepsForm>
        </>
    );
};

export default ProductSpecInput;