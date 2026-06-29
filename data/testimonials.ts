export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/**
 * PLACEHOLDERS — replace with real client quotes before merging to main.
 * Do not invent named people. Use real Upwork review snippets (with the
 * reviewer's permission / public review text) or remove entries you can't source.
 * The section renders nothing when this array is empty.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Replace this with a real client quote that highlights the outcome you delivered and what it was like to work with you.",
    author: "Client name",
    role: "Upwork client · Web platform",
  },
  {
    quote:
      "A second short quote works well here — one or two sentences focused on reliability, communication, or impact.",
    author: "Client name",
    role: "Upwork client · Automation project",
  },
  {
    quote:
      "Keep quotes concise and specific. Numbers and concrete results land harder than generic praise.",
    author: "Client name",
    role: "Enterprise stakeholder",
  },
];
