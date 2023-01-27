import { UploadProps } from 'antd';
import { UploadRequestOption } from 'rc-upload/lib/interface';

export interface MenuOption {
    key: string,
    title: string,
    description: string,
    cover: React.ReactNode
}

/**
 * @usage: Operation/InitWorkFlow/InitSkuAsinMapping
 * 
 */
export interface StepsFormDataType {
    dataSource: readonly DataSourceType[];
    amzAccts: string[];
    shippingTemplate: ShippingTemplate;
    profitRate: number;
    addon: any[];
}

export interface StepComponentProps {
    nextCatag?: () => void;
    prevCatag?: () => void;
}

export interface IMyStep {
    name: string,
    title: string,
    icon: React.ReactNode
}
export interface IMyStepsProps {
    current: number,
    steps: IMyStep[]
}

export type ShippingTemplate = "USPrime" | "Regular";

type SSD = string;
type RAM = "4GB" | "8GB" | "16GB" | "32GB";
type HDD = "1TB" | "2TB" | "3TB";
type OS = "W10H" | "W10P" | "W11H" | "W11P";
export type Accessories = HDD | OS | SSD | RAM;

export type AccessoriesOptionEnum = Record<string, Accessories | "None">;

export interface RamEnum extends AccessoriesOptionEnum { };
export interface SsdEnum extends AccessoriesOptionEnum { };
export interface HddEnum extends AccessoriesOptionEnum { };
export interface OsEnum extends AccessoriesOptionEnum { };

export type InitSkuDataSourceType = {
    id: React.Key;
    upc?: string;
    asin?: string;
    decs?: string;
    ram?: string[];
    ssd?: string[];
    hdd?: HDD | "None";
    os?: OS;
    ramOnboard?: string;
    children?: InitSkuDataSourceType[];
};

/**
 * @usage: FileUploader
 * 
 */
export interface FileUploadRequestOption extends Omit<UploadRequestOption, "action" | "method"> { };
export interface FileUploadProps extends UploadProps { };
