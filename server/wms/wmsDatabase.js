import tunnel from 'tunnel-ssh';
import mongodb from 'mongodb';
import { sshConfig, wmsCollections } from '#root/config.js';

const { MongoClient } = mongodb;
//when modules/instance being required in nodejs, it will only load once.
let db;

const connect = (callback) => {
    const config = sshConfig;
    tunnel(config, (error, server) => {
        if (error) {
            console.log("SSH connection error: " + error);
        }
        // let client = new MongoClient('mongodb://127.0.0.1:27017/wms', { useUnifiedTopology: true });
        MongoClient.connect(
            `mongodb://127.0.0.1:${config.localPort}/wms`,
            { useUnifiedTopology: true }
        ).then(client => {
            db = client.db('wms');
            callback();
        }).catch(err => {
            console.error(`WMS Connection failed: ${err}`)
        });

    });
}

const getDatabase = () => {
    return db;
}

const close = () => {
    db.close();
    console.log(`wms connection closed...`);
}

const getCollections = () => {
    return wmsCollections;
}

const wms = {
    connect,
    close,
    getDatabase,
    getCollections,
    config: sshConfig
}
export default wms;