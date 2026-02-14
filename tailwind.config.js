/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.ts",
        "./resources/**/*.tsx",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Plus Jakarta Sans as the primary sans-serif font (modern, clean)
                'sans': ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                
                // Lora as the serif font (elegant, readable)
                'serif': ['Lora', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
                
                // Inconsolata for monospace/code (technical, precise)
                'mono': ['Inconsolata', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
                
                // Optional: Create specific roles for each font
                'heading': ['Plus Jakarta Sans', 'sans-serif'],
                'body': ['Plus Jakarta Sans', 'sans-serif'],
                'accent': ['Lora', 'serif'],
                'code': ['Inconsolata', 'monospace'],
            },
        },
    },
    plugins: [],
}