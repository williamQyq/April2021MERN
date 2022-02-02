import axios from 'axios';

export const getInvReceive = () => (
    axios.get(`/api/inbound/inv-receive/wrongadds`)
)
