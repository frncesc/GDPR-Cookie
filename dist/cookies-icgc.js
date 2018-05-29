(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.icgc = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){
module.exports={"version":"0.0.1"}
},{}],2:[function(_dereq_,module,exports){
"use strict";var CookieManager=function(){};CookieManager.getCookie=function(e){var o=document.cookie.match("(^|;) ?"+e+"=([^;]*)(;|$)");return o?o[2]:null},CookieManager.hasCookie=function(e){return null!==CookieManager.getCookie(e)},CookieManager.setCookie=function(e,o,i,n,t){var a=new Date;a.setTime(a.getTime()+864e5*i);var r=e+"="+o+";expires="+a.toGMTString();r+=t?";path="+t:";path=/",n&&(r+=";domain="+n),document.cookie=r},CookieManager.deleteCookie=function(e,o,i){this.setCookie(e,"",-1,o,i)},CookieManager.getAllCookies=function(){var e={};return document.cookie.split(";").forEach(function(o){var i=o.split("=");e[i[0]]=i[1]}),e},module.exports=CookieManager;
},{}],3:[function(_dereq_,module,exports){
"use strict";var defaultOptions=_dereq_("./defaultOptions"),cookieManager=_dereq_("./cookieManager"),util=_dereq_("./util"),Popup=_dereq_("./popup"),Cookieconsent=function(t){this.status={deny:"deny",allow:"allow"},this.options=defaultOptions,util.isPlainObject(t)&&Object.assign(this.options,t),this.options.userAgent=navigator.userAgent,this.options.isMobile=util.isMobile(this.options.userAgent)};Cookieconsent.prototype.createPopup=function(){var t=this;return new Promise(function(o){var e=new Popup(t.options);e.setAllowHandler(function(){t.setStatus(t.status.allow),e.close()}),e.setDenyHandler(function(){t.setStatus(t.status.deny),e.close()}),o(e)})},Cookieconsent.prototype.hasAnswered=function(){return Object.keys(this.status).indexOf(this.getStatus())>=0},Cookieconsent.prototype.hasConsented=function(){return this.getStatus()===this.status.allow},Cookieconsent.prototype.setStatus=function(t){var o=this.options.cookie,e=cookieManager.getCookie(o.name),n=Object.keys(this.status).indexOf(e)>=0;Object.keys(this.status).indexOf(t)>=0?(cookieManager.setCookie(o.name,t,o.expiryDays,o.domain,o.path),this.createConfigButton(),this.options.onStatusChange.call(this,t,n)):this.clearStatus()},Cookieconsent.prototype.getStatus=function(){return cookieManager.getCookie(this.options.cookie.name)},Cookieconsent.prototype.clearStatus=function(){var t=this.options.cookie;cookieManager.deleteCookie(t.name,t.domain,t.path)},Cookieconsent.prototype.onInit=function(){this.hasConsented()&&this.createConfigButton()},Cookieconsent.prototype.createConfigButton=function(){var t=this,o=this.options.configBtnSelector;""!==o.trim()&&(document.querySelector(o).innerHTML=this.options.configBtn,document.querySelector(".cc-config").addEventListener("click",function(){return t.onResetConfig()}))},Cookieconsent.prototype.removeConfigButton=function(){if(""!==this.options.configBtnSelector.trim()){var t=document.querySelector(".cc-config");t&&t.remove()}},Cookieconsent.prototype.onResetConfig=function(){this.removeConfigButton(),this.options.onResetConfig()},module.exports=Cookieconsent;
},{"./cookieManager":2,"./defaultOptions":5,"./popup":7,"./util":8}],4:[function(_dereq_,module,exports){
"use strict";var CookieConsent=_dereq_("./cookieconsent"),CookieManager=_dereq_("./cookieManager"),defaultOptions=_dereq_("./defaultOptions"),CookiesICGC=function(e,o,i){var n=this,t=Object.assign({},defaultOptions,i);t.cookie.domain=e,t.onInitialise=function(){n.onInit()},t.onStatusChange=function(){n.onChange()},t.onResetConfig=function(){n.onResetConfig()},this.areCookiesEnabled=!1,this.gaDisablePrefix="ga-disable-",this.gaIds=o,this.cookiesEnabledHandler=null,this.cookiesDisabledHandler=null,this.cookieConsent=new CookieConsent(t),this.onInit(),this.hasAnswered()?this.cookieConsent.createConfigButton():this.cookieConsent.createPopup()};CookiesICGC.prototype.onInit=function(){this.hasConsented()?this.enableCookies():this.disableCookies(),this.cookieConsent.onInit()},CookiesICGC.prototype.onChange=function(){this.hasConsented()?(CookieManager.setCookie("gaEnable","true",365),this.enableCookies()):this.disableCookies()},CookiesICGC.prototype.onResetConfig=function(){this.deleteCookies(),this.cookieConsent.createPopup()},CookiesICGC.prototype.hasConsented=function(){return this.cookieConsent.hasConsented()},CookiesICGC.prototype.hasAnswered=function(){return this.cookieConsent.hasAnswered()},CookiesICGC.prototype.setCookiesEnableHandler=function(e){this.cookiesEnabledHandler=e},CookiesICGC.prototype.enableCookies=function(){this.areCookiesEnabled=!0,this.enableGA(),this.cookiesEnabledHandler&&this.cookiesEnabledHandler()},CookiesICGC.prototype.setCookiesDisabledHandler=function(e){this.cookiesDisabledHandler=e},CookiesICGC.prototype.deleteCookies=function(){var e=CookieManager.getAllCookies();Object.keys(e).forEach(function(e){CookieManager.deleteCookie(e)})},CookiesICGC.prototype.disableCookies=function(){this.disableGA(),this.areCookiesEnabled=!1,this.cookiesDisabledHandler&&this.cookiesDisabledHandler()},CookiesICGC.prototype.areCookiesEnabled=function(){return this.areCookiesEnabled},CookiesICGC.prototype.enableGA=function(){this.changeGAStatusToDisabled(!1),CookieManager.setCookie("gaEnable","true",365)},CookiesICGC.prototype.disableGA=function(){this.changeGAStatusToDisabled(!0),CookieManager.hasCookie("gaEnable")&&CookieManager.setCookie("gaEnable","false",365)},CookiesICGC.prototype.changeGAStatusToDisabled=function(e){var o=this;this.gaIds.forEach(function(i){window[""+o.gaDisablePrefix+i]=e})},module.exports=CookiesICGC;
},{"./cookieManager":2,"./cookieconsent":3,"./defaultOptions":5}],5:[function(_dereq_,module,exports){
"use strict";module.exports={container:null,cookie:{name:"cookieconsentICGC_status",path:"/",domain:"file",expiryDays:365},content:{header:"Cookies utilitzades a la web!",message:"Utilitzem galetes per distingir-vos d'altres usuaris en els nostres webs, per millorar la informació i els serveis que us oferim, i per facilitar-vos l'accés. Per a més informació, consulteu la ",allow:"Acceptar",deny:"Rebutjar",link:"política de galetes",href:"http://www.icgc.cat/L-ICGC/Sobre-l-ICGC/Politiques/Politica-de-proteccio-de-dades-personals/Politica-de-galetes-cookies",close:"&#x274c;"},elements:{header:'<span class="cc-header">{{header}}</span>&nbsp;',message:'<span id="cookieconsent:desc" class="cc-message">{{message}}</span>',messagelink:'<span id="cookieconsent:desc" class="cc-message">{{message}} <a aria-label="learn more about cookies" role=button tabindex="0" class="cc-link" href="{{href}}" rel="noopener noreferrer nofollow" target="_blank">{{link}}</a></span>',allow:'<a aria-label="allow cookies" role=button tabindex="0"  class="cc-btn cc-allow">{{allow}}</a>',deny:'<a aria-label="deny cookies" role=button tabindex="0" class="cc-btn cc-deny">{{deny}}</a>',link:'<a aria-label="learn more about cookies" role=button tabindex="0" class="cc-link" href="{{href}}" target="_blank">{{link}}</a>',close:'<span aria-label="dismiss cookie message" role=button tabindex="0" class="cc-close">{{close}}</span>'},window:'<div role="dialog" aria-live="polite" aria-label="cookieconsent" aria-describedby="cookieconsent:desc" class="cc-window {{classes}}">\x3c!--googleoff: all--\x3e{{children}}\x3c!--googleon: all--\x3e</div>',configBtn:'<div class="cc-config {{classes}}">Configurar cookies</div>',configBtnSelector:"",compliance:'<div class="cc-compliance cc-highlight">{{deny}}{{allow}}</div>',layouts:{basic:"{{messagelink}}{{compliance}}","basic-close":"{{messagelink}}{{compliance}}{{close}}","basic-header":"{{header}}{{message}}{{link}}{{compliance}}"},layout:"basic",position:"bottom",theme:"block",palette:{popup:{background:"#222222"},button:{background:"#00b050"}}};
},{}],6:[function(_dereq_,module,exports){
"use strict";var version=_dereq_("../package.json").version,CookiesICGC=_dereq_("./cookiesIcgc");module.exports={version:version,CookiesICGC:CookiesICGC};
},{"../package.json":1,"./cookiesIcgc":4}],7:[function(_dereq_,module,exports){
"use strict";var util=_dereq_("./util"),Popup=function(t,e){this.statusList=e,this.allowHandler=null,this.denyHandler=null,this.options&&this.destroy(),this.options=t;var o=this.options.window.replace("{{classes}}",this.getPopupClasses().join(" ")).replace("{{children}}",this.getPopupInnerMarkup());this.element=this.appendMarkup(o),this.open()};Popup.prototype.destroy=function(){document.querySelector(".cc-allow").removeEventListener("click",this.allowHandler),document.querySelector(".cc-deny").removeEventListener("click",this.denyHandler),this.allowHandler=null,this.denyHandler=null,this.element&&this.element.parentNode&&this.element.parentNode.removeChild(this.element),this.element=null,this.options=null},Popup.prototype.open=function(){if(this.element)return this.isOpen()||(this.element.style.display="",util.removeClass(this.element,"cc-invisible"),this.options.onPopupOpen&&this.options.onPopupOpen()),this},Popup.prototype.close=function(){if(this.element)return this.isOpen()&&(this.element.style.display="none",this.options.onPopupClose&&this.options.onPopupClose()),this},Popup.prototype.isOpen=function(){return this.element&&""===this.element.style.display&&!util.hasClass(this.element,"cc-invisible")},Popup.prototype.getPositionClasses=function(){var t=this.options.position.split("-"),e=[];return t.forEach(function(t){e.push("cc-"+t)}),e},Popup.prototype.getPopupClasses=function(){var t=this.options,e="top"===t.position||"bottom"===t.position?"banner":"floating";t.isMobile&&(e="floating");var o=["cc-"+e,"cc-type-opt-in","cc-theme-"+t.theme];return t.static&&o.push("cc-static"),o.push.apply(o,this.getPositionClasses()),this.attachCustomPalette(this.options.palette),this.customStyleSelector&&o.push(this.customStyleSelector),o},Popup.prototype.getPopupInnerMarkup=function(){var t={},e=this.options;Object.keys(e.elements).forEach(function(o){t[o]=util.interpolateString(e.elements[o],function(t){var o=e.content[t];return t&&"string"==typeof o&&o.length?o:""})});var o=e.compliance;t.compliance=util.interpolateString(o,function(e){return t[e]});var n=e.layouts[e.layout];return n||(n=e.layouts.basic),util.interpolateString(n,function(e){return t[e]})},Popup.prototype.appendMarkup=function(t){var e=this.options,o=document.createElement("div"),n=e.container&&1===e.container.nodeType?e.container:document.body;o.innerHTML=t;var i=o.children[0];return i.style.display="none",util.hasClass(i,"cc-window")&&util.addClass(i,"cc-invisible"),n.firstChild?n.insertBefore(i,n.firstChild):n.appendChild(i),i},Popup.prototype.setAllowHandler=function(t){document.querySelector(".cc-allow").removeEventListener("click",this.allowHandler),this.allowHandler=t,document.querySelector(".cc-allow").addEventListener("click",t)},Popup.prototype.setDenyHandler=function(t){document.querySelector(".cc-deny").removeEventListener("click",this.denyHandler),this.denyHandler=t,document.querySelector(".cc-deny").addEventListener("click",t)},Popup.prototype.attachCustomPalette=function(t){var e=util.hash(JSON.stringify(t)),o="cc-color-override-"+e,n=util.isPlainObject(t);return this.customStyleSelector=n?o:null,n&&this.addCustomStyle(e,t,"."+o),n},Popup.prototype.addCustomStyle=function(t,e,o){var n={},i=e.popup,r=e.button,l=e.highlight;i&&(i.text=i.text?i.text:util.getContrast(i.background),i.link=i.link?i.link:i.text,n[o+".cc-window"]=["color: "+i.text,"background-color: "+i.background],n[o+" .cc-link,"+o+" .cc-link:active,"+o+" .cc-link:visited"]=["color: "+i.link],r&&(r.text=r.text?r.text:util.getContrast(r.background),r.border=r.border?r.border:"transparent",n[o+" .cc-btn"]=["color: "+r.text,"border-color: "+r.border,"background-color: "+r.background],"transparent"!==r.background&&(n[o+" .cc-btn:hover, "+o+" .cc-btn:focus"]=["background-color: "+util.getHoverColour(r.background)]),l?(l.text=l.text?l.text:util.getContrast(l.background),l.border=l.border?l.border:"transparent",n[o+" .cc-highlight .cc-btn:first-child"]=["color: "+l.text,"border-color: "+l.border,"background-color: "+l.background]):n[o+" .cc-highlight .cc-btn:first-child"]=["color: "+i.text]));var s=document.createElement("style");document.head.appendChild(s);var c=-1;for(var p in n)s.sheet.insertRule(p+"{"+n[p].join(";")+"}",++c)},module.exports=Popup;
},{"./util":8}],8:[function(_dereq_,module,exports){
"use strict";var Util=function(){};Util.escapeRegExp=function(t){return t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},Util.hasClass=function(t,e){var n=" ";return t.nodeType===Node.ELEMENT_NODE&&(n+t.className+n).replace(/[\n\t]/g,n).indexOf(n+e+n)>=0},Util.addClass=function(t,e){t.className+=" "+e},Util.removeClass=function(t,e){var n=new RegExp("\\b"+Util.escapeRegExp(e)+"\\b");t.className=t.className.replace(n,"")},Util.interpolateString=function(t,e){var n=/{{([a-z][a-z0-9\-_]*)}}/gi;return t.replace(n,function(){return e(arguments[1])||""})},Util.hash=function(t){var e,n,r,i=0;if(0===t.length)return i;for(e=0,r=t.length;e<r;++e)n=t.charCodeAt(e),i=(i<<5)-i+n,i|=0;return i},Util.normaliseHex=function(t){return"#"===t[0]&&(t=t.substr(1)),3===t.length&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),t},Util.getContrast=function(t){return t=Util.normaliseHex(t),(299*parseInt(t.substr(0,2),16)+587*parseInt(t.substr(2,2),16)+114*parseInt(t.substr(4,2),16))/1e3>=128?"#000":"#fff"},Util.getLuminance=function(t){var e=parseInt(Util.normaliseHex(t),16),n=38+(e>>16),r=38+(e>>8&255),i=38+(255&e);return"#"+(16777216+65536*(n<255?n<1?0:n:255)+256*(r<255?r<1?0:r:255)+(i<255?i<1?0:i:255)).toString(16).slice(1)},Util.getHoverColour=function(t){return t=Util.normaliseHex(t),"000000"===t?"#222":Util.getLuminance(t)},Util.isMobile=function(t){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(t)},Util.isPlainObject=function(t){return"object"==typeof t&&null!==t&&t.constructor===Object},Util.arrayContainsMatches=function(t,e){for(var n=0,r=t.length;n<r;++n){var i=t[n];if(i instanceof RegExp&&i.test(e)||"string"==typeof i&&i.length&&i===e)return!0}return!1},module.exports=Util;
},{}]},{},[6])(6)
});


//# sourceMappingURL=cookies-icgc.js.map