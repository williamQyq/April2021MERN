
import { FormInstance, Button } from "antd";
import React, { ReactNode } from "react";
import { Accessories } from "./types";

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

// create duplicate valueEnum select options for ProColumn 
export function createAccessoriesEnumObj<T = Accessories>(accsOptions: T[]): Record<string, T | "None"> {
    let valueEnum: Record<string, T | "None"> = {};
    accsOptions.forEach(value => {
        valueEnum[`${value}_0`] = value;
        valueEnum[`${value}_1`] = value;
    })
    valueEnum["None"] = "None";
    return valueEnum;
}