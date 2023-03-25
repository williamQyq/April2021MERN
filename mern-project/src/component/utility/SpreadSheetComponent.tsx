import React from 'react';
import { Spreadsheet } from 'react-spreadsheet';

interface IProps {

}
const SpreadSheetComponent: React.FC<IProps> = () => {
    const data = [
        [{ value: "UPC" }, { value: "Asin" },{ value: "RAM_1st_slot" },{ value: "RAM_2nd_slot" },{ value: "SSD_1st_slot" },{ value: "SSD_2nd_slot" },{ value: "HDD" },{ value: "OS" },],
        [],[],[],[],[]
    ];
    return (
        <div>
            <Spreadsheet data={data} />
        </div>
    );
}

export default SpreadSheetComponent;