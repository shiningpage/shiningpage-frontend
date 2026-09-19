import axios from 'axios';
import { serverURL } from '../srcSet';

type SaveFileResponse = {
    filename: string;
};

const fileSave = async (
    selectedFile: File,
    Info: string,
    fileName: string,
    username: string,
    destX: string
): Promise<void> => {
    const data = new FormData();

    data.append('file', selectedFile, Info);

    const res = await axios.post<SaveFileResponse>(
        `${serverURL}/userPanel/saveFile`,
        data
    );

    const newNameX = res.data.filename;

    const xArr = newNameX.split('-');

    xArr.shift();

    if (fileName !== xArr[0]) {
        const oldName = newNameX;
        const newName = username + '-' + fileName;

        const dataX = {
            dest: destX,
            oldName,
            newName,
        };

        await axios.post(
            `${serverURL}/userPanel/renameFile`,
            dataX
        );
    }
};

export default fileSave;