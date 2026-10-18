/** Posters from brand-kit/posters — same set as the mobile app (mobile/src/data/posters.ts) */
export interface Poster {
  slug: string
  title: string
  caption: string
  image: string
}

export const POSTERS: Poster[] = [
  {
    slug: "welcome",
    title: "Welcome to The Haven",
    caption: "A place to belong — worship, Bible study, fellowship and service at the Copperbelt University.",
    image: "/posters/haven/01-welcome.png",
  },
  {
    slug: "sabbath-worship",
    title: "Sabbath Worship",
    caption: "Every Saturday. All students welcome.",
    image: "/posters/haven/02-sabbath-worship.png",
  },
  {
    slug: "bible-study",
    title: "Midweek Bible Study",
    caption: "Wednesdays, 7:00 PM · Ministry Center – Room A.",
    image: "/posters/haven/03-bible-study.png",
  },
  {
    slug: "need-prayer",
    title: "Need prayer?",
    caption: "Send a prayer request in The Haven app — named or anonymous.",
    image: "/posters/haven/04-need-prayer.png",
  },
  {
    slug: "get-the-app",
    title: "Your ministry, in your pocket",
    caption: "Events, bands, prayer, counseling and merch — sign in with Google.",
    image: "/posters/haven/05-get-the-app.png",
  },
]
