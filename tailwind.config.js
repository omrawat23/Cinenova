/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}" // Adjust this line based on your framework and file extensions
  ],
  theme: {
  	extend: {
		screens:{
        "xs": "480px",
		"xl": "1480px"
		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {

			neoRed: '#FF2052',
			neoGreen: '#00FF7F',
			neoBlue: '#00BFFF',
			neoYellow: '#FFD700',
			neoPurple: '#DA70D6',
			neoOrange: '#FF4500',
			vintagePink: '#F5B7B1',
			vintageGreen: '#D5DBDB',
			vintageYellow: '#FCF3CF',
			vintageBlue: '#D6EAF8',
			
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
			  boxShadow: {
				brutal: '4px 4px 0 0 #000000', // Neo-Brutalism shadow
			  },
			  fontSize: {
				heading: ['3rem', { lineHeight: '1.1' }], // Large headings
			  },
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar-hide')],
  
}
