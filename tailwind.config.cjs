/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontSize: {
				"2xs": "0.6875rem",
			},
			screens: {
				hxl: "1400px",
			},
			boxShadow: {
				"3xl": "0 0 16px 16px rgba(0,0,0,0.1)",
			},
			colors: {
				brand: {
					primary: "#7B74FF",
				},
				letters: {
					primary: "#000000",
					secondary: "#343434",
					tertiary: "#575757",
				},
				background: {
					200: "#F7F7F7",
					100: "#F9F9F9",
					0: "#FFFFFF",
				},
				heleum: {
					1000: "#000000",
					950: "#020409",
					900: "#040811",
					850: "#060C1A",
					800: "#081022",
					700: "#0B1934",
					600: "#0F2145",
					500: "#132956",
					400: "#304674",
					300: "#4E6492",
					200: "#6B81AF",
					150: "#7A90BE",
					100: "#899FCD",
					50: "#97ADDC",
					0: "#A6BCEB",
				},
				primary: {
					default: "#132956",
					faded: "#304674",
					washedout: "#4E6492",
					bright: "#EBFAFA",
				},
				secondary: {
					default: "#6B81AF",
					faded: "#7A90BE",
					washedout: "#97ADDC",
					bright: "#A6BCEB",
				},
				danger: {
					default: "#FF0022",
					faded: "#FF455E",
					washedout: "#FF8B9A",
					bright: "#FFE7EA",
				},
				success: {
					default: "#00F7BF",
					faded: "#00F7BF",
					washedout: "#98FFE0",
					bright: "#EAFFF8",
				},
				warning: {
					default: "#FFC700",
					faded: "#FFD252",
					washedout: "#FFE393",
					bright: "#FFF9E9",
				},
				info: {
					default: "#1BE7FF",
					faded: "#59EDFF",
					washedout: "#97F4FF",
					bright: "#EAFCFF",
				},
				neutral: {
					1000: "#111314",
					900: "#2D3436",
					800: "#636E72",
					600: "#B2BEC3",
					400: "#DFE6E9",
					200: "#F0F3F5",
					100: "#F7FAFC",
					0: "#FFFFFF",
				},
			},
			backgroundImage: {
				"gradient-primary": "linear-gradient(102.83deg, #132956 47.13%, #4E6492 106.31%)",
				"gradient-secondary": "linear-gradient(90deg, #6B81AF 0%, #7A90BE 100%)",
				"gradient-danger": "linear-gradient(90deg, #FF0022 0%, #FF5C00 100%)",
				"gradient-info": "linear-gradient(90deg, #1BE7FF 0%, #C2F4FF 100%)",
				"gradient-success": "linear-gradient(90deg, #00F7BF 0%, #98FFA2 100%)",
				"gradient-warning": "linear-gradient(90deg, #FFC212 0%, #FAFF00 100%)",
			},
			borderWidth: {
				1: "1px",
			},
			borderRadius: {
				xs: "0.125rem",
				sm: "0.25rem",
				"4xl": "2rem",
			},
		},
	},
	plugins: [],
};
