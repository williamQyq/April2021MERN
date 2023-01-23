
export type DataSourceType = {
    id: React.Key;
    upc?: string;
    asin?: string;
    decs?: string;
    ram?: string[];
    ssd?: string[];
    hdd?: HDD | "None";
    os?: OS;
    ramOnboard?: string;
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
    HDD_2TB = "2TB",
    HDD_3TB = "3TB"
}
export enum OS {
    W10H = "W10H",
    W11H = "W11H",
    W10P = "W10P",
    W11P = "W11P"
}
export type Accessories = RAM | SSD | HDD;
type AccessoriesOptionEnum = Record<string, RAM | SSD | HDD | OS | "None">;

export interface RamEnum extends AccessoriesOptionEnum { };
export interface SsdEnum extends AccessoriesOptionEnum { };
export interface HddEnum extends AccessoriesOptionEnum { };
export interface OsEnum extends AccessoriesOptionEnum { };

export interface StepComponentProps {
    nextCatag?: () => void;
    prevCatag?: () => void;
}

export type ShippingTemplate = "USPrime" | "Regular";