
import axios from 'axios';
import { serverURL } from '../srcSet';

const pixDelete = async (data) => {
  await axios.post(`${serverURL}/userPanel/deleteFile`, data, { 

  })
  .then(res => {
      // console.log(res.data)
  })
}

export default pixDelete;