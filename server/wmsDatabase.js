const tunnel = require('tunnel-ssh');
const { MongoClient } = require('mongodb');

//when modules/instance being required in nodejs, it will only load once.
let wmsDatabase;
function connect(config, port, callback) {
    tunnel(config, (error, server) => {
        if (error) {
            console.log("SSH connection error: " + error);
        }
        // let client = new MongoClient('mongodb://127.0.0.1:27017/wms', { useUnifiedTopology: true });
        MongoClient.connect(`mongodb://127.0.0.1:${port}/wms`, { useUnifiedTopology: true }).then(client => {
            console.log(`WMS Database Connected...`);
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

module.exports = { connect, getDatabase, close };