export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

/**
 * Real client quotes only — do not invent named people. Add entries as objects:
 *   { quote: "…", author: "Real name or 'Upwork client'", role: "Project / company" }
 * Use real Upwork review snippets (public review text) or testimonials you have
 * permission to publish. The Testimonials section auto-hides while this is empty.
 */
export const testimonials: Testimonial[] = [];
