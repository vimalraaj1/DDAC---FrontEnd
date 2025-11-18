/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary colors
                primary: "var(--primary)",
                "primary-hover": "var(--primary-hover)",
                "primary-light": "var(--primary-light)",

                // Background colors
                "bg-main": "var(--bg-main)",
                "bg-secondary": "var(--bg-secondary)",
                "bg-card": "var(--bg-card)",
                "bg-sidebar": "var(--bg-sidebar)",
                "bg-topbar": "var(--bg-topbar)",

                // Text colors - flatten these!
                "text-heading": "var(--text-heading)",
                "text-body": "var(--text-body)",
                "text-muted": "var(--text-muted)",
                "text-ondark": "var(--text-on-dark)",  // Remove hyphen for class name

                // Accent colors
                "accent-sky": "var(--accent-sky)",
                "accent-teal": "var(--accent-teal)",
                "accent-success": "var(--accent-success)",
                "accent-warning": "var(--accent-warning)",
                "accent-danger": "var(--accent-danger)",

                // Button colors
                "btn-primary": "var(--btn-primary)",
                "btn-primary-hover": "var(--btn-primary-hover)",
                "btn-secondary": "var(--btn-secondary)",
                "btn-secondary-text": "var(--btn-secondary-text)",

                // Input/Border
                "input-border": "var(--input-border)",
                "border-color": "var(--border-color)"
            },
            borderRadius: {
                xl: "14px"
            },
            boxShadow: {
                soft: "0 6px 18px rgba(14,30,60,0.06)"
            }
        }
    },
    plugins: [],
}