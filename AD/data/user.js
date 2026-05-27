export const user = {
  id: "u_01",
  name: "Alex Rivera",
  email: "alex.rivera@example.com",
  avatar: "https://ui.avatars.com/api/?name=Alex+Rivera&background=111827&color=60a5fa",
  bio: "Product-minded engineer. Loves late-night hacks and good coffee.",
  interests: ["AI", "Design", "Startups"],
  social: {
    linkedin: "https://linkedin.com/in/alexrivera",
    github: "https://github.com/alexrv",
  },
};

export const activity = [
  { id: "a1", type: "booking", text: "Booked 2 tickets — Code & Coffee Sprint", when: "2h ago" },
  { id: "a2", type: "wishlist", text: "Saved Stripe Dev Day", when: "yesterday" },
  { id: "a3", type: "checkin", text: "Checked in Campus Demo Day", when: "3d ago" },
];

export const badges = [
  { id: "b1", title: "Tech Explorer", desc: "Visited 5+ events" },
  { id: "b2", title: "Frequent Attendee", desc: "10+ tickets" },
];

export function getMockProfile() {
  return user;
}
