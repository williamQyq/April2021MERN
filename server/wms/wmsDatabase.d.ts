import { sshConfig, wmsCollections } from '#root/config';
import * as mongoDB from 'mongodb';


declare const wms: {
    db: mongoDB.Db, //client db created from server throttle
    connect: Promise<mongoDB.Db | undefined>,
    close: () => void,
    getDatabase: () => mongoDB.Db,
}

export default wms;