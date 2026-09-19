import axios from 'axios';
import { serverURL } from '../srcSet';

const pixSave = async (selectedFile: File, Info: string): Promise<void> => {
    const data = new FormData();
    data.append('file', selectedFile, Info);
    const res = await axios.post(`${serverURL}/userPanel/savePix`, data);

    console.log(res.data);
};

export default pixSave;