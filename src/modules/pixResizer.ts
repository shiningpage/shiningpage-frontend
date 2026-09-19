import Resizer from 'react-image-file-resizer';

type PixResizerResult = {
    file: File;
    fileResized: File;
};

const pixResizer = async (
    file: File,
    zx: number
): Promise<PixResizerResult> => {
    const blob = await resizeFile(file, 'jpeg', 'blob') as Blob;

    const fileResized = new File(
        [blob],
        'image.jpeg',
        { type: blob.type }
    );

    return {
        file,
        fileResized,
    };

    async function resizeFile(
        file: File,
        type: string,
        format: 'blob' | 'base64'
    ): Promise<unknown> {
        let result: unknown = '';

        await new Promise<void>((resolve) => {
            Resizer.imageFileResizer(
                file,
                zx,
                zx,
                type,
                100,
                0,
                (uri) => {
                    result = uri;
                    resolve();
                },
                format,
                undefined,
                undefined
            );
        });

        return result;
    }
};

export default pixResizer;