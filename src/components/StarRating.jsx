import React from 'react';
import { FaRegStar, FaStar } from "react-icons/fa";

const StarRating = ({
    value = 0,
    max = 5,
    size = 24,
    borderColor = '#e0e0e0',
    color = '#FFB400',
    readOnly = false,
    onChange = () => {}
}) => {

    return (
        <div
            className="center"
            style={{ gap: '3px' }}
        >
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;

                const StarIcon =
                    starValue <= value ? FaStar : FaRegStar;

                return (
                    <StarIcon
                        key={starValue}
                        size={size}
                        style={{
                            cursor: readOnly ? 'default' : 'pointer',
                            color: starValue <= value
                                ? color
                                : borderColor
                        }}
                        onClick={(e) => {
                            e.stopPropagation();

                            if (!readOnly) {
                                onChange(starValue);
                            }
                        }}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;