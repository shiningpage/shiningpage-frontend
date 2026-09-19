import axios from 'axios';
import { serverURL } from '../srcSet';

const pixDelete = async (data: Record<string, unknown>): Promise<void> => {
    const res = await axios.post(`${serverURL}/userPanel/deleteFile`, data);
    console.log(res.data);
};

export default pixDelete;