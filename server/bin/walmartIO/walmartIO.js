import fs from 'fs';
import crypto from 'crypto';
import fetch from 'node-fetch'
import { WM_RSA_PASS_PHASE } from '#root/config.js'

let pem = fs.readFileSync('./wm_rsa_key_pair.pem')
let key = pem.toString('ascii')
let privatekey = crypto.createPrivateKey({
    'key': key,
    'format': 'pem',
    'passphrase': WM_RSA_PASS_PHASE
})

const sign = (identifier) => {
    let sign = crypto.createSign('RSA-SHA256');
    sign.update(identifier);
    let signature = sign.sign(privatekey, 'base64');
    return signature;
}

const generateWalmartHeaders = () => {
    const { privateKey, consumerId, keyVer } = keyData;
    const hashList = {
        "WM_CONSUMER.ID": consumerId,
        "WM_CONSUMER.INTIMESTAMP": Date.now().toString(),
        "WM_SEC.KEY_VERSION": keyVer,
    };
    const sortedHashString = `${hashList["WM_CONSUMER.ID"]}\n${hashList["WM_CONSUMER.INTIMESTAMP"]}\n${hashList["WM_SEC.KEY_VERSION"]}\n`;

    let signature_enc = sign(sortedHashString)

    return {
        "WM_SEC.AUTH_SIGNATURE": signature_enc,
        "WM_CONSUMER.INTIMESTAMP": hashList["WM_CONSUMER.INTIMESTAMP"],
        "WM_CONSUMER.ID": hashList["WM_CONSUMER.ID"],
        "WM_SEC.KEY_VERSION": hashList["WM_SEC.KEY_VERSION"],
    };
};

export const getProductById = async (productId) => {
    const options = {
        method: "GET",
        headers: generateWalmartHeaders(),
    };

    const res = await fetch(
        `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items/${productId}?publisherId=${keyData.impactId}`,
        options
    );

    let detail = await res.json()
    console.log(detail)
    return detail
};

getProductById(4837473)

// let a = Buffer.from(fs.readFileSync('./wm_rsa_key_pair')).toString();
// console.log(fs.readFileSync('./wm_rsa_key_pair'))