const config = require('config');

const amazonSellingPartner = async () => {
    const CREDENTIALS = config.get('amazonCredentials');
    const IAM = config.get('amazonIAMRole');
    const SellingPartnerAPI = require('amazon-sp-api');

    let sellingPartner = new SellingPartnerAPI({
        region: "na",
        credentials: CREDENTIALS,
        refresh_token: IAM.REFRESH_TOKEN

    });

    try {
        let items = await sellingPartner.callAPI({
            operation: 'getPricing',
            endpoint: 'productPricing',
            query: {
                MarketplaceId: 'ATVPDKIKX0DER',
                Asins: ['B09F2VMZ6M'],
                ItemType: 'Asin'
            },


        });
        items.forEach(item => {
            console.log(JSON.stringify(item))
        })

    } catch (e) {
        console.error(`AWS SP API ERROR:\n${e}`)
    }


}

module.exports = amazonSellingPartner;