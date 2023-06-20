import fs from 'fs';
import crypto from 'crypto';
import fetch from 'node-fetch'

type Secrete = string;
interface WalmartHeaders extends Record<string, string> {
    "WM_SEC.AUTH_SIGNATURE": string,
    "WM_CONSUMER.INTIMESTAMP": string,
    "WM_CONSUMER.ID": string,
    "WM_SEC.KEY_VERSION": string,
};

interface WalmartAPI {

}
// const wm = new Walmart();
// wm.getProductById("514027934")
class Walmart {
    public keyData: { consumerId: string, keyVer: string };
    public headers: WalmartHeaders;
    private security: Security;

    constructor() {
        this.keyData = {
            consumerId: "1527766b-750f-487d-a2a4-b9f95c39da8b",
            keyVer: "1"
        }
        this.security = new Security();
        this.headers = this.createHeaders(this.keyData);
    }
    createHeaders(keyData: { consumerId: string, keyVer: string }): WalmartHeaders {
        const { consumerId, keyVer } = keyData;
        const hashList = {
            "WM_CONSUMER.ID": consumerId,
            "WM_CONSUMER.INTIMESTAMP": Date.now().toString(),
            "WM_SEC.KEY_VERSION": keyVer,
        };
        const sortedHashString = `${hashList["WM_CONSUMER.ID"]}\n${hashList["WM_CONSUMER.INTIMESTAMP"]}\n${hashList["WM_SEC.KEY_VERSION"]}\n`;

        let signature_enc = this.security.sign(sortedHashString)

        return {
            "WM_SEC.AUTH_SIGNATURE": signature_enc,
            "WM_CONSUMER.INTIMESTAMP": hashList["WM_CONSUMER.INTIMESTAMP"],
            "WM_CONSUMER.ID": hashList["WM_CONSUMER.ID"],
            "WM_SEC.KEY_VERSION": hashList["WM_SEC.KEY_VERSION"],
        };
    }

    async getProductById(productId: string) {
        // [relevance, price, title, bestseller, customerRating, new]
        const impactId = undefined;
        const res = await fetch(
            `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items/${productId}?publisherId=${impactId}`,
            // `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/paginated/items?category=3944_3951_1089430&brand=HP&available=true&count=20`, //suggestion url
            // `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/taxonomy`,
            // `https://sandbox.walmartapis.com/v3/insights/items/trending`,
            // `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?query=laptop&sort=bestseller`,
            // `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/paginated/items?category=3944_3951_1089430&count=10&brand=Asus&soldByWmt=true&available=true`,
            // `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/trends?&category=3944`,
            {
                method: "GET",
                headers: this.headers
            }
        );

        let detail = await res.json()
        // let electronics = detail.categories.filter(categorie => categorie["id"] == '3944').pop()
        // let children = electronics.children
        // console.log(children)
        return detail
    }
}

class Security {
    private privateKey: crypto.KeyObject;

    constructor() {
        const pem = fs.readFileSync('./wm_rsa_key_pair.pem');
        const key = pem.toString('ascii');
        this.privateKey = crypto.createPrivateKey({
            'key': key,
            'format': 'pem',
            'passphrase': 'william'
        })
    }
    sign(identifier: string): Secrete {
        const sign = crypto.createSign('RSA-SHA256')
        sign.update(identifier);
        return sign.sign(this.privateKey, 'base64');
    }
}
export default Walmart;
