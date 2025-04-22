import type { TeamSection } from "@/types/team";

//const CLOUDFRONT_URL = "https://dik6ttc5elg95.cloudfront.net";

export const teamSections: Record<number, TeamSection[]> = {
  1: [
    {
      id: "pressing",
      title: "TBD",
      content: [
        { type: "heading", text: "TBD" },
        {
          type: "paragraph",
          text: "TBD",
        },
        {
          type: "list",
          items: ["TBD"],
        },
        {
          type: "image",
          src: "/images/pressing-diagram.png",
          alt: "TBD",
        },
      ],
    },
    {
      id: "build_up",
      title: "TBD",
      content: [
        {
          type: "paragraph",
          text: "TBD",
        },
        {
          type: "image",
          src: "/images/build-up.png",
          alt: "TBD",
        },
      ],
    },
    {
      id: "set_pieces",
      title: "TBD",
      content: [
        { type: "heading", text: "TBD" },
        {
          type: "paragraph",
          text: "TBD",
        },
        {
          type: "list",
          items: ["TBD"],
        },
      ],
    },
    {
      id: "team_notes",
      title: "TBD",
      content: [
        {
          type: "paragraph",
          text: "TBD",
        },
      ],
    },
  ],

  // You can add more teams here:
  2: [
    /* … sections for team with id=2 … */
  ],
};
