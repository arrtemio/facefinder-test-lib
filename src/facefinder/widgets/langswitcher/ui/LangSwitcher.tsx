import React from "react";
import  { Button } from "../../../shared/button";
import { FormattedMessage } from "react-intl";
import { FC } from "react";

export interface LangSwitcherProps {
    changeLanguage: () => void;
}

export const LangSwitcher: FC<LangSwitcherProps> = ({changeLanguage}) => {

    return (
        <Button onClick={changeLanguage}>
            <FormattedMessage id='lang' />
        </Button>
    );
};
