
import axios from 'axios';
import { serverURL } from '../srcSet';

const fileSave = async (selectedFile, Info, fileName, username, destX) => {
  const data = new FormData()
  data.append('file', selectedFile, Info) // use "@" instead of "/" in address
  // console.log(selectedFile, Info)
  await axios.post(`${serverURL}/userPanel/saveFile`, data, { 
      // receive two parameter endpoint url ,form data
  })
  .then(async res => { // then print response status
    // console.log(100, fileName, res.data)
    var newNameX = res.data.filename
    var xArr = newNameX.split('-')
    xArr.shift()
    // console.log(7766, xArr)
    // console.log(9900, newNameX)

    if(fileName!==xArr[0]) {
      // console.log(true)
      const oldName = newNameX
      const newName = username + '-' + fileName
      var dataX = {dest: destX, oldName, newName}
      // console.log(dataX)

      await axios.post(`${serverURL}/userPanel/renameFile`, dataX, {})
      .then(res => {
          // console.log(111222, res.data)
      })
    } else {
      // console.log(false)
    }
  })
}

export default fileSave;