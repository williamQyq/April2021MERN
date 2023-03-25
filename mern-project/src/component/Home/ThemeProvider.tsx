import React, { createContext, ReactNode, useState } from 'react';
import type { ProSettings } from '@ant-design/pro-layout';
import { AliasToken } from 'antd/es/theme/internal';
import { OverrideToken } from 'antd/es/theme/interface';

type Theme = Partial<AliasToken>;
type ThemeSettings = Partial<ProSettings | undefined>;
type ComponentTheme = OverrideToken;

const darkTheme: Theme = {

}
const lightTheme: Theme = {

}
const darkThemeCmpt: ComponentTheme = {

}
const lightThemeCmpt: ComponentTheme = {

}

interface ThemeContextType {
    isDark: boolean;
    themeSettings: ThemeSettings;
    toggleTheme: () => void;
    setThemeSetting: (changeSettings: ThemeSettings) => void;
}

interface ThemeProviderProps {
    children: ReactNode
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<ThemeProviderProps> = (props) => {
    const [themeSettings, setTheme] = useState<ThemeSettings>({
        fixSiderbar: true,
        layout: 'mix',
        // navTheme: 'realDark',
        splitMenus: true,
        contentWidth: "Fluid",
        siderMenuType: "sub",
        colorPrimary: "#1677FF"
    })
    const [isDark, setDarkTheme] = useState<boolean>(true);

    const toggleTheme = () => {
        setDarkTheme(!isDark);
        // isDark ?
        //     setTheme({ ...themeSettings, navTheme: "light" }) :
        //     setTheme({ ...themeSettings, navTheme: "realDark" });
    }
    const setThemeSetting = (changeSettings: ThemeSettings) => {
        if (changeSettings)
            setTheme(changeSettings);
    }

    return (
        <ThemeContext.Provider
            value={{
                isDark,
                themeSettings,
                toggleTheme: toggleTheme,
                setThemeSetting: setThemeSetting,
            }}>
            {props.children}
        </ThemeContext.Provider>
    );
}