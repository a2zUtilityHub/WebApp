export const ADSENSE_CLIENT_ID = 'ca-pub-9198321800783167';

export const AD_FORMATS = {
  AUTO: 'auto',
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  RECTANGLE: 'rectangle'
};

export const AD_SLOTS = {
  HOME_HERO_BOTTOM: 'home_hero_bottom',
  HOME_IN_CONTENT: 'home_in_content',
  HOME_FOOTER: 'home_footer',
  SIDEBAR_VERTICAL: 'sidebar_vertical',
  IN_FEED: 'in_feed',
  BOTTOM_BANNER: 'bottom_banner'
};

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280
};

export const shouldDisplayAds = (pageType) => {
  const disabledPages = ['checkout', 'auth', 'payment'];
  return !disabledPages.includes(pageType);
};

export const getFormatForViewport = (width) => {
  if (width < BREAKPOINTS.MOBILE) return AD_FORMATS.RECTANGLE;
  if (width < BREAKPOINTS.TABLET) return AD_FORMATS.AUTO;
  return AD_FORMATS.HORIZONTAL;
};