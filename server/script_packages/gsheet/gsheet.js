const { Script } = require('../Scripts.js')

module.exports = {
    // @usage in routes\api @wms
    outputGsheet: (docs) => {
        const gsheet = new Script();

        gsheet.exec('./script_packages/gsheet/gsheet.py', docs, (res) => {
        })
            .then(result => console.log(result))
            .catch(e => console.error(e))

    }
}