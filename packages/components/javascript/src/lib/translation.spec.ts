import { DEFAULTS, PHRASE_PARAMETER_PLACEHOLDER } from "./constants";
import { resolveLanguageCode, t } from "./translation";

const translationsResource = {
  it: {
    hello: "Ciao",
  },
  en: {
    hello: "Hello",
  },
  de: {
    hello: `Hallo, ${PHRASE_PARAMETER_PLACEHOLDER}`,
  },
};

describe("translation", () => {
  describe("t", () => {
    beforeEach(() => document.documentElement.setAttribute("lang", "it"));
    it("should return the translation of the given key", () => {
      const translation = t("hello", {
        translationsResource,
      });
      expect(translation).toBe("Ciao");
    });
    it(`should return the translation in ${DEFAULTS.language} if translation is not available for the given language (not in Phrase)`, () => {
      document.documentElement.setAttribute("lang", "xx");
      const translation = t("hello", {
        translationsResource,
      });
      expect(translation).toBe("Hello");
    });
    it("should return the translation of the given key and param", () => {
      document.documentElement.setAttribute("lang", "de");
      const translation = t("hello", {
        param: "jack",
        translationsResource,
      });
      expect(translation).toBe("Hallo, jack");
    });
    it("if strict is true, should respect the provided language and return an existing translation", () => {
      document.documentElement.setAttribute("lang", "de");
      const translation = t("hello", {
        language: "en",
        strict: true,
        translationsResource,
      });
      expect(translation).toBe("Hello");
    });
    it("if strict is true, and param is given with translation placeholder, should return an existing translation", () => {
      document.documentElement.setAttribute("lang", "de");
      const translation = t("hello", {
        param: "jack",
        strict: true,
        translationsResource,
      });
      expect(translation).toBe("Hallo, jack");
    });
    it("if strict is true, and param is given with no translation placeholder, should return an existing translation", () => {
      document.documentElement.setAttribute("lang", "it");
      const translation = t("hello", {
        param: "jack",
        strict: true,
        translationsResource,
      });
      expect(translation).toBe("Ciao");
    });
    it("if strict is true, and param is given with translation placeholder, should respect the provided language and return an existing translation", () => {
      document.documentElement.setAttribute("lang", "de");
      const translation = t("hello", {
        language: "en",
        param: "jack",
        strict: true,
        translationsResource,
      });
      expect(translation).toBe("Hello");
    });
    it("if strict is true, should throw an error if the given translation key does not exist", () => {
      document.documentElement.setAttribute("lang", "de");
      expect(() =>
        t("not_found", {
          param: "jack",
          strict: true,
          translationsResource,
        })
      ).toThrow(
        new Error(
          'No translations found for "not_found" key. Please add the translation to de or "en" language file.'
        )
      );
    });
    it("if strict is false, and param is given, should return the provided param if the given translation key is not found", () => {
      document.documentElement.setAttribute("lang", "de");
      const translation = t("not_found", {
        param: "jack",
        strict: false,
        translationsResource,
      });
      expect(translation).toBe("jack");
    });
    it("should throw an error if the translation is not found", () => {
      expect(() => t("not_found", { translationsResource })).toThrow(
        new Error(
          'No translations found for "not_found" key. Please add the translation to it or "en" language file.'
        )
      );
    });
  });

  describe("resolveLanguageCode", () => {
    beforeEach(() => document.documentElement.setAttribute("lang", "it"));
    it("should return the resolved language code based on the detected language code", () => {
      document.documentElement.setAttribute("lang", "bs");
      const resolvedCode = resolveLanguageCode();
      expect(resolvedCode).toBe("oo");
    });

    it("should accept language in uppercase", () => {
      const resolvedCode = resolveLanguageCode("IT");
      expect(resolvedCode).toBe("it");
    });

    it("should accept oo_la language code", () => {
      const resolvedCode = resolveLanguageCode("oo_la");
      expect(resolvedCode).toBe("oo_la");
    });

    it("should return a language code if found from the list of supported languages and if not a valid w3w supported language", () => {
      const resolvedCode = resolveLanguageCode("de");
      expect(resolvedCode).toBe("de");
    });

    it(`should return ${DEFAULTS.language} if not found from the list of supported languages and if not a valid w3w supported language`, () => {
      // bosnian which is supported by w3w-api as oo
      const resolvedCode = resolveLanguageCode("bs");
      expect(resolvedCode).toBe(DEFAULTS.language);
    });

    it("should return the detected language code if no language code is provided", () => {
      const resolvedCode = resolveLanguageCode();
      expect(resolvedCode).toBe("it");
    });
  });
});
