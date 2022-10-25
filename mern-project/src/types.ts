export interface MenuOption {
    key: string,
    title: string,
    description: string,
    cover: React.ReactNode
}

export enum StepStatus {
    error = 'error',
    process = 'process',
    finish = 'finish',
    wait = 'wait'
}