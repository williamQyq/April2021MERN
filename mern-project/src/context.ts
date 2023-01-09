import React from 'react';
import type { ProSettings } from '@ant-design/pro-layout';

export interface ThemeContextType {
    themeSettings: Partial<ProSettings | undefined>;
    toggleTheme: () => void;
    setThemeSetting: (changeSettings: Partial<ProSettings | undefined>) => void;
}

export const ThemeContext = React.createContext<ThemeContextType | null>({
    themeSettings: {
        fixSiderbar: true,
        layout: 'mix',
        navTheme: 'realDark',
        splitMenus: true,
        contentWidth: "Fluid",
        siderMenuType: "sub"
    },
    toggleTheme: () => { },
    setThemeSetting: () => { }
});
