
export type DataSourceType = {
    id: React.Key;
    upc?: string;
    asin?: string;
    decs?: string;
    ram?: string[];
    children?: DataSourceType[];
};
export interface IMyStep {
    name: string,
    title: string,
    icon: React.ReactNode
}
export interface IMyStepsProps {
    current: number,
    steps: IMyStep[]
}

export enum RAM {
    DDR4_4 = "4GB",
    DDR4_8 = "8GB",
    DDR4_16 = "16GB",
    DDR4_32 = "32GB"
}
export enum SSD {
    PCIE_128 = "PCIE_128",
    PCIE_256 = "PCIE_256",
    PCIE_512 = "PCIE_512",
    PCIE_1024 = "PCIE_1024",
    PCIE_2048 = "PCIE_2048"
}
export enum HDD {
    HDD_1TB = "1TB",
    HDD_2TB = "2TB"
}
export enum OS {
    W10H = "W10H",
    W11H = "W11H",
    W10P = "W10P",
    W11P = "W11P"
}

interface OptionEnum {
    [key: string]: RAM | SSD | HDD | OS
}

export interface RamEnum extends OptionEnum { }
export interface SsdEnum extends OptionEnum { }
export interface HddEnum extends OptionEnum { }
export interface OsEnum extends OptionEnum { }

export interface StepComponentProps {
    nextCatag?: () => void;
    prevCatag?: () => void;
}