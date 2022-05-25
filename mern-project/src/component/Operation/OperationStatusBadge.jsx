import { Badge } from "antd";

export const StatusBadge = ({ record }) => {
    return record.upc === undefined ?
        <SubStatusBadge record={record} />
        :
        <MainStatusBadge record={record} />

}

export const MainStatusBadge = ({ record }) => {
    const MERCHANT = "MERCHANT";
    const AMAZON = "AMAZON";
    const hasWmsQty = () => {
        return record.wmsQuantity > 0 ? true : false
    }
    const hasOffersActive = (fulfillmentChannel) => {
        let hasActiveOffers = false;

        //filter clean null offers
        let identifiers = record.identifiers.filter(identifier =>
            identifier.offers != null
        )

        //check if has active offers
        for (let identifier of identifiers) {
            if (hasActiveOffers)
                break;
            hasActiveOffers = identifier.offers.some(({ FulfillmentChannel }) => FulfillmentChannel == fulfillmentChannel)
        }


        return hasActiveOffers
    }


    let isWmsQtyActive = hasWmsQty();
    let isMerchantOfferActive = hasOffersActive(MERCHANT);
    let isAmazonOfferActive = hasOffersActive(AMAZON)
    let isOfferActive = isMerchantOfferActive || isAmazonOfferActive
    let status = "error", msg = "unknown";

    if (isWmsQtyActive && !isOfferActive) {
        status = "warning";
        msg = "Under Process";
    } else if (!isWmsQtyActive && isMerchantOfferActive) {
        status = "error";
        msg = "Zombie Asins";
    } else if (!isWmsQtyActive && !isOfferActive) {
        status = "default";
        msg = "Out of Stock";
    } else if (isWmsQtyActive && isOfferActive) {
        status = "success";
        msg = "Finished";
    } else if (!isWmsQtyActive && isAmazonOfferActive){
        status ="success";
        msg = "Amazon";
    }

    return <Badge status={status} text={msg} />

}
const SubStatusBadge = ({ record }) => {
    return <Badge status="processing" />
}


