import { createI18n } from "vue-i18n";

import zh from "./modules/zh";
import tc from "./modules/tc";
import en from "./modules/en";

const messages: Record<string, Record<string, string>> = {
  zh,
  tc,
  en,
};

const lang = localStorage.getItem("language");

const i18n = createI18n({
  locale: lang || "zh", //默认语言
  legacy: false, // 如果要支持 compositionAPI，此项必须设置为 false
  globalInjection: true, // 全局注册$t方法
  messages,
});

/** @description 设置语言 */
const setLanguage = (index: 0 | 1 | 2) => {
  const langs = ["zh", "tc", "en"];
  const lang = langs[index];
  i18n.global.setLocaleMessage(lang, messages[lang]);
  i18n.global.locale.value = lang;
  localStorage.setItem("language", lang);
};

export default i18n;

export { setLanguage };
