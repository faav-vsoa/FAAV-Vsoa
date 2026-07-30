const I18N = (function(){
  var currentLang = 'es';
  var translations = {};
  var observers = [];

  function notify() {
    observers.forEach(function(cb){ cb(currentLang); });
  }

  function setLang(lang) {
    if (translations[lang]) {
      currentLang = lang;
      localStorage.setItem('faav_lang', lang);
      applyTranslations();
      notify();
    }
  }

  function getLang() {
    return currentLang;
  }

  function onLangChange(cb) {
    observers.push(cb);
  }

  function t(key) {
    var keys = key.split('.');
    var obj = translations[currentLang];
    for (var i = 0; i < keys.length; i++) {
      if (!obj) return key;
      obj = obj[keys[i]];
    }
    return obj || key;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var html = t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.type === 'submit' || el.type === 'button') el.value = html;
        else el.placeholder = html;
      } else {
        el.innerHTML = html;
      }
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function(el){
      var parts = el.getAttribute('data-i18n-attr').split('|');
      var attr = parts[0];
      var key = parts[1];
      el.setAttribute(attr, t(key));
    });
    document.documentElement.lang = currentLang;
  }

  function load(lang, cb) {
    fetch('i18n/' + lang + '.json')
      .then(function(r){ return r.json(); })
      .then(function(data){
        translations[lang] = data;
        if (!translations[currentLang]) currentLang = lang;
        if (cb) cb();
      })
      .catch(function(e){
        console.error('i18n load error:', e);
        if (cb) cb();
      });
  }

  function init() {
    var saved = localStorage.getItem('faav_lang');
    if (saved && translations[saved]) currentLang = saved;
    load('es', function(){
      load('en', function(){
        applyTranslations();
        var switcher = document.getElementById('lang-switcher');
        if (switcher) {
          switcher.textContent = currentLang.toUpperCase();
          switcher.addEventListener('click', function(){
            setLang(currentLang === 'es' ? 'en' : 'es');
            switcher.textContent = currentLang.toUpperCase();
          });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    t: t,
    setLang: setLang,
    getLang: getLang,
    onLangChange: onLangChange,
    applyTranslations: applyTranslations
  };
})();