/** Shapes shared by page content files (agentic-ai-content.ts, infra-automation-content.ts, …). */

export interface ImpactItem {
  kicker: string;
  tone: 'teal' | 'purple' | 'green';
  icon: 'grid' | 'trend' | 'spark' | 'bolt';
  title: string;
  /** Optional bold phrase inside the text: textLead + strong + text */
  textLead?: string;
  strong?: string;
  text: string;
  image: string;
}

/** "Business impact" section: three rows with a sticky side menu and a closing product banner. */
export interface ImpactContent {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  lead: string;
  items: ImpactItem[];
  action: { kicker: string; title: string; text: string; cta: string; href: string };
}

/** Service page hero: headline + lead left, image with three floating chips right. */
export interface HeroContent {
  titleLead: string;
  titleAccent: string;
  lead: string;
  image: string;
  imageAlt: string;
  /** Optional headline with several blue phrases (overrides titleLead/titleAccent), e.g. APIs that turn [legacy] into [leverage.] */
  titleSegments?: { text: string; accent?: boolean; breakAfter?: boolean }[];
  /** pos: where the chip sits on the image (defaults by order: top-right, mid-right, bottom-left); sub: optional second line */
  chips: { label: string; tone: 'blue' | 'yellow'; sub?: string; pos?: 'top-right' | 'mid-right' | 'bottom-left' }[];
}

export interface HelpPoint { term?: string; text: string; }
export interface HelpOption { name: string; text: string; bestWhen: string; }
export interface HelpTab {
  label: string;
  tone: 'blue' | 'purple' | 'yellow' | 'plum';
  icon: 'code' | 'target' | 'helmet' | 'database' | 'legacy' | 'orbit' | 'cloud' | 'document' | 'chat';
  /** Small uppercase label above the title */
  kicker?: string;
  title: string;
  intro?: string;
  points?: HelpPoint[];
  options?: HelpOption[];
  note?: string;
  image: string;
  imageAlt: string;
  resultText: string;
}
/** "How we help": heading and tabs left, the selected tab's photo and card right. */
export interface HelpContent {
  /** Eyebrow icon file name in assets/icons/eyebrow (default how-we-help) */
  eyebrowIcon?: string;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  lead: string;
  resultLabel: string;
  tabs: HelpTab[];
}

export interface DeliveryStep {
  label: string;
  title: string;
  tone: 'teal' | 'purple' | 'green' | 'rose';
  icon: 'radar' | 'chip' | 'chart' | 'code' | 'orbit' | 'database' | 'cloud' | 'shield';
  /** Optional one-line summary under the title */
  intro?: string;
  points: { strong?: string; text: string }[];
  link?: { label: string; href: string };
}
/** Pinned three-step section (card + ring). Scrolling steps through 01 → 03. */
export interface DeliveryContent {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  lead: string;
  /** Centre the heading block (eyebrow, title, lead) as in the API services design */
  centered?: boolean;
  steps: DeliveryStep[];
}

/** Product page hero: headline (with line breaks/blue phrases), lead, two buttons, logo in an orbit with four chips. */
export interface ProductHeroContent {
  title: { text: string; accent?: boolean; breakAfter?: boolean }[];
  lead: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  logo: string;
  logoAlt: string;
  /** Product colour for dots, chip dots and the glow */
  accent: string;
  /** Clockwise from top-left: top-left, top-right, bottom-left, bottom-right. tone: product colour or blue dot */
  chips: { label: string; tone: 'accent' | 'blue' }[];
  /** Orbit layout and motion (defaults follow the Dobby design). Angles are degrees clockwise from the top. */
  orbit?: {
    /** Inner ring radius in the 400-unit box (outer ring is 182). Default 120. */
    innerR?: number;
    /** Logo width as a % of the orbit box. Default 32. */
    logoSize?: number;
    /** Logo and chips float up and down in step with the dots. Offsets (in % of the orbit width) at the
     *  dots' "from" end; they reverse at the "to" end. QuickQode: logo 1.7, chips -0.9 (opposite ways). */
    bob?: { logo: number; chips: number };
    /** 'halo': one white disc with a soft shadow behind the logo (QuickQode); 'plain': logo only (FieldZapp);
     *  default: stacked fading layers (Dobby). */
    backdrop?: 'layers' | 'halo' | 'plain';
    /** Each dot swings between two angles on its ring. dur = one swing in seconds; delay offsets it. */
    dots?: { ring: 'inner' | 'outer'; from: number; to: number; solid: boolean; dur?: number; delay?: number }[];
  };
}

/** Two-column "what it is" block with a video on the right. videoUrl empty = placeholder poster. */
export interface ProductVideoContent {
  id: string;
  title: { text: string; accent?: boolean; breakAfter?: boolean }[];
  lead: string;
  poster: string;
  posterAlt: string;
  caption: string;
  duration: string;
  /** YouTube/Vimeo embed URL or an .mp4. Leave '' until the link is available. */
  videoUrl: string;
}

export interface CapabilityItem {
  name: string;
  title?: string;
  text: string;
  /** Optional link inside the text: the first occurrence of label becomes a link */
  link?: { label: string; href: string };
  image: string;
}
/** Auto-advancing capability list with a photo deck (Infra automation, product pages). */
export interface CapabilitiesContent {
  eyebrow?: string;
  eyebrowIcon?: string;
  titleLead?: string;
  titleAccent?: string;
  lead?: string;
  /** Optional row of feature pills under the heading; the one at activePill is outlined */
  pills?: string[];
  activePill?: number;
  intervalMs: number;
  items: CapabilityItem[];
}

/** Yellow closing band: heading, lead, one or two buttons. */
export interface CtaBandContent {
  titleLead: string;
  titleAccent: string;
  lead: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}
