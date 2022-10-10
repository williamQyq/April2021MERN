import tunnel from 'tunnel-ssh';
import mongodb from 'mongodb';
import { sshConfig } from '#root/config.js';

const { MongoClient } = mongodb;
//when modules/instance being required in nodejs, it will only load once.

const connect = new Promise((resolve, _) => {
    tunnel(sshConfig, async (error, server) => {
        if (error) {
            console.log("SSH connection error: " + error);
        }
        server.on("error", () => {
            // console.log('**tunnel ssh err**\n\n', error);
            // server.close();
        });
        // server.on('connection', console.log.bind(console, "**tunnel ssh server connected**:\n"));

        const client = new MongoClient(
            `mongodb://127.0.0.1:${sshConfig.localPort}/wms`,
            {
                useUnifiedTopology: true,
                socketTimeoutMS: 360000,
                connectTimeoutMS: 360000,
                keepAlive: true
            }
        );
        await client.connect();
        const db = client.db('wms');
        resolve({ db });    //db connection built.

        client.on('error', console.error.bind(console, "***mongodb error***"))
        client.on('error', (err) => {
            console.error(`******mongodb client connection closed**********`)
            client.close();
        })
    })
});

const { db } = await connect;

const getDatabase = () => {
    return db;
}

const close = () => {
    db.close();
    console.log(`wms connection closed...`);
}


const wms = {
    db,
    connect,    //promise get new mongodb client db wms
    close,
    getDatabase,
    // getCollections,
}
export default wms;