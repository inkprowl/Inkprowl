export type DownloadFormat = "jpg" | "png" | "webp";

export type Artwork = {
  slug: string;
  title: string;
  category: string;
  description: string;
  isPremium: boolean;
  accent: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  orientation: "portrait" | "landscape" | "square";
  tags: string[];
  downloadFormats?: DownloadFormat[];
};

type MediaField = "imageUrl" | "audioUrl" | "videoUrl";

export type SiteMedia = {
  heroFilmUrl?: string;
  defaultArtworkFilmUrl?: string;
  soundtrackUrl?: string;
  soundtrackTitle: string;
};

export type SiteBranding = {
  logoUrl?: string;
  heroBannerUrl?: string;
  heroTitle: string;
  heroKicker: string;
};

export type SponsoredCampaign = {
  enabled: boolean;
  label: string;
  clientName: string;
  videoUrl?: string;
};

export type AdvertisingSettings = {
  adsenseEnabled: boolean;
  adsterraEnabled: boolean;
};

/** Only stable Cloudinary delivery URLs are permitted for permanent INKPROWL media. */
export const isCloudinaryDeliveryUrl = (url: string) =>
  /^https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\//.test(url);

export function validateArtworkMedia(artwork: Artwork) {
  const mediaFields: MediaField[] = ["imageUrl", "audioUrl", "videoUrl"];
  for (const field of mediaFields) {
    const url = artwork[field];
    if (url && !isCloudinaryDeliveryUrl(url)) {
      throw new Error(`${artwork.slug}: ${field} must be a Cloudinary delivery URL`);
    }
  }
}

export function validateSiteMedia(media: SiteMedia) {
  const mediaFields: (keyof Pick<SiteMedia, "heroFilmUrl" | "defaultArtworkFilmUrl" | "soundtrackUrl">)[] = ["heroFilmUrl", "defaultArtworkFilmUrl", "soundtrackUrl"];
  for (const field of mediaFields) {
    const url = media[field];
    if (url && !isCloudinaryDeliveryUrl(url)) {
      throw new Error(`siteMedia: ${field} must be a Cloudinary delivery URL`);
    }
  }
}

/** Owner-managed Cloudinary delivery settings. Leave a field empty until the matching asset is published in Cloudinary. */
export const siteMedia: SiteMedia = {
  heroFilmUrl: undefined,
  defaultArtworkFilmUrl: undefined,
  soundtrackUrl: undefined,
  soundtrackTitle: "Curated sound",
};

/** Owner-managed image branding. Only Cloudinary image delivery URLs are accepted. */
export const siteBranding: SiteBranding = {
  logoUrl: undefined,
  heroBannerUrl: undefined,
  heroKicker: "HUMAN-DIRECTED / AI-CRAFTED",
  heroTitle: "Art that prowls past the ordinary.",
};

/** A direct sponsored-client video can be published after the owner has approved its Cloudinary delivery URL. */
export const sponsoredCampaign: SponsoredCampaign = {
  enabled: false,
  label: "PRESENTED IN PARTNERSHIP",
  clientName: "A considered sponsor",
  videoUrl: undefined,
};

/** Static advertisement placements are only activated by the owner after the relevant provider code is approved. */
export const advertisingSettings: AdvertisingSettings = {
  adsenseEnabled: false,
  adsterraEnabled: false,
};

export const activeAdvertisementProviders = (settings: AdvertisingSettings = advertisingSettings) => [
  settings.adsenseEnabled ? "Google AdSense" : undefined,
  settings.adsterraEnabled ? "Adsterra" : undefined,
].filter((provider): provider is string => Boolean(provider));

export const availableDownloadFormats = (artwork: Artwork): DownloadFormat[] => artwork.downloadFormats ?? ["jpg", "png", "webp"];

export const getCloudinaryDownloadUrl = (imageUrl: string | undefined, slug: string, format: DownloadFormat) => {
  if (!imageUrl || !isCloudinaryDeliveryUrl(imageUrl) || !imageUrl.includes("/image/upload/")) return undefined;
  const filename = `inkprowl-${slug}-${format}`;
  return imageUrl.replace("/image/upload/", `/image/upload/f_${format},fl_attachment:${filename}/`);
};

export const getArtworkShareUrl = (slug: string) => `https://inkprowl.github.io/inkprowl/art/${slug}/`;

function validateCloudinaryImageUrl(url: string | undefined, field: string) {
  if (url && (!isCloudinaryDeliveryUrl(url) || !url.includes("/image/upload/"))) {
    throw new Error(`${field} must be a Cloudinary image delivery URL`);
  }
}

function validateCloudinaryVideoUrl(url: string | undefined, field: string) {
  if (url && (!isCloudinaryDeliveryUrl(url) || !url.includes("/video/upload/"))) {
    throw new Error(`${field} must be a Cloudinary video delivery URL`);
  }
}

export function validateOwnerConfiguration() {
  validateCloudinaryImageUrl(siteBranding.logoUrl, "siteBranding.logoUrl");
  validateCloudinaryImageUrl(siteBranding.heroBannerUrl, "siteBranding.heroBannerUrl");
  validateCloudinaryVideoUrl(sponsoredCampaign.videoUrl, "sponsoredCampaign.videoUrl");
}

export const categories = [
  { name: "Business Animals", icon: "♜", count: 19 },
  { name: "Mafia Bosses", icon: "♛", count: 8 },
  { name: "Funny Animals", icon: "✦", count: 8 },
  { name: "Collectible Art", icon: "✧", count: 16 },
  { name: "Tailored Animals", icon: "✂", count: 11 },
  { name: "Vintage Comic Art", icon: "▣", count: 13 },
  { name: "Cross-Hatching", icon: "╱", count: 14 },
  { name: "2D Line Art", icon: "⌁", count: 9 },
  { name: "Animal Characters", icon: "◉", count: 22 },
  { name: "Fashion Animals", icon: "◈", count: 7 },
  { name: "Premium Art", icon: "✩", count: 10 },
  { name: "Free Art", icon: "↓", count: 18 },
];

export const artworks: Artwork[] = [
  { slug: "panther-in-pinstripe-suit", title: "Panther in Pinstripe Suit", category: "Mafia Bosses", description: "A composed panther steps out in a precisely tailored pinstripe suit, rendered as an archival cross-hatched study.", isPremium: true, accent: "coal", imageUrl: "https://res.cloudinary.com/y1pc8ocl/image/upload/v1787239768/inkprowl-panther-collectible-edition.png", orientation: "portrait", tags: ["panther", "tailoring", "engraving"] },
  { slug: "buffalo-tailor-shop", title: "Buffalo Tailor Shop Line Art Comic", category: "Business Animals", description: "Old workshop ritual, patient hands, and a buffalo tailor judging the fall of a new suit cloth.", isPremium: false, accent: "ochre", imageUrl: "https://res.cloudinary.com/y1pc8ocl/image/upload/v1787241850/buffalo-tailor-shop.png", orientation: "landscape", tags: ["buffalo", "tailor", "comic"] },
  { slug: "lion-king-of-the-ledger", title: "Lion, King of the Ledger", category: "Business Animals", description: "A measured lion executive at work among ledgers, fountain pens, and the quiet confidence of a corner office.", isPremium: false, accent: "gold", imageUrl: "https://res.cloudinary.com/y1pc8ocl/image/upload/v1787241901/lion-ledger.png", orientation: "portrait", tags: ["lion", "office", "line art"] },
  { slug: "fox-after-hours-courier", title: "Fox, After-Hours Courier", category: "Funny Animals", description: "A clever fox brings a midnight dispatch through a sleeping city in a sharply cut messenger coat.", isPremium: false, accent: "rust", imageUrl: "https://res.cloudinary.com/y1pc8ocl/image/upload/v1787241886/fox-courier.png", orientation: "portrait", tags: ["fox", "city", "comic"] },
  { slug: "bear-bull-market", title: "Bear & Bull Market", category: "Collectible Art", description: "A bear negotiates the market’s next move with a vintage desk lamp, a marked ledger, and dry humour.", isPremium: true, accent: "umber", imageUrl: "https://res.cloudinary.com/y1pc8ocl/image/upload/v1787241921/bear-market.png", orientation: "square", tags: ["bear", "market", "collectible"] },
  { slug: "panther-in-the-prowl", title: "Panther in the Prowl", category: "Cross-Hatching", description: "A panther climbs through an old wooded estate; a pure line-art edition with an engraved paper texture.", isPremium: true, accent: "forest", imageUrl: "https://res.cloudinary.com/y1pc8ocl/image/upload/v1787239768/inkprowl-panther-collectible-edition.png", orientation: "portrait", tags: ["panther", "forest", "cross hatching"] },
  { slug: "penguin-office-hour", title: "Penguin, Office Hour", category: "Funny Animals", description: "A quietly comic portrait of the most punctilious member of the Monday morning meeting.", isPremium: false, accent: "slate", orientation: "portrait", tags: ["penguin", "office", "free art"] },
  { slug: "the-donkeys-new-vest", title: "The Donkey’s New Vest", category: "Tailored Animals", description: "A character study in fitted waistcoats, meticulous seams, and a perfectly misplaced sense of pride.", isPremium: false, accent: "sand", orientation: "landscape", tags: ["donkey", "tailoring", "character"] },
];

artworks.forEach(validateArtworkMedia);
validateSiteMedia(siteMedia);
validateOwnerConfiguration();

export const getArtwork = (slug: string) => artworks.find((artwork) => artwork.slug === slug);
export const relatedArtworks = (artwork: Artwork) => artworks.filter((candidate) => candidate.slug !== artwork.slug && candidate.category === artwork.category).slice(0, 3);
