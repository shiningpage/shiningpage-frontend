import type { CSSProperties, ChangeEvent, MouseEvent } from 'react';

import colors from '../assets/images/other/colors.png';
import { MdEdit } from 'react-icons/md';
import { HiPlus } from 'react-icons/hi';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { BsThreeDots } from 'react-icons/bs';

type EditBtnProps = {
    rtl: boolean;
    size?: number;
    top?: number;
    right?: number | string;
    padding?: string;
    margin?: string | number;
    type?: string;
    text?: string;
    fontSize?: string | number;
    fontWeight?: CSSProperties['fontWeight'];
    zIndex?: number | string;
    file?: boolean;
    position?: CSSProperties['position'];
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const EditBtn = ({
    rtl,
    size = 40,
    top = 20,
    right = 20,
    padding = '2px',
    margin,
    type = 'edit',
    text,
    fontSize = '18px',
    fontWeight,
    zIndex = '10',
    file = false,
    position = 'absolute',
    onClick,
    onChange,
}: EditBtnProps) => {

    const myStyle: CSSProperties = {
        width: !text ? size : '',
        height: size,
        minWidth: !text ? size : '',
        minHeight: size,
        padding: '3px',
        margin,
        alignItems: 'center',
        borderRadius: !text ? '100px' : '5px',
        position,
        top,
        zIndex,
        animationDelay: '1s',
    };

    if (rtl) {
        myStyle.left = right;
    } else {
        myStyle.right = right;
    }

    const colorImg = (
        <img
            style={{
                objectFit: 'cover',
                width: '20px',
                height: '20px',
            }}
            src={colors}
            alt="colors"
        />
    );

    return (
        <div
            className="center btnShadow rainbow"
            style={myStyle}
            onClick={onClick}
        >
            <div
                className="center btn-file"
                style={{
                    fontSize,
                    fontWeight,
                    width: '100%',
                    height: '100%',
                    padding,
                    alignItems: 'center',
                    borderRadius: !text ? '100px' : '4px',
                    color: '#000000',
                    backgroundColor: '#ffffff',
                }}
            >
                {text ? (
                    text
                ) : (
                    <div>
                        {type === 'colors' && colorImg}

                        {type === 'edit' && <MdEdit />}

                        {type === 'add' && <HiPlus />}

                        {type === 'delete' && (
                            <RiDeleteBin6Fill
                                style={{ color: 'red' }}
                            />
                        )}

                        {type === '3dot' && <BsThreeDots />}

                        {file && (
                            <input
                                type="file"
                                name="file"
                                onChange={onChange}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditBtn;