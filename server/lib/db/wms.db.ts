import tunnel from 'tunnel-ssh';
import * as mongodb from 'mongodb';
import { Server } from 'net';
import dotenv from 'dotenv';
dotenv.config();
//when modules/instance being required in nodejs, it will only load once.

class Wms {
    private _client: mongodb.MongoClient;
    private _tunnelServer: Server | null = null;
    constructor() {
        this._client = new mongodb.MongoClient(
            `mongodb://127.0.0.1:${process.env.WMS_LOCAL_PORT}/`,
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

    async connect(): Promise<mongodb.Db | void> {
        const sshConfig = {
            username: process.env.WMS_USERNAME,
            password: process.env.WMS_PASSWORD,
            host: process.env.WMS_HOST,
            port: process.env.SSH_PORT,
            dstPort: process.env.WMS_DST_PORT,
            // privateKey: require('fs').readFileSync('/path/to/key'),
            localPort: process.env.PORT || process.env.WMS_LOCAL_PORT,
            keepAlive: true
        }
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