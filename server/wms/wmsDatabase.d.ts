import * as mongoDB from 'mongodb';
import {
    sshConfig,
    wmsCollections,
} from 'config';

export declare const wms: {
    connect: (callback: (any) => any) => void,
    close: () => void,
    getDatabase: () => mongoDB.Db,
    getCollections: () => wmsCollections,
    config: sshConfig
}