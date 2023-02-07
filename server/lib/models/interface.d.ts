export interface BBItem extends Document {
    link: URL;
    sku: string;
    name: string;
    price_timestamps: Array<{ price: number, date: Date }>;
    created_date: Date;
}

export interface IPrimeCostDoc extends Document {
    _id: {
        upc: string;
    };
    name: string;
    price: number;
    category: string;
    // price_timestamps: Array<{ price: number, date: Date }>;
    created_date: Date;
}

interface ParserRecord extends Record<string, string | number> { };
