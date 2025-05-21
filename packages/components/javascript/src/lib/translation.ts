import { baseLanguageCodeForISO6391, validLanguage } from "@what3words/api";

import * as resources from "../translations";
import { DEFAULTS, PHRASE_PARAMETER_PLACEHOLDER } from "./constants";
import { isKey } from "./utils";

/**
 * Wordlist language code mapping.
 * `apiLangCode` - is the language code that what3words api uses, while
 * `iso6392` - is the language code that most browser uses. (using lowercase for case insensitive comparison)
 * This is then mapped to the language code that phrase translations use
 */
type apiLangCode = string;
type iso6392 = string;
type LanguageMap = Record<apiLangCode, Record<iso6392, string>>;

/**
 * Mapping of language codes. This is used to map the language code from phrase and the browser to the language code that the public api use.
 * Add more mapping here where needed.
 */
const LANGUAGE_MAP: Readonly<LanguageMap> = {
  kk: { kk: "kk_cyrl" }, // kazakh
  mn: { mn: "mn" }, // mongolian
  zh: { "zh-cn": "zh_cn", zh: "zh_cn" }, // chinese
  zh_tr: { "zh-tw": "zh_tw", "zh-hk": "zh_hk" }, // chinese traditional
  pt: { "pt-pt": "pt_pt", "pt-br": "pt_br" }, // portuguese
  oo: { sr: "sr", hr: "hr", bs: "bs" }, // serbo-croatian
};

/**
 * Detect the language code based on the html lang and navigator language
 * Html tag is prioritised over the navigator language
 * NOTE: not aware of parent component's language property
 */
const detectLanguage = () =>
  document.documentElement.getAttribute("lang") ||
  window.navigator.language ||
  DEFAULTS.language;

/**
 * Retrieves the phrase translations of a given what3words api language code
 * i.e.: `zh_tr` returns `zh_tw` translations
 * @param apiLangCode - language code recognized by the public api
 * @returns phrase translation object
 */
function getPhraseTranslations(
  apiLangCode: string,
  translationsResource?: Record<string, Record<string, string>>
) {
  const detectedLanguage = detectLanguage();
  const iso6392 = detectedLanguage.toLowerCase();

  const detectedCode = LANGUAGE_MAP[apiLangCode]?.[iso6392];
  const baseCode = baseLanguageCodeForISO6391(apiLangCode);
  const code = detectedCode || baseCode || DEFAULTS.language;

  let translations;
  if (isKey(resources, code)) {
    translations = (translationsResource ?? resources)[code];
  }

  return translations;
}

/**
 * Retrieves the language code that the public api uses based on the language code from the browser.
 * @param languageCode ISO-639-1 or ISO-639-2 language code
 * @returns supported language code for the public api server
 */
function getApiLanguageCodeFromLanguageMap(languageCode: string): string {
  // Retrieve the language code from the mapping object
  // Scenario 1: the language code is in the mapping, then use the key from the mapped language code
  // Scenario 2: the language code is not in the mapping, then get the language code from the supported languages (if ISO-639-1 or ISO-639-2)
  // Scenario 3: the language code is from the supported languages that our api supports (i.e.: oo_la, oo_cy, kk_la etc.) then use the language code as it is.
  const apiLanguageCode =
    Object.keys(LANGUAGE_MAP).find(
      (key) => LANGUAGE_MAP[key]?.[languageCode.toLowerCase()]
    ) ||
    baseLanguageCodeForISO6391(languageCode) ||
    (validLanguage(languageCode) && languageCode);

  // Scenario 4: the language code is not in the mapping and not in the supported languages,
  //             then use `DEFAULTS.language` which is `en` and warn the user that it's defaulting to `en`
  if (!apiLanguageCode) {
    console.warn(
      `Invalid or unsupported language (\`${languageCode}\`), using default language (\`${DEFAULTS.language}\`) for autosuggest results instead.`
    );
  }
  return apiLanguageCode || DEFAULTS.language;
}

/**
 * Translates the given key from phrase translation resources
 * @param key             translation key
 * @param opt             translation options
 * @param opt.param       value to interpolate into PHRASE_PARAMETER_PLACEHOLDER if present in translation key
 * @param opt.language    override auto-detected browser language used to query translation resources
 * @param opt.strict      if false, silences translation key runtime errors
 * @returns               translation of the given key
 * @throws                translation error
 */
export function t(
  key: string,
  opt: {
    param?: string;
    language?: string;
    strict?: boolean;
    translationsResource?: Record<string, Record<string, string>>;
  } = {}
): string {
  const {
    param = "",
    language = detectLanguage(),
    strict = true,
    translationsResource,
  } = opt;
  const apiLanguageCode = getApiLanguageCodeFromLanguageMap(language);
  const translations = getPhraseTranslations(
    apiLanguageCode,
    translationsResource
  );

  let translation = "";
  if (translations && isKey(translations, key)) {
    translation = translations[key];
  }

  if (!translation && strict) {
    throw new Error(
      `No translations found for "${key}" key. Please add the translation to ${language} or "${DEFAULTS.language}" language file.`
    );
  }

  // if param is a string, attempt to inject into translation placeholder
  if (typeof param === "string" && param.length > 0) {
    if (translation) {
      // inject if translation exists
      translation = translation.replace(PHRASE_PARAMETER_PLACEHOLDER, param);
    } else {
      // if not, set translation to the param
      translation = param;
    }
  }

  return translation;
}

/**
 * Resolves the language code based on the provided language code.
 * This will validate the language code if it's supported by our what3words api.
 * Uses `en` as the default language code if no language code is provided or if it's not on the list of supported languages.
 */
export function resolveLanguageCode(languageCode?: string): string {
  if (!languageCode) return getApiLanguageCodeFromLanguageMap(detectLanguage());
  if (!validLanguage(languageCode)) {
    console.warn(
      `Invalid or unsupported language (\`${languageCode}\`), using default language (\`${DEFAULTS.language}\`) for autosuggest results instead.`
    );
    return DEFAULTS.language;
  }
  return languageCode.toLowerCase();
}
