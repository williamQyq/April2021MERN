
import { FormInstance, Button } from "antd";
import React, { ReactNode } from "react";
import { Accessories } from "@src/component/utils/cmpt.interface";

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

    const handleDone = async () => {
        nextCatag?.();
    }
    //submit form, values catch by stepform onFinish
    const handleNext = async () => {
        await form?.validateFields()
            .then((_) => {
                form?.submit();
                next(curStep)
            })
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
                hasPrev && !isLastStep && <Button type="primary" onClick={handlePrev}>Prev</Button>
            }
            {
                isLastStep && <Button type="primary" onClick={handleDone}>Done</Button>
            }
        </>
    );
}

// Create duplicate valueEnum select options for ProColumn 
export function createAccessoriesEnumObj<T = Accessories>(accsOptions: T[]): Map<string, T | "None"> {
    let keyAccsMap = new Map<string, T | "None">();
    // let valueEnum: Record<string, T | "None"> = {};

    accsOptions.forEach(value => {
        keyAccsMap.set(`${value}_0`, value);
        keyAccsMap.set(`${value}_1`, value);
    })

    keyAccsMap.set("None", "None");

    return keyAccsMap;
}