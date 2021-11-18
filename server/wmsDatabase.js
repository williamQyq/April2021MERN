const tunnel = require('tunnel-ssh');
const { MongoClient } = require('mongodb');

//when modules/instance being required in nodejs, it will only load once.
let wmsDatabase;

function connect(config, callback) {
    tunnel(config, (error, server) => {
        if (error) {
            console.log("SSH connection error: " + error);
        }
        let client = new MongoClient('mongodb://0.0.0.0:27017/wms', { useUnifiedTopology: true });

        (async () => {
            await client.connect();
            console.log(`WMS Database Connected...`);
            wmsDatabase = client.db("wms");
            callback();

        })();

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