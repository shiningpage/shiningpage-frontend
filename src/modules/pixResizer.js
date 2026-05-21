import Resizer from 'react-image-file-resizer';

const pixResizer = async (file, zx) => {
  const blob = await resizeFile(file, "jpeg", "blob")
  const fileResized = new File([blob], 'image.jpeg', { type: blob.type });
  return { file, fileResized }

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

}

export default pixResizer;