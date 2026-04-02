import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function getTranslated(item, lang) {
  if (!item) {
    return item;
  }
  
  const translatedItem = { ...item };
  
  if (item.translations) {
    const translations = item.translations;

    const applyTranslations = (target, sourceLang) => {
      if (translations[sourceLang]) {
        for (const key in translations[sourceLang]) {
          if (Object.prototype.hasOwnProperty.call(translations[sourceLang], key)) {
            target[key] = translations[sourceLang][key];
          }
        }
      }
    };

    applyTranslations(translatedItem, lang);

    if (lang !== 'en' && translations.en) {
      for (const key in translations.en) {
        if (Object.prototype.hasOwnProperty.call(translations.en, key)) {
          if (!translatedItem[key] || (typeof translatedItem[key] === 'string' && translatedItem[key].trim() === '')) {
            translatedItem[key] = translations.en[key];
          }
        }
      }
    }
  }

  if (translatedItem.categories && Array.isArray(translatedItem.categories)) {
    translatedItem.categories = translatedItem.categories.map(categoryJoin => {
      if (categoryJoin && categoryJoin.categories) {
        const translatedCategory = getTranslated(categoryJoin.categories, lang);
        return {
          ...categoryJoin,
          categories: translatedCategory
        };
      }
      return categoryJoin;
    });
  }
  
  if (translatedItem.category) {
    translatedItem.category = getTranslated(translatedItem.category, lang);
  }
  
  delete translatedItem.translations;

  return translatedItem;
}