import React, { memo, useCallback, useEffect, useState } from 'react';
import { startStream } from "../../model/startStream";

import { Message } from "../message";
import { Canvas } from "../canvas";
import { Pictures } from "../pictures";

import './FacefinderWrapper.css';

export const FacefinderWrapper = memo(() => {
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [firstShot, setFirstShot] = useState<string | null>(null);
    const [secondShot, setSecondShot] = useState<string | null>(null);

    const setNewMessage = useCallback((text: string | undefined) => {
        if (text) {
            setMessage(prevState => text)
        }
    }, []);


    useEffect(() => {
        startStream({
            setNewMessage,
            setFirstShot,
            setSecondShot,
        });
    },[])

    return (
        <div className='facefinder'>
            <Message message={message} />
            <Canvas firstShot={firstShot} secondShot={secondShot} />
            <Pictures firstShot={firstShot} secondShot={secondShot} />
        </div>
    );
});
