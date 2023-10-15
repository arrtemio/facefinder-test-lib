import { memo } from 'react';
import { useTheme } from "../../../../providers/ThemeProvider/lib/UseTheme";
import { Theme } from "../../../../providers/ThemeProvider/lib/ThemeContext";
import { Button } from "../../../../shared/button/Button";
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
