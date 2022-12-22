import React, { useState } from 'react';
import { StepComponentProps } from "./types";
import {
    ProCard,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    StepsForm,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { waitTime } from './utilities';

const sourceTextForm = [
    {
        name: 'cpu',
        width: 'lg',
        label: 'cpu',
    }, {
        name: 'screen',
        width: 'lg',
        label: 'screen',
    }, {
        name: 'gpu',
        width: 'lg',
        label: 'gpu',
    },
]

const ProdKeySpecInput: React.FC<StepComponentProps> = (props: StepComponentProps) => {
    const { nextCatag } = props;
    return (

        <StepsForm
            stepsRender={(_) => <></>}
            formProps={{
                validateMessages: {
                    required: 'Info is required',
                },
            }}
        >
            <StepsForm.StepForm
                name="keySpecs"
                title="Key Specs"
                onFinish={async (values) => {
                    /*
                    save form values to db
                    ....
                    */
                    console.log(`set Key Spec values:\n`, values)
                    await waitTime(2000);
                    message.success('KeySpec Processed Success');
                    return true;
                }}
            >
                <ProCard
                    title="Key Specification"
                    style={{
                        minWidth: 800,
                        marginBlockEnd: 16,
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

                    {
                        sourceTextForm.map(textForm => {
                            return (
                                <ProFormText
                                    name={textForm.name}
                                    width={textForm.width as 'lg'}
                                    label={textForm.label}
                                />
                            )
                        })
                    }
                </ProCard>
            </StepsForm.StepForm>
            <StepsForm.StepForm
                name="done"
                title="Done"
                onFinish={async () => {
                    message.success('Submit Key Spec Success');
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
}

export default ProdKeySpecInput;