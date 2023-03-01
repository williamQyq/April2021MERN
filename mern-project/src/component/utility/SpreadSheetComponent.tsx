import React from 'react';
import { Spreadsheet } from 'react-spreadsheet';

interface IProps {

}
const SpreadSheetComponent: React.FC<IProps> = () => {
    const data = [
        [{ value: "Vanilla" }, { value: "Chocolate" }],
        [{ value: "Strawberry" }, { value: "Cookies" }],
    ];
    return (
        <div>
            <Spreadsheet data={data} />
        </div>
    );
}

export default SpreadSheetComponent;