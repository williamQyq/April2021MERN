import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormTable from "component/utility/FormTable.jsx";
import { defaultSettings, needToShipColumns } from "component/Warehouse/utilities.js";
import { getShippedNotVerifiedShipmentByDate } from "reducers/actions/outboundActions";
import moment from "moment";

const NeedToShipTable = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { shippedNotVerifiedItems } = useSelector((state) => (state.warehouse.needToShip));

    useEffect(() => {
        let today = getUnixDate(0);
        let tommorrow = getUnixDate(1);
        dispatch(getShippedNotVerifiedShipmentByDate([today, tommorrow]))//get unsubstantiated shipment from today to tomorrow excluded
        setData(shippedNotVerifiedItems)
    }, [])

    const getUnixDate = (offset) => {
        let date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + offset);
        return moment(date).format('x');
    }
    return (
        <FormTable
            loading={loading}
            data={data}
            columns={needToShipColumns}
            tableSettings={defaultSettings}
        />
    )
}

export default NeedToShipTable;