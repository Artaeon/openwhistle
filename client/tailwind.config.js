/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Corporate Trust color palette
                primary: {
                    50: '#f0f5fa',
                    100: '#dae6f2',
                    200: '#b8cfe7',
                    300: '#89afd5',
                    400: '#5588be',
                    500: '#3a6ca6',
                    600: '#2d5589',
                    700: '#1e3a5f', // Main primary
                    800: '#1c3352',
                    900: '#1c2e46',
                    950: '#121d2e',
                },
                accent: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488', // Main accent
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
