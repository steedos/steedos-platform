

/**
 * Returns the locale string of the user locale
 */
export const getLocale = (userLocale: string) => {
  let locale: string;
  if (userLocale === 'zh-cn') {
    locale = "zh-CN";
  } else if (userLocale == 'en-us') {
    locale = "en";
  } else {
    locale = "zh-CN";
  }
  return locale;
}

/**
 * Returns the locale string of the user
 */
export const getUserLocale = (user: any) => {
  let userLocale = user && user.locale && user.locale.toLocaleLowerCase();
  return getLocale(userLocale);
}