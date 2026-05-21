
import axios from 'axios';
import { serverURL } from '../srcSet';

const pixRename = async (data) => {
  await axios.post(`${serverURL}/userPanel/renameFile`, data, { 

  })
  .then(res => {
      console.log(res.data)
  })
}

export default pixRename;