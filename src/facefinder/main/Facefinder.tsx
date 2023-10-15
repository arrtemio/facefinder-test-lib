import React, { useState } from 'react';
import { useTheme } from "../providers/ThemeProvider/lib/UseTheme";
import { FacefinderWrapper } from "../features/facefinder/ui/facefinder-wrapper/FacefinderWrapper";
import { Navbar } from "../widgets/navbar";

import '../styles/index.css'
import { IntlProvider } from "react-intl";
import { locales } from "../i18n/locales";
import { messages } from "../i18n/messages";

export const Facefinder = () => {
    const {theme} = useTheme();
    const [currentLocale, setCurrentLocale] = useState(locales.ENGLISH);

    const handleChange =  () => {
        setCurrentLocale(currentLocale === 'en-US' ? 'pl-PL' : 'en-US');
    }

    return (
            <IntlProvider
                locale={currentLocale}
                messages={messages[currentLocale]}
            >
                <div id='facefinder-app'>
                    <div className={`main ${theme}`}>
                        <Navbar changeLanguage={handleChange} />
                        <FacefinderWrapper />
                    </div>
                </div>
            </IntlProvider>
    );
};
