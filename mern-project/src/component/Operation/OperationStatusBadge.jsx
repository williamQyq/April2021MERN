import { Badge } from "antd";

export const StatusBadge = ({ record }) => {
    return record.upc === undefined ?
        <SubStatusBadge record={record} />
        :
        <MainStatusBadge record={record} />

}

export const MainStatusBadge = ({ record }) => {
    const hasWmsQty = () => {
        return record.wmsQuantity > 0 ? true : false
    }
    const hasOffersActive = () => {
        let hasActiveOffers = false;
        
        //filter clean null offers
        let identifiers = record.identifiers.filter(identifier =>
            identifier.offers != null
        )
        
        //check if has active offers
        for (let identifier of identifiers) {
            if (identifier.offers.length > 0) {
                hasActiveOffers = true;
                break;
            }
        }
      
        return hasActiveOffers
    }
    let isWmsQtyActive = hasWmsQty();
    let isOfferActive = hasOffersActive();
    let status = "error", msg = "unknown";

    if (isWmsQtyActive && !isOfferActive) {
        status = "warning";
        msg = "Under Process";
    } else if (!isWmsQtyActive && isOfferActive) {
        status = "error";
        msg = "Zombie Asins";
    } else if (!isWmsQtyActive && !isOfferActive) {
        status = "default";
        msg = "Out of Stock";
    } else if (isWmsQtyActive && isOfferActive) {
        status = "success";
        msg = "Finished";
    }

    return <Badge status={status} text={msg} />

}
const SubStatusBadge = ({ record }) => {
    return <Badge />
}


