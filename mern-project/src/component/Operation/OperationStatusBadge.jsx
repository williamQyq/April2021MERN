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
        record.identifiers.forEach(identifier => {
            hasActiveOffers = identifier.offers == null ? false : true;
        })
        return hasActiveOffers
    }

    let isWmsQtyActive = hasWmsQty();
    let isOfferActive = hasOffersActive();
    let status = "success", msg = "Finished";

    if (isWmsQtyActive && !isOfferActive) {
        status = "warning";
        msg = "Under Process";
    } else if (!isWmsQtyActive && isOfferActive) {
        status = "error";
        msg = "Zombie Asins";
    } else if (!isWmsQtyActive && !isOfferActive){
        status ="default";
        msg = "Out of Stock";
    }

    return <Badge status={status} text={msg} />

}
const SubStatusBadge = ({ record }) => {
    return <Badge />
}


