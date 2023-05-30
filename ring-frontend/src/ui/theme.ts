import { extendTheme, ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

export const theme = extendTheme(
    { config },
    {
        colors: {
            brand: {
                primary: '#4d3227',
                secondary: '#ebc999',
                tertiary: '#cd7700',
                platinum: "#cfdbd5",
                lightGray: "f7f0f5"
            },
        },
        styles: {
            global: () => ({
                body: {
                    bg: 'gray.200',
                },
            }),
        },
    }
);

