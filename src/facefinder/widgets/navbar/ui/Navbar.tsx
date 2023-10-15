import { FC, memo } from 'react';

import { ThemeSwitcher } from "../../themeswitcher";
import { LangSwitcher } from "../../langswitcher/ui/LangSwitcher";

import './Navbar.css';

interface NavbarProps {
    changeLanguage: () => void;
}

export const Navbar: FC<NavbarProps> = memo(({changeLanguage}) => {
    return (
        <div className='navbar-wrapper'>
            <div className='navbar'>
                <div className='navbar__buttons'>
                    <ThemeSwitcher />
                    <LangSwitcher
                        changeLanguage={changeLanguage}
                    />
                </div>
            </div>
        </div>
    );
});
