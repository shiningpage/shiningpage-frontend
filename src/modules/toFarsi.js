//import axios from 'axios';

const toFarsi = (text) => {
  var t1 = text.replace('ي', 'ی')
  var t2 = t1.replace('ك', 'ک')

  var t = t2

  return t

}

export default toFarsi;