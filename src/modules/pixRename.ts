import axios from 'axios';
import { serverURL } from '../srcSet';

const pixRename = async (data: Record<string, unknown>): Promise<void> => {
    const res = await axios.post(`${serverURL}/userPanel/renameFile`, data);
    console.log(res.data);
};

export default pixRename;