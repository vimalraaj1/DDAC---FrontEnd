/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    theme: {
        extend: {
            colors: {
                primary: "var(--primary)",
                "primary-hover": "var(--primary-hover)",
                "primary-light": "var(--primary-light)",

                background: {
                    DEFAULT: "var(--bg-main)",
                    card: "var(--bg-card)",
                    sidebar: "var(--bg-sidebar)",
                    topbar: "var(--bg-topbar)"
                },

                text: {
                    heading: "var(--text-heading)",
                    body: "var(--text-body)",
                    muted: "var(--text-muted)",
                    onDark: "var(--text-on-dark)"
                },

                accent: {
                    sky: "var(--accent-sky)",
                    teal: "var(--accent-teal)",
                    success: "var(--accent-success)",
                    warning: "var(--accent-warning)",
                    danger: "var(--accent-danger)"
                },

                button: {
                    primary: "var(--btn-primary)",
                    "primary-hover": "var(--btn-primary-hover)",
                    secondary: "var(--btn-secondary)",
                    "secondary-text": "var(--btn-secondary-text)"
                },

                input: {
                    border: "var(--input-border)"
                },

                border: {
                    DEFAULT: "var(--border-color)"
                }
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

