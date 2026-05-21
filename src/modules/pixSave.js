
import axios from 'axios';
import { serverURL } from '../srcSet';

const pixSave = async (selectedFile, Info) => {
  const data = new FormData()
  data.append('file', selectedFile, Info) // use "@" instead of "/" in address
  await axios.post(`${serverURL}/userPanel/savePix`, data, { 
      // receive two parameter endpoint url ,form data
  })
  .then(res => { // then print response status
    console.log(res.data)
  })
}

export default pixSave;