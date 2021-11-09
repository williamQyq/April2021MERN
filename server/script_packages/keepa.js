const { KeepaScript } = require('./scripts.js');

const getKeepaStat = (searchTerm) => {
    let keepa = new KeepaScript(searchTerm);

    //spawn script to search keepa
    const python = keepa.spawnScript(keepa.searchTerm);

    // listen for script, get total items number
    keepa.listenOn(python);
    return new Promise((resolve, reject) => {
        keepa.listenClose(python, resolve);
        keepa.listenErr(python, reject);
    });
}

module.exports = {
    getKeepaStat: getKeepaStat
}