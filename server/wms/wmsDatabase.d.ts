import * as mongoDB from 'mongodb';
import {
    sshConfig,
    wmsCollections,
} from 'config';

declare const wms: {
    connect: (callback: (any) => any) => void,
    close: () => void,
    getDatabase: () => mongoDB.Db,
    getCollections: () => wmsCollections,
    config: sshConfig
}

export default wms;