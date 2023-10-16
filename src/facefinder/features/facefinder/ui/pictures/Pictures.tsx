import React, { FC, memo } from 'react';

import './Pictures.css';

export interface PicturesProps {
    firstShot: string | null;
    secondShot: string | null;
}

export const Pictures: FC<PicturesProps> = memo(({firstShot, secondShot}) => {
    if (firstShot && secondShot) {
        return (
            <div className='pictures-wrapper'>
                <img src={firstShot} alt="FIRSTSHOT"/>
                <img src={secondShot} alt="SECONDSHOT"/>
            </div>
        );
    } else return null;
});

