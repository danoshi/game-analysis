import type { TeamSection } from "@/types/team";

//const CLOUDFRONT_URL = "https://dik6ttc5elg95.cloudfront.net";

export const teamSections: Record<number, TeamSection[]> = {
  1: [
    {
      id: "pressing",
      title: "Pressing",
      content: [
        { type: "heading", text: "High Press vs. Low Block" },
        {
          type: "paragraph",
          text: "Our lads push up in man‑to‑man to force errors. When they drop, we sit compact.",
        },
        {
          type: "list",
          items: [
            "Always press the back‑line.",
            "Cover passing lanes.",
            "Force play down the wings.",
          ],
        },
        {
          type: "image",
          src: "/images/pressing-diagram.png",
          alt: "Pressing shape diagram",
        },
      ],
    },
    {
      id: "build_up",
      title: "Build‑Up Play",
      content: [
        {
          type: "paragraph",
          text: "From the back we want to play short passes into the half‑spaces and free man.",
        },
        {
          type: "image",
          src: "/images/build-up.png",
          alt: "Build‑up arrows",
        },
      ],
    },
    {
      id: "set_pieces",
      title: "Set Pieces",
      content: [
        { type: "heading", text: "Corners" },
        {
          type: "paragraph",
          text: "At corners we aim for the near post flick‑on or the far post overload.",
        },
        {
          type: "list",
          items: [
            "2 runners to near post",
            "1 overload far post",
            "1 recycled at top of box",
          ],
        },
      ],
    },
    {
      id: "team_notes",
      title: "What to Watch For",
      content: [
        {
          type: "paragraph",
          text: "They love to switch play quickly — be ready to shift across.",
        },
      ],
    },
  ],

  // You can add more teams here:
  2: [
    /* … sections for team with id=2 … */
  ],
};
