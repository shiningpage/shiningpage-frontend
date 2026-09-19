import Resizer from 'react-image-file-resizer';

type PixHandlerResult = {
    file: File;
    fileResized: File;
    base64: string;
};

const pixHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
    zx: number
): Promise<PixHandlerResult | undefined> => {
    const file = e.target.files?.[0];

    if (!file) {
        return undefined;
    }

    console.log(file.type);

    if (checkMimeType(e)) {
        const blob = await resizeFile(file, 'jpeg', 'blob') as Blob;
        const base64 = await resizeFile(file, 'jpeg', 'base64') as string;

        const fileResized = new File(
            [blob],
            'image.jpeg',
            { type: blob.type }
        );

        return {
            file,
            fileResized,
            base64,
        };
    }

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

    function checkMimeType(
        event: React.ChangeEvent<HTMLInputElement>
    ): boolean {
        const files = event.target.files;

        if (!files) {
            return false;
        }

        let err = '';

        const types = [
            'image/jpeg',
            'image/png',
            'image/gif',
        ];

        for (let x = 0; x < files.length; x++) {
            if (types.every(type => files[x].type !== type)) {
                err += `${files[x].type} is not a supported format\n`;
            }
        }

        if (err !== '') {
            event.target.value = '';
            console.log(err);
            return false;
        }

        return true;
    }
};

export default pixHandler;