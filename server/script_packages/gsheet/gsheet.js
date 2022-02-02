const { Script } = require('../Scripts.js')

module.exports = {
    outputGsheet: (docs) => {
        const gsheet = new Script();

        gsheet.exec('./gsheet/gsheetgsheet.py', docs, (res) => {
            console.log(res);
        }).then(result=>console.log(result))
        .catch(e=>console.error(e))

    }
}