/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          main: "#111827",
          surface: "#1F2937",
          card: "#1F2937"
        },
        text: {
          main: "#F3F4F6",
          muted: "#9CA3AF"
        },
        brand: {
          primary: "#3B82F6",
          secondary: "#2563EB",
        },
        semantic: {
          success: "#10B981",
          error: "#EF4444"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
