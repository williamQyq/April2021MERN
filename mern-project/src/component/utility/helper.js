import moment from "moment";


export const getUnixDate = (offset) => {
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return moment(date).format('x');
}

export const normalizeStringValue = (value) => {
    return value.replace(/^\s+|\s+$/g, "")
}