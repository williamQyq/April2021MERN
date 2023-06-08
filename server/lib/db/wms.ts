import tunnel from 'tunnel-ssh';
import { Server } from 'net';
import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';
dotenv.config();
//when modules/instance being required in nodejs, it will only load once.

class Wms {
    public db?: Db;
    private _connection: MongoClient | null = null;
    private _tunnelServer: Server | null = null;
    constructor() {
        if (this._tunnelServer) {
            this._tunnelServer.on('connection', console.log.bind(console, "**tunnel ssh server connected**:\n"));

            this._tunnelServer.on("error", (err) => {
                console.log('**tunnel ssh err**\n\n', err);
                // this._tunnelServer?.close();
            })
        }
    }

    async connect(): Promise<Db | void> {
        const sshConfig = {
            username: process.env.WMS_USERNAME,
            password: process.env.WMS_PASSWORD,
            host: process.env.WMS_HOST,
            port: process.env.SSH_PORT,
            dstPort: process.env.WMS_DST_PORT,
            // privateKey: require('fs').readFileSync('/path/to/key'),
            localPort: process.env.PORT || process.env.WMS_LOCAL_PORT,
            // keepAlive: true //@deprecated
        }

        return new Promise((resolve, reject) => {
            this._tunnelServer = tunnel(sshConfig, async (error, server: Server) => {
                if (error) {
                    console.log("SSH connection error: \n\n", error);
                    reject(error);
                }

                //may expect read ECONNRESET ERROR 
                server.on('error', (_) => {
                    // console.error(`ERRR:`,err)
                })

                try {
                    const connectUri = `mongodb://127.0.0.1:${process.env.WMS_LOCAL_PORT}/`;
                    const _client = new MongoClient(connectUri, {
                        socketTimeoutMS: 10000,
                        connectTimeoutMS: 8000,
                        keepAlive: true,
                    });
                    await _client.connect();
                    this._connection = _client;
                    this.db = this._connection.db('wms');
                    resolve(this.db);    //db connection built.
                } catch (err) {
                    reject(err);
                }
            });
        })
    }

    disconnect(): void {
        if (this._connection)
            this._connection.close();
        console.log(`wms connection closed...`);
    }
}

export const wms = new Wms();
