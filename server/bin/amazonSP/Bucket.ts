import SellingPartner from "amazon-sp-api";
import config from "config";

export interface RateLimit {
    ratePerSec?: number;
    asinsLimit?: number;
    type?: string;
}

export abstract class Task<T>{
    abstract hasRateLimit(): boolean;
    abstract getRateLimit(): RateLimit;
    abstract execute(): Promise<T>;
    abstract delayOnlimitReached(index: number, timeCost: number): Promise<T>;
}

export class LeakyBucket<T> {
    private tasks: Task<T>[];
    constructor() {
        this.tasks = [];
    }

    addTask(task: Task<T>): void {
        this.tasks.push(task);
    }

    async processTasks(): Promise<Awaited<T>[]> {
        const taskPromises: Promise<T>[] = this.tasks.map(
            async (task: Task<T>, index: number) => {
                const start = performance.now();
                const result = await task.execute();
                const timeCost = performance.now() - start;
                await task.delayOnlimitReached(index, timeCost)
                return result;
            }
        );
        const results = await Promise.all(taskPromises);
        this.tasks = [];

        return results;
    }
}

type Region = "eu" | "na" | "fe";
export const sellingPartner: SellingPartner = new SellingPartner({
    region: config.get("aws.region") as Region,
    credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.AMZ_SELLING_PARTNER_APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.AMZ_SELLING_PARTNER_APP_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE: process.env.AWS_SELLING_PARTNER_ROLE
    },
    refresh_token: process.env.AMZ_REFRESH_TOKEN
});
