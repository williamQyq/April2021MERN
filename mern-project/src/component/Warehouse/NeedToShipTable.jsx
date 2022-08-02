import { useState } from "react";
import FormTable from "component/utility/FormTable.jsx";
import { defaultSettings, needToShipColumns } from "component/Warehouse/utilities.js";
import { useEffect } from "react";

const NeedToShipTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {

    }, [])

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