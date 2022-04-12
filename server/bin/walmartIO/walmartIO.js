import fs from 'fs';
import crypto from 'crypto';
import fetch from 'node-fetch'
import { WM_RSA_PASS_PHASE } from '#root/config.js'

let pem = fs.readFileSync('./wm_rsa_key_pair.pem')
let key = pem.toString('ascii')
let privatekey = crypto.createPrivateKey({
    'key': key,
    'format': 'pem',
    'passphrase': 'william'
})

const sign = (identifier) => {
    let sign = crypto.createSign('RSA-SHA256');
    sign.update(identifier);
    let signature = sign.sign(privatekey, 'base64');
    return signature;
}

const keyData = {
    consumerId: "1527766b-750f-487d-a2a4-b9f95c39da8b",
    keyVer: 1,
}

const generateWalmartHeaders = () => {
    const { consumerId, keyVer } = keyData;
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
        // `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items/${productId}?publisherId=${keyData.impactId}`,
        // `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/paginated/items?category=3944_3951_1089430_1230091_1094888&count=200&brand=Hp`, //suggestion url
        // `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/taxonomy`,
        // `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?query=laptop`,
        `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/paginated/items?category=3944_3951_1089430&count=10&brand=Asus&soldByWmt=true&available=true`,

        options
    );

    let detail = await res.json()
    console.log(detail)
    return detail
};

getProductById(514027934)

// let a = Buffer.from(fs.readFileSync('./wm_rsa_key_pair')).toString();
// console.log(fs.readFileSync('./wm_rsa_key_pair'))