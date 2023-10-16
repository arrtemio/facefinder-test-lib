import React, { FC, memo } from 'react';

import './Canvas.css';

export interface CanvasProps {
    firstShot: string | null;
    secondShot: string | null;
}

 export const Canvas: FC<CanvasProps> = memo(({firstShot, secondShot}) => {

    return (
        <>
            <div id='canvas_wrapper' className='canvas_wrapper'>
                { !secondShot &&
                    <div className='canvas_faceframe'>
                        <div className={!firstShot ? 'oval-frame frame_1' : 'oval-frame frame_2'}/>
                    </div>
                }
                <canvas width={640} height={480} id='canvas'/>
            </div>
        </>
    );
});

