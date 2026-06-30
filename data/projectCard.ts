import type { ProjectMotifData } from "@/components/ProjectMotif";
import type { ProjectArchitecture } from "@/components/ProjectArchitecture";

export type ProjectCard = {
  title: string;
  summary: string;
  tags: string[];
  href?: string;
  demoUrl?: string;
  outcome?: string;
  /** Drives card ordering (desc) and which card is the homepage hero (index 0 after sort). */
  complexityScore: number;
  motif?: ProjectMotifData;
  /** Architecture-as-art card visual. Renders only when present; otherwise falls back to motif. */
  architecture?: ProjectArchitecture;
  /** Optional real banner image (screenshot). Takes precedence over the diagram. */
  bannerImage?: string;
};
