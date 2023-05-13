//react path alias...
const { CracoAliasPlugin } = require("react-app-alias");

module.exports = {
    // //@desc: ~ alias does not work... 
    // webpack: {
    //     alias: {
    //         '~': path.resolve(__dirname, 'src')
    //     }
    // },
    babel: {
        presets: [
            ['@babel/preset-typescript', {
                allowDeclareFields: true
            }]
        ]
    },
    plugins: [
        {
            plugin: CracoAliasPlugin,
            options: {
                source: "tsconfig",
                // baseUrl SHOULD be specified
                // plugin does not take it from tsconfig
                baseUrl: "./src",
                /* tsConfigPath should point to the file where "baseUrl" and "paths" 
                are specified*/
                tsConfigPath: "./tsconfig.paths.json"
            }
        }
    ],
    typescript: {
        enableTypeChecking: true
    }

};