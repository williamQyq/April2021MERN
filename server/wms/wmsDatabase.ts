import tunnel from 'tunnel-ssh';
import { Db, MongoClient } from 'mongodb';
import { sshConfig } from '#root/config.js';
import { Server } from 'net';

//when modules/instance being required in nodejs, it will only load once.

class Wms {
    private _client: MongoClient;
    private _tunnelServer: Server | null = null;
    constructor() {
        this._client = new MongoClient(
            `mongodb://127.0.0.1:${sshConfig.localPort}/`,
            {
                socketTimeoutMS: 10000,
                connectTimeoutMS: 8000,
                keepAlive: true
            }
        );

        this._client.on('error', console.error.bind(console, "***mongodb error***"))
        this._client.on('error', (err) => {
            console.error(`******wms client connection closed**********`)
            this._client.close();
        })

        if (this._tunnelServer) {
            this._tunnelServer.on('connection', console.log.bind(console, "**tunnel ssh server connected**:\n"));

            this._tunnelServer.on("error", (err) => {
                console.log('**tunnel ssh err**\n\n', err);
                // this._tunnelServer?.close();
            })

        }

    }

    async connect(): Promise<Db | void> {
        return new Promise((resolve, reject) => {
            this._tunnelServer = tunnel(sshConfig, async (error, server) => {
                if (error) {
                    console.log("SSH connection error: \n\n", error);
                    reject(error);
                }

                //may expect read ECONNRESET ERROR 
                server.on('error', (_) => {
                    // console.error(`ERRR:`,err)
                })

                try {
                    await this._client.connect();
                    const db = this._client.db('wms');
                    resolve(db);    //db connection built.
                } catch (err) {
                    reject(err);
                }
            });
        })
    }

    disconnect() {
        this._client.close();
        console.log(`wms connection closed...`);
    }
}

const wms = new Wms();

// @CREATE WMS CONNECTION
const db = await wms.connect()
    .then(db => {
        console.log(`WMS Database Connected...`);
        return db;
    }).catch((err) => {
        console.error("\n***wms client not connected.***\n\n", err);
        return;
    })


export default db;