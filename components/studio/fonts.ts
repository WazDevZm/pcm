import { Bebas_Neue, Great_Vibes, Montserrat, Playfair_Display } from 'next/font/google'

/** Extra headline fonts for Studio posters (self-hosted by next/font, so exports embed them) */
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['800'], variable: '--font-playfair', display: 'block' })
const bebas = Bebas_Neue({ subsets: ['latin'], weight: ['400'], variable: '--font-bebas', display: 'block' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['900'], variable: '--font-montserrat', display: 'block' })
const vibes = Great_Vibes({ subsets: ['latin'], weight: ['400'], variable: '--font-vibes', display: 'block' })

export const studioFontVariables = [playfair.variable, bebas.variable, montserrat.variable, vibes.variable].join(' ')
