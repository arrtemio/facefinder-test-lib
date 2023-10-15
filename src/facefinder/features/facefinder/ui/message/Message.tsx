import { FC, memo } from 'react';
import { FormattedMessage } from "react-intl";

import './Message.css';

interface MessageProps {
    message: string | undefined;
}

const Message: FC<MessageProps> = memo(({message}) => {

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

export default Message;