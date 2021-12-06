const config = require('config');

const amazonSellingPartner = async () => {
    const credentials = config.get('amazonCredentials');
    const SellingPartnerAPI = require('amazon-sp-api');

    let sellingPartner = new SellingPartnerAPI({
        region: "na",
        refresh_token: "",
        credentials: credentials
    });

    try {
        let manageInventoryData = await sellingPartner.callAPI({
            operation: 'getInventorySummaries',
            query: {
                details: true,
                granularityType: 'Marketplace',
                marketplaceIds: 'ATVPDKIKX0DER'
            }
        });
    } catch (e) {
        console.error("err amz")
    }

    console.log(manageInventoryData)

}

module.exports =
    amazonSellingPartner