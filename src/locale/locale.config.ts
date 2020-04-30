export type Lang = 'ru' | 'en';

export function getLocaleConfig() {
  return {
    lang: process.env.smp_locale as Lang
  };
}
