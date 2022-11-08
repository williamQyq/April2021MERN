import tunnel from 'tunnel-ssh';
import { Db, MongoClient } from 'mongodb';
import { sshConfig } from '#root/config.js';

//when modules/instance being required in nodejs, it will only load once.


class Wms {
    private _client: MongoClient;

    constructor() {
        this._client = new MongoClient(
            `mongodb://127.0.0.1:${sshConfig.localPort}/wms`,
            {
                // useUnifiedTopology: true,
                socketTimeoutMS: 360000,
                connectTimeoutMS: 360000,
                keepAlive: true
            }
        );
    }
    async connect(): Promise<Db> {
        return new Promise((resolve, _path) => {
            tunnel(sshConfig, async (error, server) => {
                if (error) {
                    console.log("SSH connection error: " + error);
                }
                server.on("error", () => {
                    // console.log('**tunnel ssh err**\n\n', error);
                    // server.close();
                });
                // server.on('connection', console.log.bind(console, "**tunnel ssh server connected**:\n"));
                await this._client.connect();
                const db = this._client.db('wms');
                resolve(db);    //db connection built.

                this._client.on('error', console.error.bind(console, "***mongodb error***"))
                this._client.on('error', (err) => {
                    console.error(`******mongodb client connection closed**********`)
                    this._client.close();
                })
            })
        })
    }

    disconnect() {
        this._client.close();
        console.log(`wms connection closed...`);
    }
}

const wms = new Wms();

// @CREATE WMS CONNECTION
const db = await wms.connect().then((db) => {
    console.log(`WMS Database Connected...`);
    return db;
});


export default db;