import React from 'react';
import { StepComponentProps } from "@src/component/utils/cmpt.interface";
import {
    ProCard,
    ProFormText,
    StepsForm,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { waitTime } from './utilities';

const sourceTextForm = [
    {
        name: 'upc',
        width: 'lg',
        label: 'UPC',
        required: [{ required: true }]
    },
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
                    bordered
                    headerBordered
                    style={{
                        minWidth: 800,
                        marginBlockEnd: 16,
                        maxWidth: '100%',
                    }}
                >
                    {
                        sourceTextForm.map(textForm => {
                            return (
                                <ProFormText
                                    key={textForm.name}
                                    name={textForm.name}
                                    width={textForm.width as 'lg'}
                                    label={textForm.label}
                                    placeholder={`Enter ${textForm.name}`}
                                    rules={textForm.required ? textForm.required : undefined}
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