export interface EventItem {
  title: string;
  image: string;
  slug: string;
  time: string;
  date: string;
  location: string;
}

export const events: EventItem[] = [
  {
    title: "React Summit 2026",
    image: "/images/event1.png",
    slug: "react-summit-2026",
    time: "09:00 AM - 05:30 PM",
    date: "June 12, 2026",
    location: "Amsterdam, Netherlands",
  },
  {
    title: "Next.js Conf: Build Better Apps",
    image: "/images/event2.png",
    slug: "nextjs-conf-2026",
    time: "10:00 AM - 04:00 PM",
    date: "July 8, 2026",
    location: "San Francisco, CA",
  },
  {
    title: "GraphQL Galaxy",
    image: "/images/event3.png",
    slug: "graphql-galaxy-2026",
    time: "09:30 AM - 06:00 PM",
    date: "August 18, 2026",
    location: "Online / Global",
  },
  {
    title: "Web3 Hackathon Weekend",
    image: "/images/event4.png",
    slug: "web3-hackathon-weekend",
    time: "Friday 06:00 PM - Sunday 08:00 PM",
    date: "September 4-6, 2026",
    location: "Austin, TX",
  },
  {
    title: "AI Developer Meetup",
    image: "/images/event5.png",
    slug: "ai-developer-meetup-2026",
    time: "07:00 PM - 09:30 PM",
    date: "May 28, 2026",
    location: "London, UK",
  },
  {
    title: "Cloud Native DevCon",
    image: "/images/event6.png",
    slug: "cloud-native-devcon-2026",
    time: "08:30 AM - 05:00 PM",
    date: "November 15, 2026",
    location: "Berlin, Germany",
  },
];
