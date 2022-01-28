const tunnel = require('tunnel-ssh');
const { MongoClient } = require('mongodb');
const express = require('express');
const wmsConfig = require('../config/wmsConfig');

//when modules/instance being required in nodejs, it will only load once.
let wmsDatabase;

function connect(config, callback) {
    tunnel(config, (error, server) => {
        if (error) {
            console.log("SSH connection error: " + error);
        }
        // let client = new MongoClient('mongodb://127.0.0.1:27017/wms', { useUnifiedTopology: true });
        MongoClient.connect(`mongodb://127.0.0.1:${config.localPort}/wms`, { useUnifiedTopology: true }).then(client => {
            wmsDatabase = client.db('wms');
            callback();
        }).catch(err => {
            console.error(`WMS Connection failed: ${err}`)
        });

    });
}

function getDatabase() {
    return wmsDatabase;
}

function close() {
    wmsDatabase.close();
    console.log(`wms connection closed...`);
}

function wmsService() {
    const wmsService = express();
    wmsService.use(express.json());

    // @WMS connection; Connect to WMS Database via tunnel-ssh
    wmsService.listen(wmsConfig.localPort, () => {
        console.log(`WMS service started on port 4000`)
    })

    connect(wmsConfig, () => {
        console.log(`WMS Database Connected...`);
    });
}

module.exports = { connect, getDatabase, close, wmsService, wmsConfig };