import React, { FC, memo } from 'react';
import  { FormattedMessage } from "react-intl";

import './Message.css';

export interface MessageProps {
    message: string | undefined;
}

export const Message: FC<MessageProps> = memo(({message}) => {

    return (
        <div className='message-wrapper'>
            {message &&
                <p className='message'>
                    <FormattedMessage id={message} />
                </p>
            }
        </div>
    );
});

