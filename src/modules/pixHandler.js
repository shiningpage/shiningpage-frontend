import Resizer from 'react-image-file-resizer';

const pixHandler = async (e, zx) => {
  console.log(e.target.files[0].type)
  if(checkMimeType(e)){
    const file = e.target.files[0];
    // const ft = file.type
    // if(ft !== 'image/jpeg') {

    // }
    const blob = await resizeFile(file, "jpeg", "blob")
    const base64 = await resizeFile(file, "jpeg", "base64") // file.type.split("/")[1]
    const fileResized = new File([blob], 'image.jpeg', { type: blob.type });
    // const fileResized = await urltoFile(image, "a.jpg", "jpg")
    // console.log(file, fileResized, base64)
    return { file, fileResized, base64 }
  }

  // function urltoFile(url, filename, mimeType){
  //   mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
  //   return (fetch(url)
  //     .then(function(res){return res.arrayBuffer();})
  //     .then(function(buf){return new File([buf], filename, {type:mimeType});})
  //   );
  // }

  async function resizeFile(file, type, format){
    var result = ''
    await new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        zx,
        zx,
        type,
        100,
        0,
        (uri) => {
          result = uri
          resolve(uri);
        },
        format,
        null,
        null,
        zx,
        zx
      );
    });
    return result
  }

  function checkMimeType(e){
    //getting file object
    let files = e.target.files
    //define message container
    let err = ''
    // list allow mime type
    const types = ['image/jpeg' , 'image/png', 'image/gif'] //
    // loop access array
    for(var x = 0; x<files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container
        err += files[x].type+' is not a supported format\n';
      }
    };

   if (err !== '') { // if message not same old that mean has error
      e.target.value = null // discard selected file
      console.log(err)
      return false;
    }
   return true;
  }

}

export default pixHandler;