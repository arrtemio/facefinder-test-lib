import { Button } from "../../../shared/button/Button";
import { FormattedMessage } from "react-intl";
import { FC } from "react";

interface LangSwitcherProps {
    changeLanguage: () => void;
}

export const LangSwitcher: FC<LangSwitcherProps> = ({changeLanguage}) => {

    return (
        <Button onClick={changeLanguage}>
            <FormattedMessage id='lang' />
        </Button>
    );
};
