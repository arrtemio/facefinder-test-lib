import React, { ButtonHTMLAttributes, memo, ReactNode } from 'react';

import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
}

export const Button = memo((props: ButtonProps) => (
        <button className='button' onClick={props.onClick}>
            {props.children}
        </button>
    )
);
