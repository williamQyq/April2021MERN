import tunnel from 'tunnel-ssh';
import mongodb from 'mongodb';
import {WMS_CONFIG} from '#root/config.js';

const { MongoClient } = mongodb;
//when modules/instance being required in nodejs, it will only load once.
let db;

const connect = (config, callback) => {
    tunnel(config, (error, server) => {
        if (error) {
            console.log("SSH connection error: " + error);
        }
        // let client = new MongoClient('mongodb://127.0.0.1:27017/wms', { useUnifiedTopology: true });
        MongoClient.connect(`mongodb://127.0.0.1:${config.localPort}/wms`, { useUnifiedTopology: true }).then(client => {
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

const startService = () => {
   
    connect(WMS_CONFIG, () => {
        console.log(`WMS Database Connected...`);
    });
}

const wms = {
    startService,
    close,
    getDatabase
}
export default wms;