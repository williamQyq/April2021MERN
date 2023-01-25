import {
    ProCard,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    StepsForm,
} from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useState } from 'react';
import FileUpload from 'component/utility/FileUpload';
import { waitTime } from './utilities';
import { StepComponentProps } from 'component/utility/cmpt.interface.d';
import { HDD, OS, RAM, SSD } from 'component/utility/types.enum';

const defaultData = {
    upc: "987654",
    ram: [RAM.DDR4_4, RAM.DDR4_8],
    ramOnboard: "None",
    ssd: [SSD.PCIE_128],
    hdd: [HDD.HDD_1TB],
    os: [OS.W10H]
}

const ProdDetachSpecInput: React.FC<StepComponentProps> = (props: StepComponentProps) => {
    const { nextCatag } = props;
    const ramOptions: RAM[] = [RAM.DDR4_4, RAM.DDR4_8, RAM.DDR4_16, RAM.DDR4_32];
    const ssdOptions: SSD[] = [SSD.PCIE_128, SSD.PCIE_256];
    const hddOptions: HDD[] = [HDD.HDD_1TB, HDD.HDD_2TB];
    const osOptions: OS[] = [OS.W10H, OS.W10P];
    const [sourceData, setSourceData] = useState<Record<string, any>>(defaultData);

    const handlePictureUpload = () => {

    }

    return (
        <StepsForm
            //cutomize next prev
            formProps={{
                validateMessages: {
                    required: 'Info is required',
                },
            }}
            stepsRender={(_) => <></>}
        >
            <StepsForm.StepForm
                name="detachableSpecs"
                title="Detachable Specs"
                request={async () => {
                    return sourceData;
                }}
                isKeyPressSubmit={true}
                onFinish={async (values) => {

                    console.log(`set Data Source detach values:\n`, values)
                    setSourceData(values);
                    await waitTime(2000);
                    message.success('Process Success');
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
                        width="lg"
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
                        rules={[{ required: true }]}
                        options={ramOptions.map((ram) => ({
                            label: ram,
                            value: ram,
                        }))}
                    />
                    <ProFormRadio.Group
                        name="ramOnboard"
                        label="RAM Onboard"
                        width="lg"
                        options={['None', '4GB', '8GB', '16GB']}
                        rules={[{ required: true }]}
                    />
                    <ProFormSelect
                        name="ssd"
                        label="SSD"
                        fieldProps={{
                            mode: 'multiple',
                        }}
                        width="lg"
                        placeholder={"Pick SSD"}
                        rules={[{ required: true }]}
                        options={ssdOptions.map((option) => ({
                            label: option,
                            value: option
                        }))}
                    />
                    <ProFormSelect
                        name="hdd"
                        label="HDD"
                        fieldProps={{
                            mode: 'tags',
                        }}
                        width="lg"
                        placeholder={"Pick HDD"}
                        rules={[{ required: true }]}
                        options={hddOptions.map((option) => ({
                            label: option,
                            value: option
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
                        rules={[{ required: true }]}
                        options={osOptions.map((option) => ({
                            label: option,
                            value: option
                        }))}
                    />
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
                    <FileUpload customizedUpload={handlePictureUpload} />
                </ProCard>
            </StepsForm.StepForm>
            <StepsForm.StepForm
                name="done"
                title="Done"
                onFinish={async () => {
                    /*
                    save form values to db
                    ....
                    */
                    message.success('Submit Success');
                    nextCatag!();
                }}
            >
                <ProCard
                    style={{
                        marginBlockEnd: 16,
                        minWidth: 800,
                        maxWidth: '100%',
                    }}
                >
                </ProCard>
            </StepsForm.StepForm>
        </StepsForm>
    );
};

export default ProdDetachSpecInput;