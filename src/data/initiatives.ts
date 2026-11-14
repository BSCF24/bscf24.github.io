import initiativesData from './initiatives.json';

export interface ProjectVideoItem {
  id: string;
  category: 'reel' | 'ovc' | 'podcast';
  title: string;
  theme: string;
  duration: string;
  date: string;
  description: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export interface ProjectPublicationItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  date: string;
  organization?: string;
  summary: string;
  tags?: string[];
  image?: string;
  imageCaption?: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
  subtext?: string;
}

export interface PolicyRecommendation {
  num: number;
  title: string;
  desc: string;
}

export interface RoadmapPhase {
  period: string;
  title: string;
  desc: string;
}

export interface ImpactSection {
  id: string;
  badge: string;
  badgeType?: 'case-study' | 'policy-brief';
  title: string;
  subtitle: string;
  lead?: string;
  narrative?: string[];
  highlightBox?: {
    tag: string;
    title: string;
    text: string;
  };
  metricsTitle?: string;
  metrics?: ImpactMetric[];
  challenge?: {
    title: string;
    text: string;
  };
  recommendationsTitle?: string;
  recommendations?: PolicyRecommendation[];
  roadmapTitle?: string;
  roadmap?: RoadmapPhase[];
  image?: string;
  imageCaption?: string;
}

export interface InitiativeItem {
  slug: string;
  title: string;
  date: string;
  tag: string;
  description: string;
  featured: string;
  images: string[];
  body: string;
  rawBody: string;
  fileType: string;
  video?: string;
  videos?: ProjectVideoItem[];
  impactSections?: ImpactSection[];
  publications?: ProjectPublicationItem[];
}

export { getVideoEmbedInfo, getYouTubeEmbedUrl, type VideoEmbedInfo } from '../utils/video';

// Specific ordered list matching the exact 11ty collection order
const slugOrder: string[] = [
  "heritage_hiking",
  "utsobe_sobai",
  "telescope_innovation_session",
  "democracy-in-reels",
  "democracy-in-reels-impact",
  "technicalworkshop",
  "stem_telescope_observation",
  "stem-online-session",
  "she-stem-fireside-Chat",
  "research_methodology_session",
  "project3",
  "paneldiscussion",
  "human_resource_management",
  "futurestemleaders",
  "business-fundamentals-workshop",
  "astronomy_group_project",
  "astro-session",
  "bscf_digital_communication",
  "astrophotography",
  "2ndastrocamp-finale",
  "women_in_stem",
  "future_stem_leaders_launch",
  "youth_capacity_bootcamp_2025",
  "project2",
  "astrocamp2024",
  "project5",
  "project4"
];

export function getInitiatives(): InitiativeItem[] {
  const map = new Map<string, InitiativeItem>(
    (initiativesData as InitiativeItem[]).map(item => [item.slug, item])
  );
  return slugOrder.map(slug => map.get(slug)).filter((item): item is InitiativeItem => Boolean(item));
}

export function getInitiativeBySlug(slug: string): InitiativeItem | undefined {
  return (initiativesData as InitiativeItem[]).find(item => item.slug === slug);
}

export function formatInitiativeDate(dateStr?: string): string {
  if (!dateStr) {
    // If no date was specified, Eleventy used the build date
    return new Date().toDateString();
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toDateString() : d.toDateString();
}

export function slugify(str?: string): string {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default getInitiatives;