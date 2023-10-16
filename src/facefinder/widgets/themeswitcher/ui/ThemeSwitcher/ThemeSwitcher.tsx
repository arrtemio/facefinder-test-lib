import React, { memo } from 'react';
import { useTheme } from "../../../../providers/ThemeProvider";
import { Theme } from "../../../../providers/ThemeProvider";
import { Button } from "../../../../shared/button";
import { FormattedMessage } from "react-intl";

export const ThemeSwitcher = memo(() => {
    const {theme, toggleTheme} = useTheme();

    return (
        <Button onClick={toggleTheme}>
            {theme === Theme.LIGHT
                ? <FormattedMessage id='light' />
                : <FormattedMessage id='dark' />
            }
        </Button>
    );
});
