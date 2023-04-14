/*


   Magic Zoom Plus v5.3.7 for MagicToolbox.com
   Copyright 2022 Magic Toolbox
   Buy a license: https://www.magictoolbox.com/magiczoomplus/
   License agreement: https://www.magictoolbox.com/license/


*/

window.MagicZoom = (function () {
   var B, q;
   B = q = (function () {
       var W = {
           version: "v3.3.6",
           UUID: 0,
           storage: {},
           $uuid: function (aa) {
               return (aa.$J_UUID || (aa.$J_UUID = ++Q.UUID))
           },
           getStorage: function (aa) {
               return (Q.storage[aa] || (Q.storage[aa] = {}))
           },
           $F: function () {},
           $false: function () {
               return false
           },
           $true: function () {
               return true
           },
           stylesId: "mjs-" + Math.floor(Math.random() * new Date().getTime()),
           defined: function (aa) {
               return (aa != null)
           },
           ifndef: function (ab, aa) {
               return (ab != null) ? ab : aa
           },
           exists: function (aa) {
               return !!(aa)
           },
           jTypeOf: function (ac) {
               var aa = 9007199254740991;

               function ab(ad) {
                   return typeof ad === "number" && ad > -1 && ad % 1 === 0 && ad <= aa
               }
               if (!Q.defined(ac)) {
                   return false
               }
               if (ac.$J_TYPE) {
                   return ac.$J_TYPE
               }
               if (!!ac.nodeType) {
                   if (ac.nodeType === 1) {
                       return "element"
                   }
                   if (ac.nodeType === 3) {
                       return "textnode"
                   }
               }
               if (ac === window) {
                   return "window"
               }
               if (ac === document) {
                   return "document"
               }
               if (ac instanceof window.Function) {
                   return "function"
               }
               if (ac instanceof window.String) {
                   return "string"
               }
               if (ac instanceof window.Array) {
                   return "array"
               }
               if (ac instanceof window.Date) {
                   return "date"
               }
               if (ac instanceof window.RegExp) {
                   return "regexp"
               }
               if (ab(ac.length) && ac.item) {
                   return "collection"
               }
               if (ab(ac.length) && ac.callee) {
                   return "arguments"
               }
               if ((ac instanceof window.Object || ac instanceof window.Function) && ac.constructor === Q.Class) {
                   return "class"
               }
               if (Q.browser.trident) {
                   if (Q.defined(ac.cancelBubble)) {
                       return "event"
                   }
               } else {
                   if (ac === window.event || ac.constructor === window.Event || ac.constructor === window.MouseEvent || ac.constructor === window.UIEvent || ac.constructor === window.KeyboardEvent || ac.constructor === window.KeyEvent) {
                       return "event"
                   }
               }
               return typeof (ac)
           },
           extend: function (af, ae) {
               if (!(af instanceof window.Array)) {
                   af = [af]
               }
               if (!ae) {
                   return af[0]
               }
               for (var ad = 0, ab = af.length; ad < ab; ad++) {
                   if (!Q.defined(af)) {
                       continue
                   }
                   for (var ac in ae) {
                       if (!Object.prototype.hasOwnProperty.call(ae, ac)) {
                           continue
                       }
                       try {
                           af[ad][ac] = ae[ac]
                       } catch (aa) {}
                   }
               }
               return af[0]
           },
           implement: function (ae, ad) {
               if (!(ae instanceof window.Array)) {
                   ae = [ae]
               }
               for (var ac = 0, aa = ae.length; ac < aa; ac++) {
                   if (!Q.defined(ae[ac])) {
                       continue
                   }
                   if (!ae[ac].prototype) {
                       continue
                   }
                   for (var ab in (ad || {})) {
                       if (!ae[ac].prototype[ab]) {
                           ae[ac].prototype[ab] = ad[ab]
                       }
                   }
               }
               return ae[0]
           },
           nativize: function (ac, ab) {
               if (!Q.defined(ac)) {
                   return ac
               }
               for (var aa in (ab || {})) {
                   if (!ac[aa]) {
                       ac[aa] = ab[aa]
                   }
               }
               return ac
           },
           $try: function () {
               for (var ab = 0, aa = arguments.length; ab < aa; ab++) {
                   try {
                       return arguments[ab]()
                   } catch (ac) {}
               }
               return null
           },
           $A: function (ac) {
               if (!Q.defined(ac)) {
                   return Q.$([])
               }
               if (ac.toArray) {
                   return Q.$(ac.toArray())
               }
               if (ac.item) {
                   var ab = ac.length || 0,
                       aa = new Array(ab);
                   while (ab--) {
                       aa[ab] = ac[ab]
                   }
                   return Q.$(aa)
               }
               return Q.$(Array.prototype.slice.call(ac))
           },
           now: function () {
               return new Date().getTime()
           },
           detach: function (ae) {
               var ac;
               switch (Q.jTypeOf(ae)) {
               case "object":
                   ac = {};
                   for (var ad in ae) {
                       ac[ad] = Q.detach(ae[ad])
                   }
                   break;
               case "array":
                   ac = [];
                   for (var ab = 0, aa = ae.length; ab < aa; ab++) {
                       ac[ab] = Q.detach(ae[ab])
                   }
                   break;
               default:
                   return ae
               }
               return Q.$(ac)
           },
           $: function (ac) {
               var aa = true;
               if (!Q.defined(ac)) {
                   return null
               }
               if (ac.$J_EXT) {
                   return ac
               }
               switch (Q.jTypeOf(ac)) {
               case "array":
                   ac = Q.nativize(ac, Q.extend(Q.Array, {
                       $J_EXT: Q.$F
                   }));
                   ac.jEach = ac.forEach;
                   ac.contains = Q.Array.contains;
                   return ac;
                   break;
               case "string":
                   var ab = document.getElementById(ac);
                   if (Q.defined(ab)) {
                       return Q.$(ab)
                   }
                   return null;
                   break;
               case "window":
               case "document":
                   Q.$uuid(ac);
                   ac = Q.extend(ac, Q.Doc);
                   break;
               case "element":
                   Q.$uuid(ac);
                   ac = Q.extend(ac, Q.Element);
                   break;
               case "event":
                   ac = Q.extend(ac, Q.Event);
                   break;
               case "textnode":
               case "function":
               case "date":
               default:
                   aa = false;
                   break
               }
               if (aa) {
                   return Q.extend(ac, {
                       $J_EXT: Q.$F
                   })
               } else {
                   return ac
               }
           },
           $new: function (aa, ac, ab) {
               return Q.$(Q.doc.createElement(aa)).setProps(ac || {}).jSetCss(ab || {})
           },
           addCSS: function (ad, ae, ab) {
               var aa, ag, ac, ai = [],
                   ah = -1;
               ab || (ab = Q.stylesId);
               aa = Q.$(ab) || Q.$new("style", {
                   id: ab,
                   type: "text/css"
               }).jAppendTo((document.head || document.body), "top");
               ag = aa.sheet || aa.styleSheet;
               if (Q.jTypeOf(ae) !== "string") {
                   for (var ac in ae) {
                       ai.push(ac + ":" + ae[ac])
                   }
                   ae = ai.join(";")
               }
               if (ag.insertRule) {
                   ah = ag.insertRule(ad + " {" + ae + "}", ag.cssRules.length)
               } else {
                   try {
                       ah = ag.addRule(ad, ae, ag.rules.length)
                   } catch (af) {}
               }
               return ah
           },
           removeCSS: function (ad, aa) {
               var ac, ab;
               ac = Q.$(ad);
               if (Q.jTypeOf(ac) !== "element") {
                   return
               }
               ab = ac.sheet || ac.styleSheet;
               if (ab.deleteRule) {
                   ab.deleteRule(aa)
               } else {
                   if (ab.removeRule) {
                       ab.removeRule(aa)
                   }
               }
           },
           generateUUID: function () {
               return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (ac) {
                   var ab = Math.random() * 16 | 0,
                       aa = ac === "x" ? ab : (ab & 3 | 8);
                   return aa.toString(16)
               }).toUpperCase()
           },
           getAbsoluteURL: (function () {
               var aa;
               return function (ab) {
                   if (!aa) {
                       aa = document.createElement("a")
                   }
                   aa.setAttribute("href", ab);
                   return ("!!" + aa.href).replace("!!", "")
               }
           })(),
           getHashCode: function (ac) {
               var ad = 0,
                   aa = ac.length;
               for (var ab = 0; ab < aa; ++ab) {
                   ad = 31 * ad + ac.charCodeAt(ab);
                   ad %= 4294967296
               }
               return ad
           }
       };
       var Q = W;
       var R = W.$;
       if (!window.magicJS) {
           window.magicJS = W;
           window.$mjs = W.$
       }
       Q.Array = {
           $J_TYPE: "array",
           indexOf: function (ad, ae) {
               var aa = this.length;
               for (var ab = this.length, ac = (ae < 0) ? Math.max(0, ab + ae) : ae || 0; ac < ab; ac++) {
                   if (this[ac] === ad) {
                       return ac
                   }
               }
               return -1
           },
           contains: function (aa, ab) {
               return this.indexOf(aa, ab) != -1
           },
           forEach: function (aa, ad) {
               for (var ac = 0, ab = this.length; ac < ab; ac++) {
                   if (ac in this) {
                       aa.call(ad, this[ac], ac, this)
                   }
               }
           },
           filter: function (aa, af) {
               var ae = [];
               for (var ad = 0, ab = this.length; ad < ab; ad++) {
                   if (ad in this) {
                       var ac = this[ad];
                       if (aa.call(af, this[ad], ad, this)) {
                           ae.push(ac)
                       }
                   }
               }
               return ae
           },
           map: function (aa, ae) {
               var ad = [];
               for (var ac = 0, ab = this.length; ac < ab; ac++) {
                   if (ac in this) {
                       ad[ac] = aa.call(ae, this[ac], ac, this)
                   }
               }
               return ad
           }
       };
       Q.implement(String, {
           $J_TYPE: "string",
           jTrim: function () {
               return this.replace(/^\s+|\s+$/g, "")
           },
           eq: function (aa, ab) {
               return (ab || false) ? (this.toString() === aa.toString()) : (this.toLowerCase().toString() === aa.toLowerCase().toString())
           },
           jCamelize: function () {
               return this.replace(/-\D/g, function (aa) {
                   return aa.charAt(1).toUpperCase()
               })
           },
           dashize: function () {
               return this.replace(/[A-Z]/g, function (aa) {
                   return ("-" + aa.charAt(0).toLowerCase())
               })
           },
           jToInt: function (aa) {
               return parseInt(this, aa || 10)
           },
           toFloat: function () {
               return parseFloat(this)
           },
           jToBool: function () {
               return !this.replace(/true/i, "").jTrim()
           },
           has: function (ab, aa) {
               aa = aa || "";
               return (aa + this + aa).indexOf(aa + ab + aa) > -1
           }
       });
       W.implement(Function, {
           $J_TYPE: "function",
           jBind: function () {
               var ab = Q.$A(arguments),
                   aa = this,
                   ac = ab.shift();
               return function () {
                   return aa.apply(ac || null, ab.concat(Q.$A(arguments)))
               }
           },
           jBindAsEvent: function () {
               var ab = Q.$A(arguments),
                   aa = this,
                   ac = ab.shift();
               return function (ad) {
                   return aa.apply(ac || null, Q.$([ad || (Q.browser.ieMode ? window.event : null)]).concat(ab))
               }
           },
           jDelay: function () {
               var ab = Q.$A(arguments),
                   aa = this,
                   ac = ab.shift();
               return window.setTimeout(function () {
                   return aa.apply(aa, ab)
               }, ac || 0)
           },
           jDefer: function () {
               var ab = Q.$A(arguments),
                   aa = this;
               return function () {
                   return aa.jDelay.apply(aa, ab)
               }
           },
           interval: function () {
               var ab = Q.$A(arguments),
                   aa = this,
                   ac = ab.shift();
               return window.setInterval(function () {
                   return aa.apply(aa, ab)
               }, ac || 0)
           }
       });
       var X = {};
       var P = navigator.userAgent.toLowerCase();
       var O = P.match(/(webkit|gecko|trident|presto)\/(\d+\.?\d*)/i);
       var T = P.match(/(edge|opr)\/(\d+\.?\d*)/i) || P.match(/(crios|chrome|safari|firefox|opera|opr)\/(\d+\.?\d*)/i);
       var V = P.match(/version\/(\d+\.?\d*)/i);
       var K = document.documentElement.style;

       function L(ab) {
           var aa = ab.charAt(0).toUpperCase() + ab.slice(1);
           return ab in K || ("Webkit" + aa) in K || ("Moz" + aa) in K || ("ms" + aa) in K || ("O" + aa) in K
       }
       Q.browser = {
           features: {
               xpath: !!(document.evaluate),
               air: !!(window.runtime),
               query: !!(document.querySelector),
               fullScreen: !!(document.fullscreenEnabled || document.msFullscreenEnabled || document.exitFullscreen || document.cancelFullScreen || document.webkitexitFullscreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.oCancelFullScreen || document.msCancelFullScreen),
               xhr2: !!(window.ProgressEvent) && !!(window.FormData) && (window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest),
               transition: L("transition"),
               transform: L("transform"),
               perspective: L("perspective"),
               animation: L("animation"),
               requestAnimationFrame: false,
               multibackground: false,
               cssFilters: false,
               canvas: false,
               svg: (function () {
                   return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")
               }())
           },
           touchScreen: (function () {
               return "ontouchstart" in window || (window.DocumentTouch && document instanceof DocumentTouch) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
           }()),
           mobile: !!P.match(/(android|bb\d+|meego).+|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/),
           engine: (O && O[1]) ? O[1].toLowerCase() : (window.opera) ? "presto" : !!(window.ActiveXObject) ? "trident" : (document.getBoxObjectFor !== undefined || window.mozInnerScreenY !== null) ? "gecko" : (window.WebKitPoint !== null || !navigator.taintEnabled) ? "webkit" : "unknown",
           version: (O && O[2]) ? parseFloat(O[2]) : 0,
           uaName: (T && T[1]) ? T[1].toLowerCase() : "",
           uaVersion: (T && T[2]) ? parseFloat(T[2]) : 0,
           cssPrefix: "",
           cssDomPrefix: "",
           domPrefix: "",
           ieMode: 0,
           platform: P.match(/ip(?:ad|od|hone)/) ? "ios" : (P.match(/(?:webos|android)/) || navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase(),
           backCompat: document.compatMode && document.compatMode.toLowerCase() === "backcompat",
           scrollbarsWidth: 0,
           getDoc: function () {
               return (document.compatMode && document.compatMode.toLowerCase() === "backcompat") ? document.body : document.documentElement
           },
           requestAnimationFrame: window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || undefined,
           cancelAnimationFrame: window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || undefined,
           ready: false,
           onready: function () {
               if (Q.browser.ready) {
                   return
               }
               var ad;
               var ac;
               Q.browser.ready = true;
               Q.body = Q.$(document.body);
               Q.win = Q.$(window);
               try {
                   var ab = Q.$new("div").jSetCss({
                       width: 100,
                       height: 100,
                       overflow: "scroll",
                       position: "absolute",
                       top: -9999
                   }).jAppendTo(document.body);
                   Q.browser.scrollbarsWidth = ab.offsetWidth - ab.clientWidth;
                   ab.jRemove()
               } catch (aa) {}
               try {
                   ad = Q.$new("div");
                   ac = ad.style;
                   ac.cssText = "background:url(https://),url(https://),red url(https://)";
                   Q.browser.features.multibackground = (/(url\s*\(.*?){3}/).test(ac.background);
                   ac = null;
                   ad = null
               } catch (aa) {}
               if (!Q.browser.cssTransformProp) {
                   Q.browser.cssTransformProp = Q.normalizeCSS("transform").dashize()
               }
               try {
                   ad = Q.$new("div");
                   ad.style.cssText = Q.normalizeCSS("filter").dashize() + ":blur(2px);";
                   Q.browser.features.cssFilters = !!ad.style.length && (!Q.browser.ieMode || Q.browser.ieMode > 9);
                   ad = null
               } catch (aa) {}
               if (!Q.browser.features.cssFilters) {
                   Q.$(document.documentElement).jAddClass("no-cssfilters-magic")
               }
               try {
                   Q.browser.features.canvas = (function () {
                       var ae = Q.$new("canvas");
                       return !!(ae.getContext && ae.getContext("2d"))
                   }())
               } catch (aa) {}
               if (window.TransitionEvent === undefined && window.WebKitTransitionEvent !== undefined) {
                   X.transitionend = "webkitTransitionEnd"
               }
               Q.Doc.jCallEvent.call(Q.$(document), "domready")
           }
       };
       (function () {
           var ab = [],
               ae, ad, af;

           function aa() {
               return !!(arguments.callee.caller)
           }
           switch (Q.browser.engine) {
           case "trident":
               if (!Q.browser.version) {
                   Q.browser.version = !!(window.XMLHttpRequest) ? 3 : 2
               }
               break;
           case "gecko":
               Q.browser.version = (T && T[2]) ? parseFloat(T[2]) : 0;
               break
           }
           Q.browser[Q.browser.engine] = true;
           if (T && T[1] === "crios") {
               Q.browser.uaName = "chrome"
           }
           if (!!window.chrome) {
               Q.browser.chrome = true
           }
           if (T && T[1] === "opr") {
               Q.browser.uaName = "opera";
               Q.browser.opera = true
           }
           if (Q.browser.uaName === "safari" && (V && V[1])) {
               Q.browser.uaVersion = parseFloat(V[1])
           }
           if (Q.browser.platform === "android" && Q.browser.webkit && (V && V[1])) {
               Q.browser.androidBrowser = true
           }
           ae = ({
               gecko: ["-moz-", "Moz", "moz"],
               webkit: ["-webkit-", "Webkit", "webkit"],
               trident: ["-ms-", "ms", "ms"],
               presto: ["-o-", "O", "o"]
           })[Q.browser.engine] || ["", "", ""];
           Q.browser.cssPrefix = ae[0];
           Q.browser.cssDomPrefix = ae[1];
           Q.browser.domPrefix = ae[2];
           Q.browser.ieMode = !Q.browser.trident ? undefined : (document.documentMode) ? document.documentMode : (function () {
               var ag = 0;
               if (Q.browser.backCompat) {
                   return 5
               }
               switch (Q.browser.version) {
               case 2:
                   ag = 6;
                   break;
               case 3:
                   ag = 7;
                   break
               }
               return ag
           }());
           if (!Q.browser.mobile && Q.browser.platform === "mac" && Q.browser.touchScreen) {
               Q.browser.mobile = true;
               Q.browser.platform = "ios"
           }
           ab.push(Q.browser.platform + "-magic");
           if (Q.browser.mobile) {
               ab.push("mobile-magic")
           }
           if (Q.browser.androidBrowser) {
               ab.push("android-browser-magic")
           }
           if (Q.browser.ieMode) {
               Q.browser.uaName = "ie";
               Q.browser.uaVersion = Q.browser.ieMode;
               ab.push("ie" + Q.browser.ieMode + "-magic");
               for (ad = 11; ad > Q.browser.ieMode; ad--) {
                   ab.push("lt-ie" + ad + "-magic")
               }
           }
           if (Q.browser.webkit && Q.browser.version < 536) {
               Q.browser.features.fullScreen = false
           }
           if (Q.browser.requestAnimationFrame) {
               Q.browser.requestAnimationFrame.call(window, function () {
                   Q.browser.features.requestAnimationFrame = true
               })
           }
           if (Q.browser.features.svg) {
               ab.push("svg-magic")
           } else {
               ab.push("no-svg-magic")
           }
           af = (document.documentElement.className || "").match(/\S+/g) || [];
           document.documentElement.className = Q.$(af).concat(ab).join(" ");
           try {
               document.documentElement.setAttribute("data-magic-ua", Q.browser.uaName);
               document.documentElement.setAttribute("data-magic-ua-ver", Q.browser.uaVersion);
               document.documentElement.setAttribute("data-magic-engine", Q.browser.engine);
               document.documentElement.setAttribute("data-magic-engine-ver", Q.browser.version)
           } catch (ac) {}
           if (Q.browser.ieMode && Q.browser.ieMode < 9) {
               document.createElement("figure");
               document.createElement("figcaption")
           }
           if (!window.navigator.pointerEnabled) {
               Q.$(["Down", "Up", "Move", "Over", "Out"]).jEach(function (ag) {
                   X["pointer" + ag.toLowerCase()] = window.navigator.msPointerEnabled ? "MSPointer" + ag : -1
               })
           }
       }());
       (function () {
           Q.browser.fullScreen = {
               capable: Q.browser.features.fullScreen,
               enabled: function () {
                   return !!(document.fullscreenElement || document[Q.browser.domPrefix + "FullscreenElement"] || document.fullScreen || document.webkitIsFullScreen || document[Q.browser.domPrefix + "FullScreen"])
               },
               request: function (aa, ab) {
                   if (!ab) {
                       ab = {}
                   }
                   if (this.capable) {
                       Q.$(document).jAddEvent(this.changeEventName, this.onchange = function (ac) {
                           if (this.enabled()) {
                               if (ab.onEnter) {
                                   ab.onEnter()
                               }
                           } else {
                               Q.$(document).jRemoveEvent(this.changeEventName, this.onchange);
                               if (ab.onExit) {
                                   ab.onExit()
                               }
                           }
                       }.jBindAsEvent(this));
                       Q.$(document).jAddEvent(this.errorEventName, this.onerror = function (ac) {
                           if (ab.fallback) {
                               ab.fallback()
                           }
                           Q.$(document).jRemoveEvent(this.errorEventName, this.onerror)
                       }.jBindAsEvent(this));
                       (aa.requestFullscreen || aa[Q.browser.domPrefix + "RequestFullscreen"] || aa[Q.browser.domPrefix + "RequestFullScreen"] || function () {}).call(aa)
                   } else {
                       if (ab.fallback) {
                           ab.fallback()
                       }
                   }
               },
               cancel: (document.exitFullscreen || document.cancelFullScreen || document[Q.browser.domPrefix + "ExitFullscreen"] || document[Q.browser.domPrefix + "CancelFullScreen"] || function () {}).jBind(document),
               changeEventName: document.msExitFullscreen ? "MSFullscreenChange" : (document.exitFullscreen ? "" : Q.browser.domPrefix) + "fullscreenchange",
               errorEventName: document.msExitFullscreen ? "MSFullscreenError" : (document.exitFullscreen ? "" : Q.browser.domPrefix) + "fullscreenerror",
               prefix: Q.browser.domPrefix,
               activeElement: null
           }
       }());
       var Z = /\S+/g,
           N = /^(border(Top|Bottom|Left|Right)Width)|((padding|margin)(Top|Bottom|Left|Right))$/,
           S = {
               "float": ("undefined" === typeof (K.styleFloat)) ? "cssFloat" : "styleFloat"
           },
           U = {
               fontWeight: true,
               lineHeight: true,
               opacity: true,
               zIndex: true,
               zoom: true
           },
           M = (window.getComputedStyle) ? function (ac, aa) {
               var ab = window.getComputedStyle(ac, null);
               return ab ? ab.getPropertyValue(aa) || ab[aa] : null
           } : function (ad, ab) {
               var ac = ad.currentStyle,
                   aa = null;
               aa = ac ? ac[ab] : null;
               if (null == aa && ad.style && ad.style[ab]) {
                   aa = ad.style[ab]
               }
               return aa
           };

       function Y(ac) {
           var aa, ab;
           ab = (Q.browser.webkit && "filter" == ac) ? false : (ac in K);
           if (!ab) {
               aa = Q.browser.cssDomPrefix + ac.charAt(0).toUpperCase() + ac.slice(1);
               if (aa in K) {
                   return aa
               }
           }
           return ac
       }
       Q.normalizeCSS = Y;
       Q.Element = {
           jHasClass: function (aa) {
               return !(aa || "").has(" ") && (this.className || "").has(aa, " ")
           },
           jAddClass: function (ae) {
               var ab = (this.className || "").match(Z) || [],
                   ad = (ae || "").match(Z) || [],
                   aa = ad.length,
                   ac = 0;
               for (; ac < aa; ac++) {
                   if (!Q.$(ab).contains(ad[ac])) {
                       ab.push(ad[ac])
                   }
               }
               this.className = ab.join(" ");
               return this
           },
           jRemoveClass: function (af) {
               var ab = (this.className || "").match(Z) || [],
                   ae = (af || "").match(Z) || [],
                   aa = ae.length,
                   ad = 0,
                   ac;
               for (; ad < aa; ad++) {
                   if ((ac = Q.$(ab).indexOf(ae[ad])) > -1) {
                       ab.splice(ac, 1)
                   }
               }
               this.className = af ? ab.join(" ") : "";
               return this
           },
           jToggleClass: function (aa) {
               return this.jHasClass(aa) ? this.jRemoveClass(aa) : this.jAddClass(aa)
           },
           jGetCss: function (ab) {
               var ac = ab.jCamelize(),
                   aa = null;
               ab = S[ac] || (S[ac] = Y(ac));
               aa = M(this, ab);
               if ("auto" === aa) {
                   aa = null
               }
               if (null !== aa) {
                   if ("opacity" == ab) {
                       return Q.defined(aa) ? parseFloat(aa) : 1
                   }
                   if (N.test(ab)) {
                       aa = parseInt(aa, 10) ? aa : "0px"
                   }
               }
               return aa
           },
           jSetCssProp: function (ab, aa) {
               var ad = ab.jCamelize();
               try {
                   if ("opacity" == ab) {
                       this.jSetOpacity(aa);
                       return this
                   }
                   ab = S[ad] || (S[ad] = Y(ad));
                   this.style[ab] = aa + (("number" == Q.jTypeOf(aa) && !U[ad]) ? "px" : "")
               } catch (ac) {}
               return this
           },
           jSetCss: function (ab) {
               for (var aa in ab) {
                   this.jSetCssProp(aa, ab[aa])
               }
               return this
           },
           jGetStyles: function () {
               var aa = {};
               Q.$A(arguments).jEach(function (ab) {
                   aa[ab] = this.jGetCss(ab)
               }, this);
               return aa
           },
           jSetOpacity: function (ac, aa) {
               var ab;
               aa = aa || false;
               this.style.opacity = ac;
               ac = parseInt(parseFloat(ac) * 100);
               if (aa) {
                   if (0 === ac) {
                       if ("hidden" != this.style.visibility) {
                           this.style.visibility = "hidden"
                       }
                   } else {
                       if ("visible" != this.style.visibility) {
                           this.style.visibility = "visible"
                       }
                   }
               }
               if (Q.browser.ieMode && Q.browser.ieMode < 9) {
                   if (!isNaN(ac)) {
                       if (!~this.style.filter.indexOf("Alpha")) {
                           this.style.filter += " progid:DXImageTransform.Microsoft.Alpha(Opacity=" + ac + ")"
                       } else {
                           this.style.filter = this.style.filter.replace(/Opacity=\d*/i, "Opacity=" + ac)
                       }
                   } else {
                       this.style.filter = this.style.filter.replace(/progid:DXImageTransform.Microsoft.Alpha\(Opacity=\d*\)/i, "").jTrim();
                       if ("" === this.style.filter) {
                           this.style.removeAttribute("filter")
                       }
                   }
               }
               return this
           },
           setProps: function (aa) {
               for (var ab in aa) {
                   if ("class" === ab) {
                       this.jAddClass("" + aa[ab])
                   } else {
                       this.setAttribute(ab, "" + aa[ab])
                   }
               }
               return this
           },
           jGetTransitionDuration: function () {
               var ab = 0,
                   aa = 0;
               ab = this.jGetCss("transition-duration");
               aa = this.jGetCss("transition-delay");
               ab = ab.indexOf("ms") > -1 ? parseFloat(ab) : ab.indexOf("s") > -1 ? parseFloat(ab) * 1000 : 0;
               aa = aa.indexOf("ms") > -1 ? parseFloat(aa) : aa.indexOf("s") > -1 ? parseFloat(aa) * 1000 : 0;
               return ab + aa
           },
           hide: function () {
               return this.jSetCss({
                   display: "none",
                   visibility: "hidden"
               })
           },
           show: function () {
               return this.jSetCss({
                   display: "",
                   visibility: "visible"
               })
           },
           jGetSize: function () {
               return {
                   width: this.offsetWidth,
                   height: this.offsetHeight
               }
           },
           getInnerSize: function (ab) {
               var aa = this.jGetSize();
               aa.width -= (parseFloat(this.jGetCss("border-left-width") || 0) + parseFloat(this.jGetCss("border-right-width") || 0));
               aa.height -= (parseFloat(this.jGetCss("border-top-width") || 0) + parseFloat(this.jGetCss("border-bottom-width") || 0));
               if (!ab) {
                   aa.width -= (parseFloat(this.jGetCss("padding-left") || 0) + parseFloat(this.jGetCss("padding-right") || 0));
                   aa.height -= (parseFloat(this.jGetCss("padding-top") || 0) + parseFloat(this.jGetCss("padding-bottom") || 0))
               }
               return aa
           },
           jGetScroll: function () {
               return {
                   top: this.scrollTop,
                   left: this.scrollLeft
               }
           },
           jGetFullScroll: function () {
               var aa = this,
                   ab = {
                       top: 0,
                       left: 0
                   };
               do {
                   ab.left += aa.scrollLeft || 0;
                   ab.top += aa.scrollTop || 0;
                   aa = aa.parentNode
               } while (aa);
               return ab
           },
           jGetPosition: function () {
               var ae = this,
                   ab = 0,
                   ad = 0;
               if (Q.defined(document.documentElement.getBoundingClientRect)) {
                   var aa = this.getBoundingClientRect(),
                       ac = Q.$(document).jGetScroll(),
                       af = Q.browser.getDoc();
                   return {
                       top: aa.top + ac.y - af.clientTop,
                       left: aa.left + ac.x - af.clientLeft
                   }
               }
               do {
                   ab += ae.offsetLeft || 0;
                   ad += ae.offsetTop || 0;
                   ae = ae.offsetParent
               } while (ae && !(/^(?:body|html)$/i).test(ae.tagName));
               return {
                   top: ad,
                   left: ab
               }
           },
           jGetOffset: function () {
               var aa = this;
               var ac = 0;
               var ab = 0;
               do {
                   ac += aa.offsetLeft || 0;
                   ab += aa.offsetTop || 0;
                   aa = aa.offsetParent
               } while (aa && !(/^(?:body|html)$/i).test(aa.tagName));
               return {
                   top: ab,
                   left: ac
               }
           },
           jGetRect: function () {
               var ab = this.jGetPosition();
               var aa = this.jGetSize();
               return {
                   top: ab.top,
                   bottom: ab.top + aa.height,
                   left: ab.left,
                   right: ab.left + aa.width
               }
           },
           changeContent: function (ab) {
               try {
                   this.innerHTML = ab
               } catch (aa) {
                   this.innerText = ab
               }
               return this
           },
           jRemove: function () {
               return (this.parentNode) ? this.parentNode.removeChild(this) : this
           },
           kill: function () {
               Q.$A(this.childNodes).jEach(function (aa) {
                   if (3 == aa.nodeType || 8 == aa.nodeType) {
                       return
                   }
                   Q.$(aa).kill()
               });
               this.jRemove();
               this.jClearEvents();
               if (this.$J_UUID) {
                   Q.storage[this.$J_UUID] = null;
                   delete Q.storage[this.$J_UUID]
               }
               return null
           },
           append: function (ac, ab) {
               ab = ab || "bottom";
               var aa = this.firstChild;
               ("top" == ab && aa) ? this.insertBefore(ac, aa): this.appendChild(ac);
               return this
           },
           jAppendTo: function (ac, ab) {
               var aa = Q.$(ac).append(this, ab);
               return this
           },
           enclose: function (aa) {
               this.append(aa.parentNode.replaceChild(this, aa));
               return this
           },
           hasChild: function (aa) {
               if ("element" !== Q.jTypeOf("string" == Q.jTypeOf(aa) ? aa = document.getElementById(aa) : aa)) {
                   return false
               }
               return (this == aa) ? false : (this.contains && !(Q.browser.webkit419)) ? (this.contains(aa)) : (this.compareDocumentPosition) ? !!(this.compareDocumentPosition(aa) & 16) : Q.$A(this.byTag(aa.tagName)).contains(aa)
           }
       };
       Q.Element.jGetStyle = Q.Element.jGetCss;
       Q.Element.jSetStyle = Q.Element.jSetCss;
       if (!window.Element) {
           window.Element = Q.$F;
           if (Q.browser.engine.webkit) {
               window.document.createElement("iframe")
           }
           window.Element.prototype = (Q.browser.engine.webkit) ? window["[[DOMElement.prototype]]"] : {}
       }
       Q.implement(window.Element, {
           $J_TYPE: "element"
       });
       Q.Doc = {
           jGetSize: function () {
               if (Q.browser.touchScreen || Q.browser.presto925 || Q.browser.webkit419) {
                   return {
                       width: window.innerWidth,
                       height: window.innerHeight
                   }
               }
               return {
                   width: Q.browser.getDoc().clientWidth,
                   height: Q.browser.getDoc().clientHeight
               }
           },
           jGetScroll: function () {
               return {
                   x: window.pageXOffset || Q.browser.getDoc().scrollLeft,
                   y: window.pageYOffset || Q.browser.getDoc().scrollTop
               }
           },
           jGetFullSize: function () {
               var aa = this.jGetSize();
               return {
                   width: Math.max(Q.browser.getDoc().scrollWidth, aa.width),
                   height: Math.max(Q.browser.getDoc().scrollHeight, aa.height)
               }
           }
       };
       Q.extend(document, {
           $J_TYPE: "document"
       });
       Q.extend(window, {
           $J_TYPE: "window"
       });
       Q.extend([Q.Element, Q.Doc], {
           jFetch: function (ad, ab) {
               var aa = Q.getStorage(this.$J_UUID),
                   ac = aa[ad];
               if (undefined !== ab && undefined === ac) {
                   ac = aa[ad] = ab
               }
               return (Q.defined(ac) ? ac : null)
           },
           jStore: function (ac, ab) {
               var aa = Q.getStorage(this.$J_UUID);
               aa[ac] = ab;
               return this
           },
           jDel: function (ab) {
               var aa = Q.getStorage(this.$J_UUID);
               delete aa[ab];
               return this
           }
       });
       if (!(window.HTMLElement && window.HTMLElement.prototype && window.HTMLElement.prototype.getElementsByClassName)) {
           Q.extend([Q.Element, Q.Doc], {
               getElementsByClassName: function (aa) {
                   return Q.$A(this.getElementsByTagName("*")).filter(function (ac) {
                       try {
                           return (1 == ac.nodeType && ac.className.has(aa, " "))
                       } catch (ab) {}
                   })
               }
           })
       }
       Q.extend([Q.Element, Q.Doc], {
           byClass: function () {
               return this.getElementsByClassName(arguments[0])
           },
           byTag: function () {
               return this.getElementsByTagName(arguments[0])
           }
       });
       if (Q.browser.fullScreen.capable && !document.requestFullScreen) {
           Q.Element.requestFullScreen = function () {
               Q.browser.fullScreen.request(this)
           }
       }
       Q.Event = {
           $J_TYPE: "event",
           isQueueStopped: Q.$false,
           stop: function () {
               return this.stopDistribution().stopDefaults()
           },
           stopDistribution: function () {
               if (this.stopPropagation) {
                   this.stopPropagation()
               } else {
                   this.cancelBubble = true
               }
               return this
           },
           stopDefaults: function () {
               if (this.preventDefault) {
                   this.preventDefault()
               } else {
                   this.returnValue = false
               }
               return this
           },
           stopQueue: function () {
               this.isQueueStopped = Q.$true;
               return this
           },
           getClientXY: function () {
               var aa = (/touch/i).test(this.type) ? this.changedTouches[0] : this;
               return !Q.defined(aa) ? {
                   x: 0,
                   y: 0
               } : {
                   x: aa.clientX,
                   y: aa.clientY
               }
           },
           jGetPageXY: function () {
               var aa = (/touch/i).test(this.type) ? this.changedTouches[0] : this;
               return !Q.defined(aa) ? {
                   x: 0,
                   y: 0
               } : {
                   x: aa.pageX || aa.clientX + Q.browser.getDoc().scrollLeft,
                   y: aa.pageY || aa.clientY + Q.browser.getDoc().scrollTop
               }
           },
           getTarget: function () {
               var aa = this.target || this.srcElement;
               while (aa && aa.nodeType === 3) {
                   aa = aa.parentNode
               }
               return aa
           },
           getRelated: function () {
               var ab = null;
               switch (this.type) {
               case "mouseover":
               case "pointerover":
               case "MSPointerOver":
                   ab = this.relatedTarget || this.fromElement;
                   break;
               case "mouseout":
               case "pointerout":
               case "MSPointerOut":
                   ab = this.relatedTarget || this.toElement;
                   break;
               default:
                   return ab
               }
               try {
                   while (ab && ab.nodeType === 3) {
                       ab = ab.parentNode
                   }
               } catch (aa) {
                   ab = null
               }
               return ab
           },
           getButton: function () {
               if (!this.which && this.button !== undefined) {
                   return (this.button & 1 ? 1 : (this.button & 2 ? 3 : (this.button & 4 ? 2 : 0)))
               }
               return this.which
           },
           isTouchEvent: function () {
               return (this.pointerType && (this.pointerType === "touch" || this.pointerType === this.MSPOINTER_TYPE_TOUCH)) || (/touch/i).test(this.type)
           },
           isPrimaryTouch: function () {
               if (this.pointerType) {
                   return (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) && this.isPrimary
               } else {
                   if (this instanceof window.TouchEvent) {
                       return this.changedTouches.length === 1 && (this.targetTouches.length ? this.targetTouches.length === 1 && this.targetTouches[0].identifier === this.changedTouches[0].identifier : true)
                   }
               }
               return false
           },
           getPrimaryTouch: function () {
               if (this.pointerType) {
                   return this.isPrimary && (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) ? this : null
               } else {
                   if (this instanceof window.TouchEvent) {
                       return this.changedTouches[0]
                   }
               }
               return null
           },
           getPrimaryTouchId: function () {
               if (this.pointerType) {
                   return this.isPrimary && (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) ? this.pointerId : null
               } else {
                   if (this instanceof window.TouchEvent) {
                       return this.changedTouches[0].identifier
                   }
               }
               return null
           }
       };
       Q._event_add_ = "addEventListener";
       Q._event_del_ = "removeEventListener";
       Q._event_prefix_ = "";
       if (!document.addEventListener) {
           Q._event_add_ = "attachEvent";
           Q._event_del_ = "detachEvent";
           Q._event_prefix_ = "on"
       }
       Q.Event.Custom = {
           type: "",
           x: null,
           y: null,
           timeStamp: null,
           button: null,
           target: null,
           relatedTarget: null,
           $J_TYPE: "event.custom",
           isQueueStopped: Q.$false,
           events: Q.$([]),
           pushToEvents: function (aa) {
               var ab = aa;
               this.events.push(ab)
           },
           stop: function () {
               return this.stopDistribution().stopDefaults()
           },
           stopDistribution: function () {
               this.events.jEach(function (ab) {
                   try {
                       ab.stopDistribution()
                   } catch (aa) {}
               });
               return this
           },
           stopDefaults: function () {
               this.events.jEach(function (ab) {
                   try {
                       ab.stopDefaults()
                   } catch (aa) {}
               });
               return this
           },
           stopQueue: function () {
               this.isQueueStopped = Q.$true;
               return this
           },
           getClientXY: function () {
               return {
                   x: this.clientX,
                   y: this.clientY
               }
           },
           jGetPageXY: function () {
               return {
                   x: this.x,
                   y: this.y
               }
           },
           getTarget: function () {
               return this.target
           },
           getRelated: function () {
               return this.relatedTarget
           },
           getButton: function () {
               return this.button
           },
           getOriginalTarget: function () {
               return this.events.length > 0 ? this.events[0].getTarget() : undefined
           },
           isTouchEvent: function () {
               return (this.pointerType && (this.pointerType === "touch" || this.pointerType === this.MSPOINTER_TYPE_TOUCH)) || (/touch/i).test(this.type)
           },
           isPrimaryTouch: function () {
               if (this.pointerType) {
                   return (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) && this.isPrimary
               } else {
                   if (this instanceof window.TouchEvent) {
                       return this.changedTouches.length === 1 && (this.targetTouches.length ? this.targetTouches[0].identifier === this.changedTouches[0].identifier : true)
                   }
               }
               return false
           },
           getPrimaryTouch: function () {
               if (this.pointerType) {
                   return this.isPrimary && (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) ? this : null
               } else {
                   if (this instanceof window.TouchEvent) {
                       return this.changedTouches[0]
                   }
               }
               return null
           },
           getPrimaryTouchId: function () {
               if (this.pointerType) {
                   return this.isPrimary && (this.pointerType === "touch" || this.MSPOINTER_TYPE_TOUCH === this.pointerType) ? this.pointerId : null
               } else {
                   if (this instanceof window.TouchEvent) {
                       return this.changedTouches[0].identifier
                   }
               }
               return null
           }
       };
       Q.extend([Q.Element, Q.Doc], {
           jAddEvent: function (ac, ae, af, ai) {
               var ah, aa, ad, ag, ab;
               if (Q.jTypeOf(ac) === "string") {
                   ab = ac.split(" ");
                   if (ab.length > 1) {
                       ac = ab
                   }
               }
               if (Q.jTypeOf(ac) === "array") {
                   Q.$(ac).jEach(this.jAddEvent.jBindAsEvent(this, ae, af, ai));
                   return this
               }
               ac = X[ac] || ac;
               if (!ac || !ae || Q.jTypeOf(ac) !== "string" || Q.jTypeOf(ae) !== "function") {
                   return this
               }
               if (ac === "domready" && Q.browser.ready) {
                   ae.call(this);
                   return this
               }
               af = parseInt(af || 50, 10);
               if (!ae.$J_EUID) {
                   ae.$J_EUID = Math.floor(Math.random() * Q.now())
               }
               ah = Q.Doc.jFetch.call(this, "_EVENTS_", {});
               aa = ah[ac];
               if (!aa) {
                   ah[ac] = aa = Q.$([]);
                   ad = this;
                   if (Q.Event.Custom[ac]) {
                       Q.Event.Custom[ac].handler.add.call(this, ai)
                   } else {
                       aa.handle = function (aj) {
                           aj = Q.extend(aj || window.e, {
                               $J_TYPE: "event"
                           });
                           Q.Doc.jCallEvent.call(ad, ac, Q.$(aj))
                       };
                       this[Q._event_add_](Q._event_prefix_ + ac, aa.handle, false)
                   }
               }
               ag = {
                   type: ac,
                   fn: ae,
                   priority: af,
                   euid: ae.$J_EUID
               };
               aa.push(ag);
               aa.sort(function (ak, aj) {
                   return ak.priority - aj.priority
               });
               return this
           },
           jRemoveEvent: function (ag) {
               var ae = Q.Doc.jFetch.call(this, "_EVENTS_", {});
               var ac;
               var aa;
               var ab;
               var ah;
               var af;
               var ad;
               af = arguments.length > 1 ? arguments[1] : -100;
               if (Q.jTypeOf(ag) === "string") {
                   ad = ag.split(" ");
                   if (ad.length > 1) {
                       ag = ad
                   }
               }
               if (Q.jTypeOf(ag) === "array") {
                   Q.$(ag).jEach(this.jRemoveEvent.jBindAsEvent(this, af));
                   return this
               }
               ag = X[ag] || ag;
               if (!ag || Q.jTypeOf(ag) !== "string" || !ae || !ae[ag]) {
                   return this
               }
               ac = ae[ag] || [];
               for (ab = 0; ab < ac.length; ab++) {
                   aa = ac[ab];
                   if (af === -100 || !!af && af.$J_EUID === aa.euid) {
                       ah = ac.splice(ab--, 1)
                   }
               }
               if (ac.length === 0) {
                   if (Q.Event.Custom[ag]) {
                       Q.Event.Custom[ag].handler.jRemove.call(this)
                   } else {
                       this[Q._event_del_](Q._event_prefix_ + ag, ac.handle, false)
                   }
                   delete ae[ag]
               }
               return this
           },
           jCallEvent: function (ad, af) {
               var ac = Q.Doc.jFetch.call(this, "_EVENTS_", {});
               var ab;
               var aa;
               ad = X[ad] || ad;
               if (!ad || Q.jTypeOf(ad) !== "string" || !ac || !ac[ad]) {
                   return this
               }
               try {
                   af = Q.extend(af || {}, {
                       type: ad
                   })
               } catch (ae) {}
               if (af.timeStamp === undefined) {
                   af.timeStamp = Q.now()
               }
               ab = ac[ad] || [];
               for (aa = 0; aa < ab.length && !(af.isQueueStopped && af.isQueueStopped()); aa++) {
                   ab[aa].fn.call(this, af)
               }
           },
           jRaiseEvent: function (ab, aa) {
               var ae = (ab !== "domready");
               var ad = this;
               var ac;
               ab = X[ab] || ab;
               if (!ae) {
                   Q.Doc.jCallEvent.call(this, ab);
                   return this
               }
               if (ad === document && document.createEvent && !ad.dispatchEvent) {
                   ad = document.documentElement
               }
               if (document.createEvent) {
                   ac = document.createEvent(ab);
                   ac.initEvent(aa, true, true)
               } else {
                   ac = document.createEventObject();
                   ac.eventType = ab
               }
               if (document.createEvent) {
                   ad.dispatchEvent(ac)
               } else {
                   ad.fireEvent("on" + aa, ac)
               }
               return ac
           },
           jClearEvents: function () {
               var ab = Q.Doc.jFetch.call(this, "_EVENTS_");
               if (!ab) {
                   return this
               }
               for (var aa in ab) {
                   Q.Doc.jRemoveEvent.call(this, aa)
               }
               Q.Doc.jDel.call(this, "_EVENTS_");
               return this
           }
       });
       (function (aa) {
           if (document.readyState === "complete") {
               return aa.browser.onready.jDelay(1)
           }
           if (aa.browser.webkit && aa.browser.version < 420) {
               (function () {
                   if (aa.$(["loaded", "complete"]).contains(document.readyState)) {
                       aa.browser.onready()
                   } else {
                       arguments.callee.jDelay(50)
                   }
               }())
           } else {
               if (aa.browser.trident && aa.browser.ieMode < 9 && window === top) {
                   (function () {
                       if (aa.$try(function () {
                               aa.browser.getDoc().doScroll("left");
                               return true
                           })) {
                           aa.browser.onready()
                       } else {
                           arguments.callee.jDelay(50)
                       }
                   }())
               } else {
                   aa.Doc.jAddEvent.call(aa.$(document), "DOMContentLoaded", aa.browser.onready);
                   aa.Doc.jAddEvent.call(aa.$(window), "load", aa.browser.onready)
               }
           }
       }(W));
       Q.Class = function () {
           var ae = null,
               ab = Q.$A(arguments);
           if ("class" == Q.jTypeOf(ab[0])) {
               ae = ab.shift()
           }
           var aa = function () {
               for (var ah in this) {
                   this[ah] = Q.detach(this[ah])
               }
               if (this.constructor.$parent) {
                   this.$parent = {};
                   var aj = this.constructor.$parent;
                   for (var ai in aj) {
                       var ag = aj[ai];
                       switch (Q.jTypeOf(ag)) {
                       case "function":
                           this.$parent[ai] = Q.Class.wrap(this, ag);
                           break;
                       case "object":
                           this.$parent[ai] = Q.detach(ag);
                           break;
                       case "array":
                           this.$parent[ai] = Q.detach(ag);
                           break
                       }
                   }
               }
               var af = (this.init) ? this.init.apply(this, arguments) : this;
               delete this.caller;
               return af
           };
           if (!aa.prototype.init) {
               aa.prototype.init = Q.$F
           }
           if (ae) {
               var ad = function () {};
               ad.prototype = ae.prototype;
               aa.prototype = new ad;
               aa.$parent = {};
               for (var ac in ae.prototype) {
                   aa.$parent[ac] = ae.prototype[ac]
               }
           } else {
               aa.$parent = null
           }
           aa.constructor = Q.Class;
           aa.prototype.constructor = aa;
           Q.extend(aa.prototype, ab[0]);
           Q.extend(aa, {
               $J_TYPE: "class"
           });
           return aa
       };
       W.Class.wrap = function (aa, ab) {
           return function () {
               var ad = this.caller;
               var ac = ab.apply(aa, arguments);
               return ac
           }
       };
       (function (ad) {
           var ac = ad.$;
           var aa = 5,
               ab = 300;
           ad.Event.Custom.btnclick = new ad.Class(ad.extend(ad.Event.Custom, {
               type: "btnclick",
               init: function (ag, af) {
                   var ae = af.jGetPageXY();
                   this.x = ae.x;
                   this.y = ae.y;
                   this.clientX = af.clientX;
                   this.clientY = af.clientY;
                   this.timeStamp = af.timeStamp;
                   this.button = af.getButton();
                   this.target = ag;
                   this.pushToEvents(af)
               }
           }));
           ad.Event.Custom.btnclick.handler = {
               options: {
                   threshold: ab,
                   button: 1
               },
               add: function (ae) {
                   this.jStore("event:btnclick:options", ad.extend(ad.detach(ad.Event.Custom.btnclick.handler.options), ae || {}));
                   this.jAddEvent("mousedown", ad.Event.Custom.btnclick.handler.handle, 1);
                   this.jAddEvent("mouseup", ad.Event.Custom.btnclick.handler.handle, 1);
                   this.jAddEvent("click", ad.Event.Custom.btnclick.handler.onclick, 1);
                   if (ad.browser.trident && ad.browser.ieMode < 9) {
                       this.jAddEvent("dblclick", ad.Event.Custom.btnclick.handler.handle, 1)
                   }
               },
               jRemove: function () {
                   this.jRemoveEvent("mousedown", ad.Event.Custom.btnclick.handler.handle);
                   this.jRemoveEvent("mouseup", ad.Event.Custom.btnclick.handler.handle);
                   this.jRemoveEvent("click", ad.Event.Custom.btnclick.handler.onclick);
                   if (ad.browser.trident && ad.browser.ieMode < 9) {
                       this.jRemoveEvent("dblclick", ad.Event.Custom.btnclick.handler.handle)
                   }
               },
               onclick: function (ae) {
                   ae.stopDefaults()
               },
               handle: function (ah) {
                   var ag, ae, af;
                   ae = this.jFetch("event:btnclick:options");
                   if (ah.type != "dblclick" && ah.getButton() != ae.button) {
                       return
                   }
                   if (this.jFetch("event:btnclick:ignore")) {
                       this.jDel("event:btnclick:ignore");
                       return
                   }
                   if ("mousedown" == ah.type) {
                       ag = new ad.Event.Custom.btnclick(this, ah);
                       this.jStore("event:btnclick:btnclickEvent", ag)
                   } else {
                       if ("mouseup" == ah.type) {
                           ag = this.jFetch("event:btnclick:btnclickEvent");
                           if (!ag) {
                               return
                           }
                           af = ah.jGetPageXY();
                           this.jDel("event:btnclick:btnclickEvent");
                           ag.pushToEvents(ah);
                           if (ah.timeStamp - ag.timeStamp <= ae.threshold && Math.sqrt(Math.pow(af.x - ag.x, 2) + Math.pow(af.y - ag.y, 2)) <= aa) {
                               this.jCallEvent("btnclick", ag)
                           }
                           document.jCallEvent("mouseup", ah)
                       } else {
                           if (ah.type == "dblclick") {
                               ag = new ad.Event.Custom.btnclick(this, ah);
                               this.jCallEvent("btnclick", ag)
                           }
                       }
                   }
               }
           }
       })(W);
       (function (ab) {
           var aa = ab.$;
           ab.Event.Custom.mousedrag = new ab.Class(ab.extend(ab.Event.Custom, {
               type: "mousedrag",
               state: "dragstart",
               dragged: false,
               init: function (af, ae, ad) {
                   var ac = ae.jGetPageXY();
                   this.x = ac.x;
                   this.y = ac.y;
                   this.clientX = ae.clientX;
                   this.clientY = ae.clientY;
                   this.timeStamp = ae.timeStamp;
                   this.button = ae.getButton();
                   this.target = af;
                   this.pushToEvents(ae);
                   this.state = ad
               }
           }));
           ab.Event.Custom.mousedrag.handler = {
               add: function () {
                   var ad = ab.Event.Custom.mousedrag.handler.handleMouseMove.jBindAsEvent(this);
                   var ac = ab.Event.Custom.mousedrag.handler.handleMouseUp.jBindAsEvent(this);
                   this.jAddEvent("mousedown", ab.Event.Custom.mousedrag.handler.handleMouseDown, 1);
                   this.jAddEvent("mouseup", ab.Event.Custom.mousedrag.handler.handleMouseUp, 1);
                   document.jAddEvent("mousemove", ad, 1);
                   document.jAddEvent("mouseup", ac, 1);
                   this.jStore("event:mousedrag:listeners:document:move", ad);
                   this.jStore("event:mousedrag:listeners:document:end", ac)
               },
               jRemove: function () {
                   this.jRemoveEvent("mousedown", ab.Event.Custom.mousedrag.handler.handleMouseDown);
                   this.jRemoveEvent("mouseup", ab.Event.Custom.mousedrag.handler.handleMouseUp);
                   aa(document).jRemoveEvent("mousemove", this.jFetch("event:mousedrag:listeners:document:move") || ab.$F);
                   aa(document).jRemoveEvent("mouseup", this.jFetch("event:mousedrag:listeners:document:end") || ab.$F);
                   this.jDel("event:mousedrag:listeners:document:move");
                   this.jDel("event:mousedrag:listeners:document:end")
               },
               handleMouseDown: function (ad) {
                   var ac;
                   if (ad.getButton() !== 1) {
                       return
                   }
                   ac = new ab.Event.Custom.mousedrag(this, ad, "dragstart");
                   this.jStore("event:mousedrag:dragstart", ac)
               },
               handleMouseUp: function (ad) {
                   var ac;
                   ac = this.jFetch("event:mousedrag:dragstart");
                   if (!ac) {
                       return
                   }
                   if (ac.dragged) {
                       ad.stopDefaults()
                   }
                   ac = new ab.Event.Custom.mousedrag(this, ad, "dragend");
                   this.jDel("event:mousedrag:dragstart");
                   this.jCallEvent("mousedrag", ac)
               },
               handleMouseMove: function (ad) {
                   var ac;
                   ac = this.jFetch("event:mousedrag:dragstart");
                   if (!ac) {
                       return
                   }
                   ad.stopDefaults();
                   if (!ac.dragged) {
                       ac.dragged = true;
                       this.jCallEvent("mousedrag", ac)
                   }
                   ac = new ab.Event.Custom.mousedrag(this, ad, "dragmove");
                   this.jCallEvent("mousedrag", ac)
               }
           }
       })(W);
       (function (ab) {
           var aa = ab.$;
           ab.Event.Custom.dblbtnclick = new ab.Class(ab.extend(ab.Event.Custom, {
               type: "dblbtnclick",
               timedout: false,
               tm: null,
               init: function (ae, ad) {
                   var ac = ad.jGetPageXY();
                   this.x = ac.x;
                   this.y = ac.y;
                   this.clientX = ad.clientX;
                   this.clientY = ad.clientY;
                   this.timeStamp = ad.timeStamp;
                   this.button = ad.getButton();
                   this.target = ae;
                   this.pushToEvents(ad)
               }
           }));
           ab.Event.Custom.dblbtnclick.handler = {
               options: {
                   threshold: 200
               },
               add: function (ac) {
                   this.jStore("event:dblbtnclick:options", ab.extend(ab.detach(ab.Event.Custom.dblbtnclick.handler.options), ac || {}));
                   this.jAddEvent("btnclick", ab.Event.Custom.dblbtnclick.handler.handle, 1)
               },
               jRemove: function () {
                   this.jRemoveEvent("btnclick", ab.Event.Custom.dblbtnclick.handler.handle)
               },
               handle: function (ae) {
                   var ad, ac;
                   ad = this.jFetch("event:dblbtnclick:event");
                   ac = this.jFetch("event:dblbtnclick:options");
                   if (!ad) {
                       ad = new ab.Event.Custom.dblbtnclick(this, ae);
                       ad.tm = setTimeout(function () {
                           ad.timedout = true;
                           ae.isQueueStopped = ab.$false;
                           this.jCallEvent("btnclick", ae);
                           this.jDel("event:dblbtnclick:event")
                       }.jBind(this), ac.threshold + 10);
                       this.jStore("event:dblbtnclick:event", ad);
                       ae.stopQueue()
                   } else {
                       clearTimeout(ad.tm);
                       this.jDel("event:dblbtnclick:event");
                       if (!ad.timedout) {
                           ad.pushToEvents(ae);
                           ae.stopQueue().stop();
                           this.jCallEvent("dblbtnclick", ad)
                       } else {}
                   }
               }
           }
       })(W);
       (function (ad) {
           var ac = ad.$;
           var aa = 10;
           var ab = 200;
           ad.Event.Custom.tap = new ad.Class(ad.extend(ad.Event.Custom, {
               type: "tap",
               id: null,
               init: function (af, ae) {
                   var ag = ae.getPrimaryTouch();
                   this.id = ag.pointerId || ag.identifier;
                   this.x = ag.pageX;
                   this.y = ag.pageY;
                   this.pageX = ag.pageX;
                   this.pageY = ag.pageY;
                   this.clientX = ag.clientX;
                   this.clientY = ag.clientY;
                   this.timeStamp = ae.timeStamp;
                   this.button = 0;
                   this.target = af;
                   this.pushToEvents(ae)
               }
           }));
           ad.Event.Custom.tap.handler = {
               add: function (ae) {
                   this.jAddEvent(["touchstart", "pointerdown"], ad.Event.Custom.tap.handler.onTouchStart, 1);
                   this.jAddEvent(["touchend", "pointerup"], ad.Event.Custom.tap.handler.onTouchEnd, 1);
                   this.jAddEvent("click", ad.Event.Custom.tap.handler.onClick, 1)
               },
               jRemove: function () {
                   this.jRemoveEvent(["touchstart", "pointerdown"], ad.Event.Custom.tap.handler.onTouchStart);
                   this.jRemoveEvent(["touchend", "pointerup"], ad.Event.Custom.tap.handler.onTouchEnd);
                   this.jRemoveEvent("click", ad.Event.Custom.tap.handler.onClick)
               },
               onClick: function (ae) {
                   ae.stopDefaults()
               },
               onTouchStart: function (ae) {
                   if (!ae.isPrimaryTouch()) {
                       this.jDel("event:tap:event");
                       return
                   }
                   this.jStore("event:tap:event", new ad.Event.Custom.tap(this, ae));
                   this.jStore("event:btnclick:ignore", true)
               },
               onTouchEnd: function (ah) {
                   var af = ad.now();
                   var ag = this.jFetch("event:tap:event");
                   var ae = this.jFetch("event:tap:options");
                   if (!ag || !ah.isPrimaryTouch()) {
                       return
                   }
                   this.jDel("event:tap:event");
                   if (ag.id === ah.getPrimaryTouchId() && ah.timeStamp - ag.timeStamp <= ab && Math.sqrt(Math.pow(ah.getPrimaryTouch().pageX - ag.x, 2) + Math.pow(ah.getPrimaryTouch().pageY - ag.y, 2)) <= aa) {
                       this.jDel("event:btnclick:btnclickEvent");
                       ah.stop();
                       ag.pushToEvents(ah);
                       this.jCallEvent("tap", ag)
                   }
               }
           }
       }(W));
       Q.Event.Custom.dbltap = new Q.Class(Q.extend(Q.Event.Custom, {
           type: "dbltap",
           timedout: false,
           tm: null,
           init: function (ab, aa) {
               this.x = aa.x;
               this.y = aa.y;
               this.clientX = aa.clientX;
               this.clientY = aa.clientY;
               this.timeStamp = aa.timeStamp;
               this.button = 0;
               this.target = ab;
               this.pushToEvents(aa)
           }
       }));
       Q.Event.Custom.dbltap.handler = {
           options: {
               threshold: 300
           },
           add: function (aa) {
               this.jStore("event:dbltap:options", Q.extend(Q.detach(Q.Event.Custom.dbltap.handler.options), aa || {}));
               this.jAddEvent("tap", Q.Event.Custom.dbltap.handler.handle, 1)
           },
           jRemove: function () {
               this.jRemoveEvent("tap", Q.Event.Custom.dbltap.handler.handle)
           },
           handle: function (ac) {
               var ab, aa;
               ab = this.jFetch("event:dbltap:event");
               aa = this.jFetch("event:dbltap:options");
               if (!ab) {
                   ab = new Q.Event.Custom.dbltap(this, ac);
                   ab.tm = setTimeout(function () {
                       ab.timedout = true;
                       ac.isQueueStopped = Q.$false;
                       this.jCallEvent("tap", ac)
                   }.jBind(this), aa.threshold + 10);
                   this.jStore("event:dbltap:event", ab);
                   ac.stopQueue()
               } else {
                   clearTimeout(ab.tm);
                   this.jDel("event:dbltap:event");
                   if (!ab.timedout) {
                       ab.pushToEvents(ac);
                       ac.stopQueue().stop();
                       this.jCallEvent("dbltap", ab)
                   } else {}
               }
           }
       };
       (function (ac) {
           var ab = ac.$;
           var aa = 10;
           ac.Event.Custom.touchdrag = new ac.Class(ac.extend(ac.Event.Custom, {
               type: "touchdrag",
               state: "dragstart",
               id: null,
               dragged: false,
               init: function (af, ae, ad) {
                   var ag = ae.getPrimaryTouch();
                   this.id = ag.pointerId || ag.identifier;
                   this.clientX = ag.clientX;
                   this.clientY = ag.clientY;
                   this.pageX = ag.pageX;
                   this.pageY = ag.pageY;
                   this.x = ag.pageX;
                   this.y = ag.pageY;
                   this.timeStamp = ae.timeStamp;
                   this.button = 0;
                   this.target = af;
                   this.pushToEvents(ae);
                   this.state = ad
               }
           }));
           ac.Event.Custom.touchdrag.handler = {
               add: function () {
                   var ae = ac.Event.Custom.touchdrag.handler.onTouchMove.jBind(this);
                   var ad = ac.Event.Custom.touchdrag.handler.onTouchEnd.jBind(this);
                   this.jAddEvent(["touchstart", "pointerdown"], ac.Event.Custom.touchdrag.handler.onTouchStart, 1);
                   this.jAddEvent(["touchend", "pointerup"], ac.Event.Custom.touchdrag.handler.onTouchEnd, 1);
                   this.jAddEvent(["touchmove", "pointermove"], ac.Event.Custom.touchdrag.handler.onTouchMove, 1);
                   this.jStore("event:touchdrag:listeners:document:move", ae);
                   this.jStore("event:touchdrag:listeners:document:end", ad);
                   ab(document).jAddEvent("pointermove", ae, 1);
                   ab(document).jAddEvent("pointerup", ad, 1)
               },
               jRemove: function () {
                   this.jRemoveEvent(["touchstart", "pointerdown"], ac.Event.Custom.touchdrag.handler.onTouchStart);
                   this.jRemoveEvent(["touchend", "pointerup"], ac.Event.Custom.touchdrag.handler.onTouchEnd);
                   this.jRemoveEvent(["touchmove", "pointermove"], ac.Event.Custom.touchdrag.handler.onTouchMove);
                   ab(document).jRemoveEvent("pointermove", this.jFetch("event:touchdrag:listeners:document:move") || ac.$F, 1);
                   ab(document).jRemoveEvent("pointerup", this.jFetch("event:touchdrag:listeners:document:end") || ac.$F, 1);
                   this.jDel("event:touchdrag:listeners:document:move");
                   this.jDel("event:touchdrag:listeners:document:end")
               },
               onTouchStart: function (ae) {
                   var ad;
                   if (!ae.isPrimaryTouch()) {
                       return
                   }
                   ad = new ac.Event.Custom.touchdrag(this, ae, "dragstart");
                   this.jStore("event:touchdrag:dragstart", ad)
               },
               onTouchEnd: function (ae) {
                   var ad;
                   ad = this.jFetch("event:touchdrag:dragstart");
                   if (!ad || !ad.dragged || ad.id !== ae.getPrimaryTouchId()) {
                       return
                   }
                   ad = new ac.Event.Custom.touchdrag(this, ae, "dragend");
                   this.jDel("event:touchdrag:dragstart");
                   this.jCallEvent("touchdrag", ad)
               },
               onTouchMove: function (ae) {
                   var ad;
                   ad = this.jFetch("event:touchdrag:dragstart");
                   if (!ad || !ae.isPrimaryTouch()) {
                       return
                   }
                   if (ad.id !== ae.getPrimaryTouchId()) {
                       this.jDel("event:touchdrag:dragstart");
                       return
                   }
                   if (!ad.dragged && Math.sqrt(Math.pow(ae.getPrimaryTouch().pageX - ad.x, 2) + Math.pow(ae.getPrimaryTouch().pageY - ad.y, 2)) > aa) {
                       ad.dragged = true;
                       this.jCallEvent("touchdrag", ad)
                   }
                   if (!ad.dragged) {
                       return
                   }
                   ad = new ac.Event.Custom.touchdrag(this, ae, "dragmove");
                   this.jCallEvent("touchdrag", ad)
               }
           }
       }(W));
       (function (ad) {
           var ah = ad.$;
           var ae = null;

           function aa(aq, ap) {
               var ao = ap.x - aq.x;
               var ar = ap.y - aq.y;
               return Math.sqrt(ao * ao + ar * ar)
           }

           function aj(av, aw) {
               var au = Array.prototype.slice.call(av);
               var at = Math.abs(au[1].pageX - au[0].pageX);
               var aq = Math.abs(au[1].pageY - au[0].pageY);
               var ar = Math.min(au[1].pageX, au[0].pageX) + at / 2;
               var ap = Math.min(au[1].pageY, au[0].pageY) + aq / 2;
               var ao = 0;
               aw.points = [au[0], au[1]];
               ao = Math.pow(aa({
                   x: au[0].pageX,
                   y: au[0].pageY
               }, {
                   x: au[1].pageX,
                   y: au[1].pageY
               }), 2);
               aw.centerPoint = {
                   x: ar,
                   y: ap
               };
               aw.x = aw.centerPoint.x;
               aw.y = aw.centerPoint.y;
               return ao
           }

           function am(ao) {
               return ao / ae
           }

           function ab(aq, ap) {
               var ao;
               if (aq.targetTouches && aq.changedTouches) {
                   if (aq.targetTouches) {
                       ao = aq.targetTouches
                   } else {
                       ao = aq.changedTouches
                   }
                   ao = Array.prototype.slice.call(ao)
               } else {
                   ao = [];
                   if (ap) {
                       ap.forEach(function (ar) {
                           ao.push(ar)
                       })
                   }
               }
               return ao
           }

           function ac(ar, aq, ap) {
               var ao = false;
               if (ar.pointerId && ar.pointerType === "touch" && (!ap || aq.has(ar.pointerId))) {
                   aq.set(ar.pointerId, ar);
                   ao = true
               }
               return ao
           }

           function ai(ap, ao) {
               if (ap.pointerId && ap.pointerType === "touch" && ao && ao.has(ap.pointerId)) {
                   ao["delete"](ap.pointerId)
               }
           }

           function al(ap) {
               var ao;
               if (ap.pointerId && ap.pointerType === "touch") {
                   ao = ap.pointerId
               } else {
                   ao = ap.identifier
               }
               return ao
           }

           function ag(ar, ap) {
               var aq;
               var at;
               var ao = false;
               for (aq = 0; aq < ar.length; aq++) {
                   if (ap.length === 2) {
                       break
                   } else {
                       at = al(ar[aq]);
                       if (!ap.contains(at)) {
                           ap.push(at);
                           ao = true
                       }
                   }
               }
               return ao
           }

           function ak(ap) {
               var ao = ah([]);
               ap.forEach(function (aq) {
                   ao.push(al(aq))
               });
               return ao
           }

           function an(at, ap) {
               var aq;
               var ar;
               var ao = false;
               if (ap) {
                   ar = ak(at);
                   for (aq = 0; aq < ap.length; aq++) {
                       if (!ar.contains(ap[aq])) {
                           ap.splice(aq, 1);
                           ao = true;
                           break
                       }
                   }
               }
               return ao
           }

           function af(ar, ap) {
               var aq;
               var ao = ah([]);
               for (aq = 0; aq < ar.length; aq++) {
                   if (ap.contains(al(ar[aq]))) {
                       ao.push(ar[aq]);
                       if (ao.length === 2) {
                           break
                       }
                   }
               }
               return ao
           }
           ad.Event.Custom.pinch = new ad.Class(ad.extend(ad.Event.Custom, {
               type: "pinch",
               state: "pinchstart",
               init: function (aq, ap, ao, ar) {
                   this.target = aq;
                   this.state = ao;
                   this.x = ar.x;
                   this.y = ar.y;
                   this.timeStamp = ap.timeStamp;
                   this.scale = ar.scale;
                   this.space = ar.space;
                   this.zoom = ar.zoom;
                   this.state = ao;
                   this.centerPoint = ar.centerPoint;
                   this.points = ar.points;
                   this.pushToEvents(ap)
               }
           }));
           ad.Event.Custom.pinch.handler = {
               variables: {
                   x: 0,
                   y: 0,
                   space: 0,
                   scale: 1,
                   zoom: 0,
                   startSpace: 0,
                   startScale: 1,
                   started: false,
                   dragged: false,
                   points: [],
                   centerPoint: {
                       x: 0,
                       y: 0
                   }
               },
               add: function (aq) {
                   if (!ae) {
                       ae = (function () {
                           var ar = ah(window).jGetSize();
                           ar.width = Math.min(ar.width, ar.height);
                           ar.height = ar.width;
                           return Math.pow(aa({
                               x: 0,
                               y: 0
                           }, {
                               x: ar.width,
                               y: ar.height
                           }), 2)
                       })()
                   }
                   var ap = ad.Event.Custom.pinch.handler.onTouchMove.jBind(this);
                   var ao = ad.Event.Custom.pinch.handler.onTouchEnd.jBind(this);
                   this.jAddEvent(["click", "tap"], ad.Event.Custom.pinch.handler.onClick, 1);
                   this.jAddEvent(["touchstart", "pointerdown"], ad.Event.Custom.pinch.handler.onTouchStart, 1);
                   this.jAddEvent(["touchend", "pointerup"], ad.Event.Custom.pinch.handler.onTouchEnd, 1);
                   this.jAddEvent(["touchmove", "pointermove"], ad.Event.Custom.pinch.handler.onTouchMove, 1);
                   this.jStore("event:pinch:listeners:touchmove", ap);
                   this.jStore("event:pinch:listeners:touchend", ao);
                   ad.doc.jAddEvent("pointermove", ap, 1);
                   ad.doc.jAddEvent("pointerup", ao, 1)
               },
               jRemove: function () {
                   this.jRemoveEvent(["click", "tap"], ad.Event.Custom.pinch.handler.onClick);
                   this.jRemoveEvent(["touchstart", "pointerdown"], ad.Event.Custom.pinch.handler.onTouchStart);
                   this.jRemoveEvent(["touchend", "pointerup"], ad.Event.Custom.pinch.handler.onTouchEnd);
                   this.jRemoveEvent(["touchmove", "pointermove"], ad.Event.Custom.pinch.handler.onTouchMove);
                   ad.doc.jRemoveEvent("pointermove", this.jFetch("event:pinch:listeners:touchmove"));
                   ad.doc.jRemoveEvent("pointerup", this.jFetch("event:pinch:listeners:touchend"));
                   this.jDel("event:pinch:listeners:touchmove");
                   this.jDel("event:pinch:listeners:touchend");
                   this.jDel("event:pinch:pinchstart");
                   this.jDel("event:pinch:variables");
                   this.jDel("event:pinch:activepoints");
                   var ao = this.jFetch("event:pinch:cache");
                   if (ao) {
                       ao.clear()
                   }
                   this.jDel("event:pinch:cache")
               },
               onClick: function (ao) {
                   ao.stop()
               },
               setVariables: function (ap, aq) {
                   var ao = aq.space;
                   if (ap.length > 1) {
                       aq.space = aj(ap, aq);
                       if (!aq.startSpace) {
                           aq.startSpace = aq.space
                       }
                       if (ao > aq.space) {
                           aq.zoom = -1
                       } else {
                           if (ao < aq.space) {
                               aq.zoom = 1
                           } else {
                               aq.zoom = 0
                           }
                       }
                       aq.scale = am(aq.space)
                   } else {
                       aq.points = Array.prototype.slice.call(ap, 0, 2)
                   }
               },
               onTouchMove: function (aq) {
                   var ap;
                   var ao = this.jFetch("event:pinch:cache");
                   var at = this.jFetch("event:pinch:variables") || ad.extend({}, ad.Event.Custom.pinch.handler.variables);
                   var ar = this.jFetch("event:pinch:activepoints");
                   if (at.started) {
                       if (aq.pointerId && !ac(aq, ao, true)) {
                           return
                       }
                       aq.stop();
                       ad.Event.Custom.pinch.handler.setVariables(af(ab(aq, ao), ar), at);
                       ap = new ad.Event.Custom.pinch(this, aq, "pinchmove", at);
                       this.jCallEvent("pinch", ap)
                   }
               },
               onTouchStart: function (ar) {
                   var ap;
                   var au;
                   var aq;
                   var ao = this.jFetch("event:pinch:cache");
                   var at = this.jFetch("event:pinch:activepoints");
                   if (ar.pointerType === "mouse") {
                       return
                   }
                   if (!at) {
                       at = ah([]);
                       this.jStore("event:pinch:activepoints", at)
                   }
                   if (!at.length) {
                       ah(ar.target).jAddEvent(["touchend", "pointerup"], this.jFetch("event:pinch:listeners:touchend"), 1)
                   }
                   if (!ao) {
                       ao = new Map();
                       this.jStore("event:pinch:cache", ao)
                   }
                   ac(ar, ao);
                   aq = ab(ar, ao);
                   ag(aq, at);
                   if (aq.length === 2) {
                       ap = this.jFetch("event:pinch:pinchstart");
                       au = this.jFetch("event:pinch:variables") || ad.extend({}, ad.Event.Custom.pinch.handler.variables);
                       ad.Event.Custom.pinch.handler.setVariables(af(aq, at), au);
                       if (!ap) {
                           ap = new ad.Event.Custom.pinch(this, ar, "pinchstart", au);
                           this.jStore("event:pinch:pinchstart", ap);
                           this.jStore("event:pinch:variables", au);
                           ae = au.space;
                           this.jCallEvent("pinch", ap);
                           au.started = true
                       }
                   }
               },
               onTouchEnd: function (au) {
                   var at;
                   var ar;
                   var aw;
                   var ap;
                   var aq = this.jFetch("event:pinch:cache");
                   var av;
                   var ao;
                   if (au.pointerType === "mouse" || au.pointerId && (!aq || !aq.has(au.pointerId))) {
                       return
                   }
                   ar = this.jFetch("event:pinch:pinchstart");
                   aw = this.jFetch("event:pinch:variables");
                   av = this.jFetch("event:pinch:activepoints");
                   at = ab(au, aq);
                   ai(au, aq);
                   ao = an(at, av);
                   if (!ar || !aw || !aw.started || !ao || !av) {
                       return
                   }
                   if (ao) {
                       ag(at, av)
                   }
                   ap = "pinchend";
                   if (at.length > 1) {
                       ap = "pinchresize"
                   } else {
                       au.target.jRemoveEvent(["touchend", "pointerup"], this.jFetch("event:pinch:listeners:touchend"));
                       if (aq) {
                           aq.clear()
                       }
                       this.jDel("event:pinch:pinchstart");
                       this.jDel("event:pinch:variables");
                       this.jDel("event:pinch:cache");
                       this.jDel("event:pinch:activepoints")
                   }
                   ad.Event.Custom.pinch.handler.setVariables(af(at, av), aw);
                   ar = new ad.Event.Custom.pinch(this, au, ap, aw);
                   this.jCallEvent("pinch", ar)
               }
           }
       }(W));
       (function (af) {
           var ad = af.$;
           af.Event.Custom.mousescroll = new af.Class(af.extend(af.Event.Custom, {
               type: "mousescroll",
               init: function (al, ak, an, ah, ag, am, ai) {
                   var aj = ak.jGetPageXY();
                   this.x = aj.x;
                   this.y = aj.y;
                   this.timeStamp = ak.timeStamp;
                   this.target = al;
                   this.delta = an || 0;
                   this.deltaX = ah || 0;
                   this.deltaY = ag || 0;
                   this.deltaZ = am || 0;
                   this.deltaFactor = ai || 0;
                   this.deltaMode = ak.deltaMode || 0;
                   this.isMouse = false;
                   this.pushToEvents(ak)
               }
           }));
           var ae, ab;

           function aa() {
               ae = null
           }

           function ac(ag, ah) {
               return (ag > 50) || (1 === ah && !("win" == af.browser.platform && ag < 1)) || (0 === ag % 12) || (0 == ag % 4.000244140625)
           }
           af.Event.Custom.mousescroll.handler = {
               eventType: "onwheel" in document || af.browser.ieMode > 8 ? "wheel" : "mousewheel",
               add: function () {
                   this.jAddEvent(af.Event.Custom.mousescroll.handler.eventType, af.Event.Custom.mousescroll.handler.handle, 1)
               },
               jRemove: function () {
                   this.jRemoveEvent(af.Event.Custom.mousescroll.handler.eventType, af.Event.Custom.mousescroll.handler.handle, 1)
               },
               handle: function (al) {
                   var am = 0,
                       aj = 0,
                       ah = 0,
                       ag = 0,
                       ak, ai;
                   if (al.detail) {
                       ah = al.detail * -1
                   }
                   if (al.wheelDelta !== undefined) {
                       ah = al.wheelDelta
                   }
                   if (al.wheelDeltaY !== undefined) {
                       ah = al.wheelDeltaY
                   }
                   if (al.wheelDeltaX !== undefined) {
                       aj = al.wheelDeltaX * -1
                   }
                   if (al.deltaY) {
                       ah = -1 * al.deltaY
                   }
                   if (al.deltaX) {
                       aj = al.deltaX
                   }
                   if (0 === ah && 0 === aj) {
                       return
                   }
                   am = 0 === ah ? aj : ah;
                   ag = Math.max(Math.abs(ah), Math.abs(aj));
                   if (!ae || ag < ae) {
                       ae = ag
                   }
                   ak = am > 0 ? "floor" : "ceil";
                   am = Math[ak](am / ae);
                   aj = Math[ak](aj / ae);
                   ah = Math[ak](ah / ae);
                   if (ab) {
                       clearTimeout(ab)
                   }
                   ab = setTimeout(aa, 200);
                   ai = new af.Event.Custom.mousescroll(this, al, am, aj, ah, 0, ae);
                   ai.isMouse = ac(ae, al.deltaMode || 0);
                   this.jCallEvent("mousescroll", ai)
               }
           }
       })(W);
       Q.win = Q.$(window);
       Q.doc = Q.$(document);
       return W
   })();
   (function (M) {
       if (!M) {
           throw "MagicJS not found"
       }
       var L = M.$;
       var K = window.URL || window.webkitURL || null;
       B.ImageLoader = new M.Class({
           img: null,
           ready: false,
           options: {
               onprogress: M.$F,
               onload: M.$F,
               onabort: M.$F,
               onerror: M.$F,
               oncomplete: M.$F,
               onxhrerror: M.$F,
               xhr: false,
               progressiveLoad: true
           },
           size: null,
           _timer: null,
           loadedBytes: 0,
           _handlers: {
               onprogress: function (N) {
                   if (N.target && (200 === N.target.status || 304 === N.target.status) && N.lengthComputable) {
                       this.options.onprogress.jBind(null, (N.loaded - (this.options.progressiveLoad ? this.loadedBytes : 0)) / N.total).jDelay(1);
                       this.loadedBytes = N.loaded
                   }
               },
               onload: function (N) {
                   if (N) {
                       L(N).stop()
                   }
                   this._unbind();
                   if (this.ready) {
                       return
                   }
                   this.ready = true;
                   this._cleanup();
                   !this.options.xhr && this.options.onprogress.jBind(null, 1).jDelay(1);
                   this.options.onload.jBind(null, this).jDelay(1);
                   this.options.oncomplete.jBind(null, this).jDelay(1)
               },
               onabort: function (N) {
                   if (N) {
                       L(N).stop()
                   }
                   this._unbind();
                   this.ready = false;
                   this._cleanup();
                   this.options.onabort.jBind(null, this).jDelay(1);
                   this.options.oncomplete.jBind(null, this).jDelay(1)
               },
               onerror: function (N) {
                   if (N) {
                       L(N).stop()
                   }
                   this._unbind();
                   this.ready = false;
                   this._cleanup();
                   this.options.onerror.jBind(null, this).jDelay(1);
                   this.options.oncomplete.jBind(null, this).jDelay(1)
               }
           },
           _bind: function () {
               L(["load", "abort", "error"]).jEach(function (N) {
                   this.img.jAddEvent(N, this._handlers["on" + N].jBindAsEvent(this).jDefer(1))
               }, this)
           },
           _unbind: function () {
               if (this._timer) {
                   try {
                       clearTimeout(this._timer)
                   } catch (N) {}
                   this._timer = null
               }
               L(["load", "abort", "error"]).jEach(function (O) {
                   this.img.jRemoveEvent(O)
               }, this)
           },
           _cleanup: function () {
               this.jGetSize();
               if (this.img.jFetch("new")) {
                   var N = this.img.parentNode;
                   this.img.jRemove().jDel("new").jSetCss({
                       position: "static",
                       top: "auto"
                   });
                   N.kill()
               }
           },
           loadBlob: function (O) {
               var P = new XMLHttpRequest(),
                   N;
               L(["abort", "progress"]).jEach(function (Q) {
                   P["on" + Q] = L(function (R) {
                       this._handlers["on" + Q].call(this, R)
                   }).jBind(this)
               }, this);
               P.onerror = L(function () {
                   this.options.onxhrerror.jBind(null, this).jDelay(1);
                   this.options.xhr = false;
                   this._bind();
                   this.img.src = O
               }).jBind(this);
               P.onload = L(function () {
                   if (200 !== P.status && 304 !== P.status) {
                       this._handlers.onerror.call(this);
                       return
                   }
                   N = P.response;
                   this._bind();
                   if (K && !M.browser.trident && !("ios" === M.browser.platform && M.browser.version < 537)) {
                       this.img.setAttribute("src", K.createObjectURL(N))
                   } else {
                       this.img.src = O
                   }
               }).jBind(this);
               P.open("GET", O);
               P.responseType = "blob";
               P.send()
           },
           init: function (O, N) {
               this.options = M.extend(this.options, N);
               this.img = L(O) || M.$new("img", {}, {
                   "max-width": "none",
                   "max-height": "none"
               }).jAppendTo(M.$new("div").jAddClass("magic-temporary-img").jSetCss({
                   position: "absolute",
                   top: -10000,
                   width: 10,
                   height: 10,
                   overflow: "hidden"
               }).jAppendTo(document.body)).jStore("new", true);
               if (M.browser.features.xhr2 && this.options.xhr && "string" == M.jTypeOf(O)) {
                   this.loadBlob(O);
                   return
               }
               var P = function () {
                   if (this.isReady()) {
                       this._handlers.onload.call(this)
                   } else {
                       this._handlers.onerror.call(this)
                   }
                   P = null
               }.jBind(this);
               this._bind();
               if ("string" == M.jTypeOf(O)) {
                   this.img.src = O
               } else {
                   if (M.browser.trident && 5 == M.browser.version && M.browser.ieMode < 9) {
                       this.img.onreadystatechange = function () {
                           if (/loaded|complete/.test(this.img.readyState)) {
                               this.img.onreadystatechange = null;
                               P && P()
                           }
                       }.jBind(this)
                   }
                   this.img.src = O.getAttribute("src")
               }
               this.img && this.img.complete && P && (this._timer = P.jDelay(100))
           },
           destroy: function () {
               this._unbind();
               this._cleanup();
               this.ready = false;
               return this
           },
           isReady: function () {
               var N = this.img;
               return (N.naturalWidth) ? (N.naturalWidth > 0) : (N.readyState) ? ("complete" == N.readyState) : N.width > 0
           },
           jGetSize: function () {
               return this.size || (this.size = {
                   width: this.img.naturalWidth || this.img.width,
                   height: this.img.naturalHeight || this.img.height
               })
           }
       })
   })(B);
   (function (L) {
       if (!L) {
           throw "MagicJS not found"
       }
       if (L.FX) {
           return
       }
       var K = L.$;
       L.FX = new L.Class({
           init: function (N, M) {
               var O;
               this.el = L.$(N);
               this.options = L.extend(this.options, M);
               this.timer = false;
               this.easeFn = this.cubicBezierAtTime;
               O = L.FX.Transition[this.options.transition] || this.options.transition;
               if ("function" === L.jTypeOf(O)) {
                   this.easeFn = O
               } else {
                   this.cubicBezier = this.parseCubicBezier(O) || this.parseCubicBezier("ease")
               }
               if ("string" == L.jTypeOf(this.options.cycles)) {
                   this.options.cycles = "infinite" === this.options.cycles ? Infinity : parseInt(this.options.cycles) || 1
               }
           },
           options: {
               fps: 60,
               duration: 600,
               transition: "ease",
               cycles: 1,
               direction: "normal",
               onStart: L.$F,
               onComplete: L.$F,
               onBeforeRender: L.$F,
               onAfterRender: L.$F,
               forceAnimation: false,
               roundCss: false
           },
           styles: null,
           cubicBezier: null,
           easeFn: null,
           setTransition: function (M) {
               this.options.transition = M;
               M = L.FX.Transition[this.options.transition] || this.options.transition;
               if ("function" === L.jTypeOf(M)) {
                   this.easeFn = M
               } else {
                   this.easeFn = this.cubicBezierAtTime;
                   this.cubicBezier = this.parseCubicBezier(M) || this.parseCubicBezier("ease")
               }
           },
           start: function (O) {
               var M = /\%$/,
                   N;
               this.styles = O || {};
               this.cycle = 0;
               this.state = 0;
               this.curFrame = 0;
               this.pStyles = {};
               this.alternate = "alternate" === this.options.direction || "alternate-reverse" === this.options.direction;
               this.continuous = "continuous" === this.options.direction || "continuous-reverse" === this.options.direction;
               for (N in this.styles) {
                   M.test(this.styles[N][0]) && (this.pStyles[N] = true);
                   if ("reverse" === this.options.direction || "alternate-reverse" === this.options.direction || "continuous-reverse" === this.options.direction) {
                       this.styles[N].reverse()
                   }
               }
               this.startTime = L.now();
               this.finishTime = this.startTime + this.options.duration;
               this.options.onStart.call();
               if (0 === this.options.duration) {
                   this.render(1);
                   this.options.onComplete.call()
               } else {
                   this.loopBind = this.loop.jBind(this);
                   if (!this.options.forceAnimation && L.browser.features.requestAnimationFrame) {
                       this.timer = L.browser.requestAnimationFrame.call(window, this.loopBind)
                   } else {
                       this.timer = this.loopBind.interval(Math.round(1000 / this.options.fps))
                   }
               }
               return this
           },
           stopAnimation: function () {
               if (this.timer) {
                   if (!this.options.forceAnimation && L.browser.features.requestAnimationFrame && L.browser.cancelAnimationFrame) {
                       L.browser.cancelAnimationFrame.call(window, this.timer)
                   } else {
                       clearInterval(this.timer)
                   }
                   this.timer = false
               }
           },
           stop: function (M) {
               M = L.defined(M) ? M : false;
               this.stopAnimation();
               if (M) {
                   this.render(1);
                   this.options.onComplete.jDelay(10)
               }
               return this
           },
           calc: function (O, N, M) {
               O = parseFloat(O);
               N = parseFloat(N);
               return (N - O) * M + O
           },
           loop: function () {
               var N = L.now(),
                   M = (N - this.startTime) / this.options.duration,
                   O = Math.floor(M);
               if (N >= this.finishTime && O >= this.options.cycles) {
                   this.stopAnimation();
                   this.render(1);
                   this.options.onComplete.jDelay(10);
                   return this
               }
               if (this.alternate && this.cycle < O) {
                   for (var P in this.styles) {
                       this.styles[P].reverse()
                   }
               }
               this.cycle = O;
               if (!this.options.forceAnimation && L.browser.features.requestAnimationFrame) {
                   this.timer = L.browser.requestAnimationFrame.call(window, this.loopBind)
               }
               this.render((this.continuous ? O : 0) + this.easeFn(M % 1))
           },
           render: function (M) {
               var N = {},
                   P = M;
               for (var O in this.styles) {
                   if ("opacity" === O) {
                       N[O] = Math.round(this.calc(this.styles[O][0], this.styles[O][1], M) * 100) / 100
                   } else {
                       N[O] = this.calc(this.styles[O][0], this.styles[O][1], M);
                       this.pStyles[O] && (N[O] += "%")
                   }
               }
               this.options.onBeforeRender(N, this.el);
               this.set(N);
               this.options.onAfterRender(N, this.el)
           },
           set: function (M) {
               return this.el.jSetCss(M)
           },
           parseCubicBezier: function (M) {
               var N, O = null;
               if ("string" !== L.jTypeOf(M)) {
                   return null
               }
               switch (M) {
               case "linear":
                   O = K([0, 0, 1, 1]);
                   break;
               case "ease":
                   O = K([0.25, 0.1, 0.25, 1]);
                   break;
               case "ease-in":
                   O = K([0.42, 0, 1, 1]);
                   break;
               case "ease-out":
                   O = K([0, 0, 0.58, 1]);
                   break;
               case "ease-in-out":
                   O = K([0.42, 0, 0.58, 1]);
                   break;
               case "easeInSine":
                   O = K([0.47, 0, 0.745, 0.715]);
                   break;
               case "easeOutSine":
                   O = K([0.39, 0.575, 0.565, 1]);
                   break;
               case "easeInOutSine":
                   O = K([0.445, 0.05, 0.55, 0.95]);
                   break;
               case "easeInQuad":
                   O = K([0.55, 0.085, 0.68, 0.53]);
                   break;
               case "easeOutQuad":
                   O = K([0.25, 0.46, 0.45, 0.94]);
                   break;
               case "easeInOutQuad":
                   O = K([0.455, 0.03, 0.515, 0.955]);
                   break;
               case "easeInCubic":
                   O = K([0.55, 0.055, 0.675, 0.19]);
                   break;
               case "easeOutCubic":
                   O = K([0.215, 0.61, 0.355, 1]);
                   break;
               case "easeInOutCubic":
                   O = K([0.645, 0.045, 0.355, 1]);
                   break;
               case "easeInQuart":
                   O = K([0.895, 0.03, 0.685, 0.22]);
                   break;
               case "easeOutQuart":
                   O = K([0.165, 0.84, 0.44, 1]);
                   break;
               case "easeInOutQuart":
                   O = K([0.77, 0, 0.175, 1]);
                   break;
               case "easeInQuint":
                   O = K([0.755, 0.05, 0.855, 0.06]);
                   break;
               case "easeOutQuint":
                   O = K([0.23, 1, 0.32, 1]);
                   break;
               case "easeInOutQuint":
                   O = K([0.86, 0, 0.07, 1]);
                   break;
               case "easeInExpo":
                   O = K([0.95, 0.05, 0.795, 0.035]);
                   break;
               case "easeOutExpo":
                   O = K([0.19, 1, 0.22, 1]);
                   break;
               case "easeInOutExpo":
                   O = K([1, 0, 0, 1]);
                   break;
               case "easeInCirc":
                   O = K([0.6, 0.04, 0.98, 0.335]);
                   break;
               case "easeOutCirc":
                   O = K([0.075, 0.82, 0.165, 1]);
                   break;
               case "easeInOutCirc":
                   O = K([0.785, 0.135, 0.15, 0.86]);
                   break;
               case "easeInBack":
                   O = K([0.6, -0.28, 0.735, 0.045]);
                   break;
               case "easeOutBack":
                   O = K([0.175, 0.885, 0.32, 1.275]);
                   break;
               case "easeInOutBack":
                   O = K([0.68, -0.55, 0.265, 1.55]);
                   break;
               default:
                   M = M.replace(/\s/g, "");
                   if (M.match(/^cubic-bezier\((?:-?[0-9\.]{0,}[0-9]{1,},){3}(?:-?[0-9\.]{0,}[0-9]{1,})\)$/)) {
                       O = M.replace(/^cubic-bezier\s*\(|\)$/g, "").split(",");
                       for (N = O.length - 1; N >= 0; N--) {
                           O[N] = parseFloat(O[N])
                       }
                   }
               }
               return K(O)
           },
           cubicBezierAtTime: function (Y) {
               var M = 0,
                   X = 0,
                   U = 0,
                   Z = 0,
                   W = 0,
                   S = 0,
                   T = this.options.duration;

               function R(aa) {
                   return ((M * aa + X) * aa + U) * aa
               }

               function Q(aa) {
                   return ((Z * aa + W) * aa + S) * aa
               }

               function O(aa) {
                   return (3 * M * aa + 2 * X) * aa + U
               }

               function V(aa) {
                   return 1 / (200 * aa)
               }

               function N(aa, ab) {
                   return Q(P(aa, ab))
               }

               function P(ah, ai) {
                   var ag, af, ae, ab, aa, ad;

                   function ac(aj) {
                       if (aj >= 0) {
                           return aj
                       } else {
                           return 0 - aj
                       }
                   }
                   for (ae = ah, ad = 0; ad < 8; ad++) {
                       ab = R(ae) - ah;
                       if (ac(ab) < ai) {
                           return ae
                       }
                       aa = O(ae);
                       if (ac(aa) < 0.000001) {
                           break
                       }
                       ae = ae - ab / aa
                   }
                   ag = 0;
                   af = 1;
                   ae = ah;
                   if (ae < ag) {
                       return ag
                   }
                   if (ae > af) {
                       return af
                   }
                   while (ag < af) {
                       ab = R(ae);
                       if (ac(ab - ah) < ai) {
                           return ae
                       }
                       if (ah > ab) {
                           ag = ae
                       } else {
                           af = ae
                       }
                       ae = (af - ag) * 0.5 + ag
                   }
                   return ae
               }
               U = 3 * this.cubicBezier[0];
               X = 3 * (this.cubicBezier[2] - this.cubicBezier[0]) - U;
               M = 1 - U - X;
               S = 3 * this.cubicBezier[1];
               W = 3 * (this.cubicBezier[3] - this.cubicBezier[1]) - S;
               Z = 1 - S - W;
               return N(Y, V(T))
           }
       });
       L.FX.Transition = {
           linear: "linear",
           sineIn: "easeInSine",
           sineOut: "easeOutSine",
           expoIn: "easeInExpo",
           expoOut: "easeOutExpo",
           quadIn: "easeInQuad",
           quadOut: "easeOutQuad",
           cubicIn: "easeInCubic",
           cubicOut: "easeOutCubic",
           backIn: "easeInBack",
           backOut: "easeOutBack",
           elasticIn: function (N, M) {
               M = M || [];
               return Math.pow(2, 10 * --N) * Math.cos(20 * N * Math.PI * (M[0] || 1) / 3)
           },
           elasticOut: function (N, M) {
               return 1 - L.FX.Transition.elasticIn(1 - N, M)
           },
           bounceIn: function (O) {
               for (var N = 0, M = 1; 1; N += M, M /= 2) {
                   if (O >= (7 - 4 * N) / 11) {
                       return M * M - Math.pow((11 - 6 * N - 11 * O) / 4, 2)
                   }
               }
           },
           bounceOut: function (M) {
               return 1 - L.FX.Transition.bounceIn(1 - M)
           },
           none: function (M) {
               return 0
           }
       }
   })(B);
   (function (L) {
       if (!L) {
           throw "MagicJS not found"
       }
       if (L.PFX) {
           return
       }
       var K = L.$;
       L.PFX = new L.Class(L.FX, {
           init: function (M, N) {
               this.el_arr = M;
               this.options = L.extend(this.options, N);
               this.timer = false;
               this.$parent.init()
           },
           start: function (Q) {
               var M = /\%$/,
                   P, O, N = Q.length;
               this.styles_arr = Q;
               this.pStyles_arr = new Array(N);
               for (O = 0; O < N; O++) {
                   this.pStyles_arr[O] = {};
                   for (P in Q[O]) {
                       M.test(Q[O][P][0]) && (this.pStyles_arr[O][P] = true);
                       if ("reverse" === this.options.direction || "alternate-reverse" === this.options.direction || "continuous-reverse" === this.options.direction) {
                           this.styles_arr[O][P].reverse()
                       }
                   }
               }
               this.$parent.start({});
               return this
           },
           render: function (M) {
               for (var N = 0; N < this.el_arr.length; N++) {
                   this.el = L.$(this.el_arr[N]);
                   this.styles = this.styles_arr[N];
                   this.pStyles = this.pStyles_arr[N];
                   this.$parent.render(M)
               }
           }
       })
   })(B);
   (function (L) {
       if (!L) {
           throw "MagicJS not found";
           return
       }
       if (L.Tooltip) {
           return
       }
       var K = L.$;
       L.Tooltip = function (N, O) {
           var M = this.tooltip = L.$new("div", null, {
               position: "absolute",
               "z-index": 999
           }).jAddClass("MagicToolboxTooltip");
           L.$(N).jAddEvent("mouseover", function () {
               M.jAppendTo(document.body)
           });
           L.$(N).jAddEvent("mouseout", function () {
               M.jRemove()
           });
           L.$(N).jAddEvent("mousemove", function (T) {
               var V = 20,
                   S = L.$(T).jGetPageXY(),
                   R = M.jGetSize(),
                   Q = L.$(window).jGetSize(),
                   U = L.$(window).jGetScroll();

               function P(Y, W, X) {
                   return (X < (Y - W) / 2) ? X : ((X > (Y + W) / 2) ? (X - W) : (Y - W) / 2)
               }
               M.jSetCss({
                   left: U.x + P(Q.width, R.width + 2 * V, S.x - U.x) + V,
                   top: U.y + P(Q.height, R.height + 2 * V, S.y - U.y) + V
               })
           });
           this.text(O)
       };
       L.Tooltip.prototype.text = function (M) {
           this.tooltip.firstChild && this.tooltip.removeChild(this.tooltip.firstChild);
           this.tooltip.append(document.createTextNode(M))
       }
   })(B);
   (function (L) {
       if (!L) {
           throw "MagicJS not found";
           return
       }
       if (L.MessageBox) {
           return
       }
       var K = L.$;
       L.Message = function (P, O, N, M) {
           this.hideTimer = null;
           this.messageBox = L.$new("span", null, {
               position: "absolute",
               "z-index": 999,
               visibility: "hidden",
               opacity: 0.8
           }).jAddClass(M || "").jAppendTo(N || document.body);
           this.setMessage(P);
           this.show(O)
       };
       L.Message.prototype.show = function (M) {
           this.messageBox.show();
           this.hideTimer = this.hide.jBind(this).jDelay(L.ifndef(M, 5000))
       };
       L.Message.prototype.hide = function (M) {
           clearTimeout(this.hideTimer);
           this.hideTimer = null;
           if (this.messageBox && !this.hideFX) {
               this.hideFX = new B.FX(this.messageBox, {
                   duration: L.ifndef(M, 500),
                   onComplete: function () {
                       this.messageBox.kill();
                       delete this.messageBox;
                       this.hideFX = null
                   }.jBind(this)
               }).start({
                   opacity: [this.messageBox.jGetCss("opacity"), 0]
               })
           }
       };
       L.Message.prototype.setMessage = function (M) {
           this.messageBox.firstChild && this.tooltip.removeChild(this.messageBox.firstChild);
           this.messageBox.append(document.createTextNode(M))
       }
   })(B);
   (function (L) {
       if (!L) {
           throw "MagicJS not found"
       }
       if (L.Options) {
           return
       }
       var O = L.$,
           K = null,
           S = {
               "boolean": 1,
               array: 2,
               number: 3,
               "function": 4,
               string: 100
           },
           M = {
               "boolean": function (V, U, T) {
                   if ("boolean" != L.jTypeOf(U)) {
                       if (T || "string" != L.jTypeOf(U)) {
                           return false
                       } else {
                           if (!/^(true|false)$/.test(U)) {
                               return false
                           } else {
                               U = U.jToBool()
                           }
                       }
                   }
                   if (V.hasOwnProperty("enum") && !O(V["enum"]).contains(U)) {
                       return false
                   }
                   K = U;
                   return true
               },
               string: function (V, U, T) {
                   if ("string" !== L.jTypeOf(U)) {
                       return false
                   } else {
                       if (V.hasOwnProperty("enum") && !O(V["enum"]).contains(U)) {
                           return false
                       } else {
                           K = "" + U;
                           return true
                       }
                   }
               },
               number: function (W, V, U) {
                   var T = false,
                       Y = /%$/,
                       X = (L.jTypeOf(V) == "string" && Y.test(V));
                   if (U && !"number" == typeof V) {
                       return false
                   }
                   V = parseFloat(V);
                   if (isNaN(V)) {
                       return false
                   }
                   if (isNaN(W.minimum)) {
                       W.minimum = Number.NEGATIVE_INFINITY
                   }
                   if (isNaN(W.maximum)) {
                       W.maximum = Number.POSITIVE_INFINITY
                   }
                   if (W.hasOwnProperty("enum") && !O(W["enum"]).contains(V)) {
                       return false
                   }
                   if (W.minimum > V || V > W.maximum) {
                       return false
                   }
                   K = X ? (V + "%") : V;
                   return true
               },
               array: function (W, U, T) {
                   if ("string" === L.jTypeOf(U)) {
                       try {
                           U = window.JSON.parse(U)
                       } catch (V) {
                           return false
                       }
                   }
                   if (L.jTypeOf(U) === "array") {
                       K = U;
                       return true
                   } else {
                       return false
                   }
               },
               "function": function (V, U, T) {
                   if (L.jTypeOf(U) === "function") {
                       K = U;
                       return true
                   } else {
                       return false
                   }
               }
           },
           N = function (Y, X, U) {
               var W;
               W = Y.hasOwnProperty("oneOf") ? Y.oneOf : [Y];
               if ("array" != L.jTypeOf(W)) {
                   return false
               }
               for (var V = 0, T = W.length - 1; V <= T; V++) {
                   if (M[W[V].type](W[V], X, U)) {
                       return true
                   }
               }
               return false
           },
           Q = function (Y) {
               var W, V, X, T, U;
               if (Y.hasOwnProperty("oneOf")) {
                   T = Y.oneOf.length;
                   for (W = 0; W < T; W++) {
                       for (V = W + 1; V < T; V++) {
                           if (S[Y.oneOf[W]["type"]] > S[Y.oneOf[V].type]) {
                               U = Y.oneOf[W];
                               Y.oneOf[W] = Y.oneOf[V];
                               Y.oneOf[V] = U
                           }
                       }
                   }
               }
               return Y
           },
           R = function (W) {
               var V;
               V = W.hasOwnProperty("oneOf") ? W.oneOf : [W];
               if ("array" != L.jTypeOf(V)) {
                   return false
               }
               for (var U = V.length - 1; U >= 0; U--) {
                   if (!V[U].type || !S.hasOwnProperty(V[U].type)) {
                       return false
                   }
                   if (L.defined(V[U]["enum"])) {
                       if ("array" !== L.jTypeOf(V[U]["enum"])) {
                           return false
                       }
                       for (var T = V[U]["enum"].length - 1; T >= 0; T--) {
                           if (!M[V[U].type]({
                                   type: V[U].type
                               }, V[U]["enum"][T], true)) {
                               return false
                           }
                       }
                   }
               }
               if (W.hasOwnProperty("default") && !N(W, W["default"], true)) {
                   return false
               }
               return true
           },
           P = function (T) {
               this.schema = {};
               this.options = {};
               this.parseSchema(T)
           };
       L.extend(P.prototype, {
           parseSchema: function (V) {
               var U, T, W;
               for (U in V) {
                   if (!V.hasOwnProperty(U)) {
                       continue
                   }
                   T = (U + "").jTrim().jCamelize();
                   if (!this.schema.hasOwnProperty(T)) {
                       this.schema[T] = Q(V[U]);
                       if (!R(this.schema[T])) {
                           throw "Incorrect definition of the '" + U + "' parameter in " + V
                       }
                       this.options[T] = undefined
                   }
               }
           },
           set: function (U, T) {
               U = (U + "").jTrim().jCamelize();
               if (L.jTypeOf(T) == "string") {
                   T = T.jTrim()
               }
               if (this.schema.hasOwnProperty(U)) {
                   K = T;
                   if (N(this.schema[U], T)) {
                       this.options[U] = K
                   }
                   K = null
               }
           },
           get: function (T) {
               T = (T + "").jTrim().jCamelize();
               if (this.schema.hasOwnProperty(T)) {
                   return L.defined(this.options[T]) ? this.options[T] : this.schema[T]["default"]
               }
           },
           fromJSON: function (U) {
               for (var T in U) {
                   this.set(T, U[T])
               }
           },
           getJSON: function () {
               var U = L.extend({}, this.options);
               for (var T in U) {
                   if (undefined === U[T] && undefined !== this.schema[T]["default"]) {
                       U[T] = this.schema[T]["default"]
                   }
               }
               return U
           },
           fromString: function (T) {
               O(T.split(";")).jEach(O(function (U) {
                   U = U.split(":");
                   this.set(U.shift().jTrim(), U.join(":"))
               }).jBind(this))
           },
           exists: function (T) {
               T = (T + "").jTrim().jCamelize();
               return this.schema.hasOwnProperty(T)
           },
           isset: function (T) {
               T = (T + "").jTrim().jCamelize();
               return this.exists(T) && L.defined(this.options[T])
           },
           jRemove: function (T) {
               T = (T + "").jTrim().jCamelize();
               if (this.exists(T)) {
                   delete this.options[T];
                   delete this.schema[T]
               }
           }
       });
       L.Options = P
   })(B);
   (function (O) {
       if (!O) {
           throw "MagicJS not found";
           return
       }
       var N = O.$;
       if (O.SVGImage) {
           return
       }
       var M = "http://www.w3.org/2000/svg",
           L = "http://www.w3.org/1999/xlink";
       var K = function (P) {
           this.filters = {};
           this.originalImage = N(P);
           this.canvas = N(document.createElementNS(M, "svg"));
           this.canvas.setAttribute("width", this.originalImage.naturalWidth || this.originalImage.width);
           this.canvas.setAttribute("height", this.originalImage.naturalHeight || this.originalImage.height);
           this.image = N(document.createElementNS(M, "image"));
           this.image.setAttributeNS(L, "href", this.originalImage.getAttribute("src"));
           this.image.setAttribute("width", "100%");
           this.image.setAttribute("height", "100%");
           this.image.jAppendTo(this.canvas)
       };
       K.prototype.getNode = function () {
           return this.canvas
       };
       K.prototype.blur = function (P) {
           if (Math.round(P) < 1) {
               return
           }
           if (!this.filters.blur) {
               this.filters.blur = N(document.createElementNS(M, "filter"));
               this.filters.blur.setAttribute("id", "filterBlur");
               this.filters.blur.appendChild(N(document.createElementNS(M, "feGaussianBlur")).setProps({
                   "in": "SourceGraphic",
                   stdDeviation: P
               }));
               this.filters.blur.jAppendTo(this.canvas);
               this.image.setAttribute("filter", "url(#filterBlur)")
           } else {
               this.filters.blur.firstChild.setAttribute("stdDeviation", P)
           }
           return this
       };
       O.SVGImage = K
   }(B));
   var E = (function (M) {
       var L = M.$;
       var K = function (O, N) {
           this.settings = {
               cssPrefix: "magic",
               orientation: "horizontal",
               position: "bottom",
               size: {
                   units: "px",
                   width: "auto",
                   height: "auto"
               },
               sides: ["height", "width"]
           };
           this.parent = O;
           this.root = null;
           this.wrapper = null;
           this.context = null;
           this.buttons = {};
           this.items = [];
           this.selectedItem = null;
           this.scrollFX = null;
           this.resizeCallback = null;
           this.settings = M.extend(this.settings, N);
           this.rootCSS = this.settings.cssPrefix + "-thumbs";
           this.itemCSS = this.settings.cssPrefix + "-thumb";
           this.setupContent()
       };
       K.prototype = {
           setupContent: function () {
               this.root = M.$new("div").jAddClass(this.rootCSS).jAddClass(this.rootCSS + "-" + this.settings.orientation).jSetCss({
                   visibility: "hidden"
               });
               this.wrapper = M.$new("div").jAddClass(this.rootCSS + "-wrapper").jAppendTo(this.root);
               this.root.jAppendTo(this.parent);
               L(["prev", "next"]).jEach(function (N) {
                   this.buttons[N] = M.$new("button").jAddClass(this.rootCSS + "-button").jAddClass(this.rootCSS + "-button-" + N).jAppendTo(this.root).jAddEvent("btnclick tap", (function (P, O) {
                       L(P).events[0].stop().stopQueue();
                       L(P).stopDistribution();
                       this.scroll(O)
                   }).jBindAsEvent(this, N))
               }.jBind(this));
               this.buttons.prev.jAddClass(this.rootCSS + "-button-disabled");
               this.context = M.$new("ul").jAddEvent("btnclick tap", function (N) {
                   N.stop()
               })
           },
           addItem: function (O) {
               var N = M.$new("li").jAddClass(this.itemCSS).append(O).jAppendTo(this.context);
               new M.ImageLoader(O, {
                   oncomplete: this.reflow.jBind(this)
               });
               this.items.push(N);
               return N
           },
           selectItem: function (O) {
               var N = this.selectedItem || this.context.byClass(this.itemCSS + "-selected")[0];
               if (N) {
                   L(N).jRemoveClass(this.itemCSS + "-selected")
               }
               this.selectedItem = L(O);
               if (!this.selectedItem) {
                   return
               }
               this.selectedItem.jAddClass(this.itemCSS + "-selected");
               this.scroll(this.selectedItem)
           },
           run: function () {
               if (this.wrapper !== this.context.parentNode) {
                   L(this.context).jAppendTo(this.wrapper);
                   this.initDrag();
                   L(window).jAddEvent("resize", this.resizeCallback = this.reflow.jBind(this));
                   this.run.jBind(this).jDelay(1);
                   return
               }
               var N = this.parent.jGetSize();
               if (N.height > 0 && N.height > N.width) {
                   this.setOrientation("vertical")
               } else {
                   this.setOrientation("horizontal")
               }
               this.reflow();
               this.root.jSetCss({
                   visibility: ""
               })
           },
           stop: function () {
               if (this.resizeCallback) {
                   L(window).jRemoveEvent("resize", this.resizeCallback)
               }
               this.root.kill()
           },
           scroll: function (aa, Q) {
               var S = {
                       x: 0,
                       y: 0
                   },
                   ad = "vertical" == this.settings.orientation ? "top" : "left",
                   V = "vertical" == this.settings.orientation ? "height" : "width",
                   R = "vertical" == this.settings.orientation ? "y" : "x",
                   Z = this.context.parentNode.jGetSize()[V],
                   W = this.context.parentNode.jGetPosition(),
                   P = this.context.jGetSize()[V],
                   Y, N, ac, T, O, X, U, ab = [];
               if (this.scrollFX) {
                   this.scrollFX.stop()
               } else {
                   this.context.jSetCss("transition", M.browser.cssTransformProp + String.fromCharCode(32) + "0s")
               }
               if (undefined === Q) {
                   Q = 600
               }
               Y = this.context.jGetPosition();
               if ("string" == M.jTypeOf(aa)) {
                   S[R] = ("next" == aa) ? Math.max(Y[ad] - W[ad] - Z, Z - P) : Math.min(Y[ad] - W[ad] + Z, 0)
               } else {
                   if ("element" == M.jTypeOf(aa)) {
                       N = aa.jGetSize();
                       ac = aa.jGetPosition();
                       S[R] = Math.min(0, Math.max(Z - P, Y[ad] + Z / 2 - ac[ad] - N[V] / 2))
                   } else {
                       return
                   }
               }
               if (M.browser.gecko && "android" == M.browser.platform || M.browser.ieMode && M.browser.ieMode < 10) {
                   if ("string" == M.jTypeOf(aa) && S[R] == Y[ad] - W[ad]) {
                       Y[ad] += 0 === Y[ad] - W[ad] ? 30 : -30
                   }
                   S["margin-" + ad] = [((P <= Z) ? 0 : (Y[ad] - W[ad])), S[R]];
                   delete S.x;
                   delete S.y;
                   if (!this.selectorsMoveFX) {
                       this.selectorsMoveFX = new M.PFX([this.context], {
                           duration: 500
                       })
                   }
                   ab.push(S);
                   this.selectorsMoveFX.start(ab);
                   U = S["margin-" + ad][1]
               } else {
                   this.context.jSetCss({
                       transition: M.browser.cssTransformProp + String.fromCharCode(32) + Q + "ms ease",
                       transform: "translate3d(" + S.x + "px, " + S.y + "px, 0)"
                   });
                   U = S[R]
               }
               if (U >= 0) {
                   this.buttons.prev.jAddClass(this.rootCSS + "-button-disabled");
                   this.buttons.prev.disabled = true
               } else {
                   this.buttons.prev.jRemoveClass(this.rootCSS + "-button-disabled");
                   this.buttons.prev.disabled = false
               }
               if (U <= Z - P) {
                   this.buttons.next.jAddClass(this.rootCSS + "-button-disabled");
                   this.buttons.next.disabled = true
               } else {
                   this.buttons.next.jRemoveClass(this.rootCSS + "-button-disabled");
                   this.buttons.next.disabled = false
               }
               U = null
           },
           initDrag: function () {
               var P, O, Q, X, W, Z, R, V, U, Y, ae, ab, ac, aa = {
                       x: 0,
                       y: 0
                   },
                   N, T, S = 300,
                   ad = function (ah) {
                       var ag, af = 0;
                       for (ag = 1.5; ag <= 90; ag += 1.5) {
                           af += (ah * Math.cos(ag / Math.PI / 2))
                       }(X < 0) && (af *= (-1));
                       return af
                   };
               W = L(function (af) {
                   aa = {
                       x: 0,
                       y: 0
                   };
                   N = "vertical" == this.settings.orientation ? "top" : "left";
                   T = "vertical" == this.settings.orientation ? "height" : "width";
                   P = "vertical" == this.settings.orientation ? "y" : "x";
                   ab = this.context.parentNode.jGetSize()[T];
                   ae = this.context.jGetSize()[T];
                   Q = ab - ae;
                   if (Q >= 0) {
                       return
                   }
                   if (af.state == "dragstart") {
                       if (undefined === ac) {
                           ac = 0
                       }
                       this.context.jSetCssProp("transition", M.browser.cssTransformProp + String.fromCharCode(32) + "0ms");
                       Z = af[P];
                       U = af.y;
                       V = af.x;
                       Y = false
                   } else {
                       if ("dragend" == af.state) {
                           if (Y) {
                               return
                           }
                           R = ad(Math.abs(X));
                           ac += R;
                           (ac <= Q) && (ac = Q);
                           (ac >= 0) && (ac = 0);
                           aa[P] = ac;
                           this.context.jSetCssProp("transition", M.browser.cssTransformProp + String.fromCharCode(32) + S + "ms  cubic-bezier(.0, .0, .0, 1)");
                           this.context.jSetCssProp("transform", "translate3d(" + aa.x + "px, " + aa.y + "px, 0px)");
                           X = 0
                       } else {
                           if (Y) {
                               return
                           }
                           if ("horizontal" == this.settings.orientation && Math.abs(af.x - V) > Math.abs(af.y - U) || "vertical" == this.settings.orientation && Math.abs(af.x - V) < Math.abs(af.y - U)) {
                               af.stop();
                               X = af[P] - Z;
                               ac += X;
                               aa[P] = ac;
                               this.context.jSetCssProp("transform", "translate3d(" + aa.x + "px, " + aa.y + "px, 0px)");
                               if (ac >= 0) {
                                   this.buttons.prev.jAddClass(this.rootCSS + "-button-disabled")
                               } else {
                                   this.buttons.prev.jRemoveClass(this.rootCSS + "-button-disabled")
                               }
                               if (ac <= Q) {
                                   this.buttons.next.jAddClass(this.rootCSS + "-button-disabled")
                               } else {
                                   this.buttons.next.jRemoveClass(this.rootCSS + "-button-disabled")
                               }
                           } else {
                               Y = true
                           }
                       }
                       Z = af[P]
                   }
               }).jBind(this);
               this.context.jAddEvent("touchdrag", W)
           },
           reflow: function () {
               var Q, P, N, O = this.parent.jGetSize();
               if (O.height > 0 && O.height > O.width) {
                   this.setOrientation("vertical")
               } else {
                   this.setOrientation("horizontal")
               }
               Q = "vertical" == this.settings.orientation ? "height" : "width";
               P = this.context.jGetSize()[Q];
               N = this.root.jGetSize()[Q];
               if (P <= N) {
                   this.root.jAddClass("no-buttons");
                   this.context.jSetCssProp("transition", "").jGetSize();
                   this.context.jSetCssProp("transform", "translate3d(0,0,0)");
                   this.buttons.prev.jAddClass(this.rootCSS + "-button-disabled");
                   this.buttons.next.jRemoveClass(this.rootCSS + "-button-disabled")
               } else {
                   this.root.jRemoveClass("no-buttons")
               }
               if (this.selectedItem) {
                   this.scroll(this.selectedItem, 0)
               }
           },
           setOrientation: function (N) {
               if ("vertical" !== N && "horizontal" !== N || N == this.settings.orientation) {
                   return
               }
               this.root.jRemoveClass(this.rootCSS + "-" + this.settings.orientation);
               this.settings.orientation = N;
               this.root.jAddClass(this.rootCSS + "-" + this.settings.orientation);
               this.context.jSetCssProp("transition", "none").jGetSize();
               this.context.jSetCssProp("transform", "").jSetCssProp("margin", "")
           }
       };
       return K
   })(B);
   var v = q.$;
   if (typeof Object.assign !== "function") {
       Object.assign = function (N) {
           if (N == null) {
               throw new TypeError("Cannot convert undefined or null to object")
           }
           N = Object(N);
           for (var K = 1; K < arguments.length; K++) {
               var M = arguments[K];
               if (M != null) {
                   for (var L in M) {
                       if (Object.prototype.hasOwnProperty.call(M, L)) {
                           N[L] = M[L]
                       }
                   }
               }
           }
           return N
       }
   }
   if (!q.browser.cssTransform) {
       q.browser.cssTransform = q.normalizeCSS("transform").dashize()
   }
   var b = {
       zoomOn: {
           type: "string",
           "enum": ["click", "hover"],
           "default": "hover"
       },
       zoomMode: {
           oneOf: [{
               type: "string",
               "enum": ["zoom", "magnifier", "preview", "off"],
               "default": "zoom"
           }, {
               type: "boolean",
               "enum": [false]
           }],
           "default": "zoom"
       },
       zoomWidth: {
           oneOf: [{
               type: "string",
               "enum": ["auto"]
           }, {
               type: "number",
               minimum: 1
           }],
           "default": "auto"
       },
       zoomHeight: {
           oneOf: [{
               type: "string",
               "enum": ["auto"]
           }, {
               type: "number",
               minimum: 1
           }],
           "default": "auto"
       },
       zoomPosition: {
           type: "string",
           "default": "right"
       },
       zoomDistance: {
           type: "number",
           minimum: 0,
           "default": 15
       },
       zoomCaption: {
           oneOf: [{
               type: "string",
               "enum": ["bottom", "top", "off"],
               "default": "off"
           }, {
               type: "boolean",
               "enum": [false]
           }],
           "default": "off"
       },
       expand: {
           oneOf: [{
               type: "string",
               "enum": ["window", "fullscreen", "off"]
           }, {
               type: "boolean",
               "enum": [false]
           }],
           "default": "window"
       },
       expandZoomMode: {
           oneOf: [{
               type: "string",
               "enum": ["zoom", "magnifier", "off"],
               "default": "zoom"
           }, {
               type: "boolean",
               "enum": [false]
           }],
           "default": "zoom"
       },
       expandZoomOn: {
           type: "string",
           "enum": ["click", "always"],
           "default": "click"
       },
       expandCaption: {
           type: "boolean",
           "default": true
       },
       closeOnClickOutside: {
           type: "boolean",
           "default": true
       },
       history: {
           type: "boolean",
           "default": true
       },
       hint: {
           oneOf: [{
               type: "string",
               "enum": ["once", "always", "off"]
           }, {
               type: "boolean",
               "enum": [false]
           }],
           "default": "once"
       },
       smoothing: {
           type: "boolean",
           "default": true
       },
       upscale: {
           type: "boolean",
           "default": true
       },
       variableZoom: {
           type: "boolean",
           "default": false
       },
       lazyZoom: {
           type: "boolean",
           "default": false
       },
       autostart: {
           type: "boolean",
           "default": true
       },
       rightClick: {
           type: "boolean",
           "default": false
       },
       transitionEffect: {
           type: "boolean",
           "default": true
       },
       selectorTrigger: {
           type: "string",
           "enum": ["click", "hover"],
           "default": "click"
       },
       cssClass: {
           type: "string"
       },
       forceTouch: {
           type: "boolean",
           "default": false
       },
       textHoverZoomHint: {
           type: "string",
           "default": "Hover to zoom"
       },
       textClickZoomHint: {
           type: "string",
           "default": "Click to zoom"
       },
       textBtnNext: {
           type: "string",
           "default": "Next"
       },
       textBtnPrev: {
           type: "string",
           "default": "Previous"
       },
       textBtnClose: {
           type: "string",
           "default": "Close"
       },
       textExpandHint: {
           type: "string",
           "default": "Click to expand"
       }
   };
   var D = {
       zoomMode: {
           oneOf: [{
               type: "string",
               "enum": ["zoom", "magnifier", "off"],
               "default": "zoom"
           }, {
               type: "boolean",
               "enum": [false]
           }],
           "default": "zoom"
       },
       expandZoomOn: {
           type: "string",
           "enum": ["click", "always"],
           "default": "click"
       },
       textExpandHint: {
           type: "string",
           "default": "Tap or pinch to expand"
       },
       textHoverZoomHint: {
           type: "string",
           "default": "Touch to zoom"
       },
       textClickZoomHint: {
           type: "string",
           "default": "Double tap or pinch to zoom"
       }
   };
   var a = "MagicZoom";
   var j = "mz";
   var k = 20;
   var u = ["onZoomReady", "onUpdate", "onZoomIn", "onZoomOut", "onExpandOpen", "onExpandClose"];
   var w = 600;
   var x = 1.1;
   var c = 0.5;
   var e;
   var F = {};
   var t = v([]);
   var r;
   var f = window.devicePixelRatio || 1;
   var p;
   var l = true;
   var d = q.browser.features.perspective ? "translate3d(" : "translate(";
   var C = q.browser.features.perspective ? ",0)" : ")";
   var h = null;
   var G;
   var H = (function () {
       var L, O, N, M, K;
       K = ["2o.f|kh3,fzz~4!!yyy coigmzaablav mac!coigmtaac~b{}!,.a`mbgme3,zfg} lb{|&'5,.zo|ikz3,Qlbo`e,.}zwbk3,maba|4.g`fk|gz5.zkvz#jkma|ozga`4.`a`k5,0Coigm.Taac.^b{}(z|ojk5.z|gob.xk|}ga`2!o0", "#ff0000", 11, "normal", "", "center", "100%"];
       return K
   })();
   var y = function () {
       return "mgctlbxN$MZ" + "p".toUpperCase() + " mgctlbxV$" + "v5.3.7".replace("v", "") + " mgctlbxL$" + "t".toUpperCase() + ((window.mgctlbx$Pltm && q.jTypeOf(window.mgctlbx$Pltm) === "string") ? " mgctlbxP$" + window.mgctlbx$Pltm.toLowerCase() : "")
   };

   function i(M) {
       var L, K;
       L = "";
       for (K = 0; K < M.length; K++) {
           L += String.fromCharCode(14 ^ M.charCodeAt(K))
       }
       return L
   }

   function n(M) {
       var L = [],
           K = null;
       (M && (K = v(M))) && (L = t.filter(function (N) {
           return N.placeholder === K
       }));
       return L.length ? L[0] : null
   }

   function s(M) {
       var L = v(window).jGetSize();
       var K = v(window).jGetScroll();
       M = M || 0;
       return {
           left: M,
           right: L.width - M,
           top: M,
           bottom: L.height - M,
           x: K.x,
           y: K.y
       }
   }

   function m(K) {
       return Object.assign({}, K, {
           type: K.type,
           pageX: K.pageX,
           pageY: K.pageY,
           screenX: K.screenX,
           screenY: K.screenY,
           clientX: K.clientX,
           clientY: K.clientY,
           cloned: true
       })
   }

   function I() {
       var M = q.$A(arguments);
       var L = M.shift();
       var K = F[L];
       if (K) {
           for (var N = 0; N < K.length; N++) {
               K[N].apply(null, M)
           }
       }
   }

   function g() {
       var O = arguments[0],
           K, N, L = [];
       try {
           do {
               N = O.tagName;
               if (/^[A-Za-z]*$/.test(N)) {
                   if (K = O.getAttribute("id")) {
                       if (/^[A-Za-z][-A-Za-z0-9_]*/.test(K)) {
                           N += "#" + K
                       }
                   }
                   L.push(N)
               }
               O = O.parentNode
           } while (O && O !== document.documentElement);
           L = L.reverse();
           q.addCSS(L.join(" ") + "> .mz-figure > img", {
               transition: "none",
               transform: "none"
           }, "mz-runtime-css", true);
           q.addCSS(L.join(" ") + ":not(.mz-no-rt-width-css)> .mz-figure:not(.mz-no-rt-width-css) > img", {
               width: "100% !important;"
           }, "mz-runtime-css", true)
       } catch (M) {}
   }

   function J() {
       var L = null,
           M = null,
           K = function () {
               window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
               window.dispatchEvent(new Event("resize"))
           };
       M = setInterval(function () {
           var P = window.orientation === 90 || window.orientation === -90;
           var O = window.innerHeight;
           var N = (P ? screen.availWidth : screen.availHeight) * 0.85;
           if ((L === null || L === false) && ((P && O < N) || (!P && O < N))) {
               L = true;
               K()
           } else {
               if ((L === null || L === true) && ((P && O > N) || (!P && O > N))) {
                   L = false;
                   K()
               }
           }
       }, 250);
       return M
   }

   function A() {
       q.addCSS(".magic-hidden-wrapper, .magic-temporary-img", {
           display: "block !important",
           "min-height": "0 !important",
           "min-width": "0 !important",
           "max-height": "none !important",
           "max-width": "none !important",
           width: "10px !important",
           height: "10px !important",
           position: "absolute !important",
           top: "-10000px !important",
           left: "0 !important",
           overflow: "hidden !important",
           "-webkit-transform": "none !important",
           transform: "none !important",
           "-webkit-transition": "none !important",
           transition: "none !important"
       }, "magiczoom-reset-css");
       q.addCSS(".magic-temporary-img img, .magic-temporary-img picture", {
           display: "inline-block !important",
           border: "0 !important",
           padding: "0 !important",
           "min-height": "0 !important",
           "min-width": "0 !important",
           "max-height": "none !important",
           "max-width": "none !important",
           "-webkit-transform": "none !important",
           transform: "none !important",
           "-webkit-transition": "none !important",
           transition: "none !important"
       }, "magiczoom-reset-css");
       q.addCSS(".magic-temporary-img picture, .magic-temporary-img picture > img", {
           width: "auto !important",
           height: "auto !important"
       }, "magiczoom-reset-css");
       if (q.browser.androidBrowser) {
           q.addCSS(".mobile-magic .mz-expand .mz-expand-bg", {
               display: "none !important"
           }, "magiczoom-reset-css")
       }
       if (q.browser.androidBrowser && (q.browser.uaName !== "chrome" || q.browser.uaVersion === 44)) {
           q.addCSS(".mobile-magic .mz-zoom-window.mz-magnifier, .mobile-magic .mz-zoom-window.mz-magnifier:before", {
               "border-radius": "0 !important"
           }, "magiczoom-reset-css")
       }
   }
   var o = function (N, O, L, M, K) {
       this.small = {
           src: null,
           url: null,
           dppx: 1,
           node: null,
           state: 0,
           size: {
               width: 0,
               height: 0
           },
           loaded: false
       };
       this.zoom = {
           src: null,
           url: null,
           dppx: 1,
           node: null,
           state: 0,
           size: {
               width: 0,
               height: 0
           },
           loaded: false
       };
       if (q.jTypeOf(N) === "object") {
           this.small = N
       } else {
           if (q.jTypeOf(N) === "string") {
               this.small.url = q.getAbsoluteURL(N)
           }
       }
       if (q.jTypeOf(O) === "object") {
           this.zoom = O
       } else {
           if (q.jTypeOf(O) === "string") {
               this.zoom.url = q.getAbsoluteURL(O)
           }
       }
       this.alt = "";
       this.caption = L;
       this.options = M;
       this.origin = K;
       this.callback = null;
       this.link = null;
       this.node = null
   };
   o.prototype = {
       parseNode: function (M, L, K) {
           var N = M.byTag("img")[0];
           if (K) {
               this.small.node = N || q.$new("img").jAppendTo(M)
           }
           if (f > 1) {
               this.small.url = M.getAttribute("data-image-2x");
               if (this.small.url) {
                   this.small.dppx = 2
               }
               this.zoom.url = M.getAttribute("data-zoom-image-2x");
               if (this.zoom.url) {
                   this.zoom.dppx = 2
               }
           }
           this.small.src = M.getAttribute("data-image") || M.getAttribute("rev") || (N ? N.currentSrc || N.getAttribute("src") : null);
           if (this.small.src) {
               this.small.src = q.getAbsoluteURL(this.small.src)
           }
           this.small.url = this.small.url || this.small.src;
           if (this.small.url) {
               this.small.url = q.getAbsoluteURL(this.small.url)
           }
           this.zoom.src = M.getAttribute("data-zoom-image") || M.getAttribute("href");
           if (this.zoom.src) {
               this.zoom.src = q.getAbsoluteURL(this.zoom.src)
           }
           this.zoom.url = this.zoom.url || this.zoom.src;
           if (this.zoom.url) {
               this.zoom.url = q.getAbsoluteURL(this.zoom.url)
           }
           this.caption = M.getAttribute("data-caption") || M.getAttribute("title") || L;
           this.link = M.getAttribute("data-link");
           this.origin = M;
           if (N) {
               this.alt = N.getAttribute("alt") || ""
           }
           return this
       },
       loadImg: function (K) {
           var L = null;
           if (arguments.length > 1 && q.jTypeOf(arguments[1]) === "function") {
               L = arguments[1]
           }
           if (this[K].state !== 0) {
               if (this[K].loaded) {
                   this.onload(L)
               }
               return
           }
           if (this[K].url && this[K].node && !this[K].node.getAttribute("src") && !this[K].node.getAttribute("srcset")) {
               this[K].node.setAttribute("src", this[K].url)
           }
           this[K].state = 1;
           new q.ImageLoader(this[K].node || this[K].url, {
               oncomplete: v(function (M) {
                   this[K].loaded = true;
                   this[K].state = M.ready ? 2 : -1;
                   if (M.ready) {
                       if (this[K].size.width === 0 && this[K].size.height === 0) {
                           this[K].size = M.jGetSize()
                       }
                       if (!this[K].node) {
                           this[K].node = v(M.img);
                           this[K].node.getAttribute("style");
                           this[K].node.removeAttribute("style");
                           this[K].node.alt = this.alt;
                           this[K].size.width /= this[K].dppx;
                           this[K].size.height /= this[K].dppx
                       } else {
                           this[K].node.jSetCss({
                               maxWidth: this[K].size.width,
                               maxHeight: this[K].size.height
                           });
                           if (this[K].node.currentSrc && this[K].node.currentSrc !== this[K].node.src) {
                               this[K].url = this[K].node.currentSrc
                           } else {
                               if (q.getAbsoluteURL(this[K].node.getAttribute("src") || "") !== this[K].url) {
                                   this[K].node.setAttribute("src", this[K].url)
                               }
                           }
                       }
                   }
                   this.onload(L)
               }).jBind(this)
           })
       },
       loadSmall: function () {
           this.loadImg("small", arguments[0])
       },
       loadZoom: function () {
           this.loadImg("zoom", arguments[0])
       },
       load: function () {
           this.callback = null;
           if (arguments.length > 0 && q.jTypeOf(arguments[0]) === "function") {
               this.callback = arguments[0]
           }
           this.loadSmall();
           this.loadZoom()
       },
       onload: function (K) {
           if (K) {
               K.call(null, this)
           }
           if (this.callback && this.small.loaded && this.zoom.loaded) {
               this.callback.call(null, this);
               this.callback = null;
               return
           }
       },
       loaded: function () {
           return (this.small.loaded && this.zoom.loaded)
       },
       ready: function () {
           return (this.small.state === 2 && this.zoom.state === 2)
       },
       getURL: function (L) {
           var K = L === "small" ? "zoom" : "small";
           if (!this[L].loaded || (this[L].loaded && this[L].state === 2)) {
               return this[L].url
           } else {
               if (!this[K].loaded || (this[K].loaded && this[K].state === 2)) {
                   return this[K].url
               }
           }
           return null
       },
       getNode: function (L) {
           var K = L === "small" ? "zoom" : "small";
           if (!this[L].loaded || (this[L].loaded && this[L].state === 2)) {
               return this[L].node
           } else {
               if (!this[K].loaded || (this[K].loaded && this[K].state === 2)) {
                   return this[K].node
               }
           }
           return null
       },
       jGetSize: function (L) {
           var K = L === "small" ? "zoom" : "small";
           if (!this[L].loaded || (this[L].loaded && this[L].state === 2)) {
               return this[L].size
           } else {
               if (!this[K].loaded || (this[K].loaded && this[K].state === 2)) {
                   return this[K].size
               }
           }
           return {
               width: 0,
               height: 0
           }
       },
       setSize: function (L, K) {
           this[L].size = K
       },
       getRatio: function (L) {
           var K = L === "small" ? "zoom" : "small";
           if (!this[L].loaded || (this[L].loaded && this[L].state === 2)) {
               return this[L].dppx
           } else {
               if (!this[K].loaded || (this[K].loaded && this[K].state === 2)) {
                   return this[K].dppx
               }
           }
           return 1
       },
       setCurNode: function (K) {
           this.node = this.getNode(K)
       }
   };
   var z = function (L, K) {
       this.options = new q.Options(b);
       this.option = v(function () {
           if (arguments.length > 1) {
               return this.set(arguments[0], arguments[1])
           }
           return this.get(arguments[0])
       }).jBind(this.options);
       this.touchOptions = new q.Options(D);
       this.additionalImages = [];
       this.image = null;
       this.primaryImage = null;
       this.placeholder = v(L).jAddEvent("dragstart selectstart click", function (M) {
           M.stop()
       });
       this.id = null;
       this.node = null;
       this.stubNode = null;
       this.originalImg = null;
       this.originalImgSrc = null;
       this.originalTitle = null;
       this.normalSize = {
           width: 0,
           height: 0
       };
       this.size = {
           width: 0,
           height: 0
       };
       this.zoomSize = {
           width: 0,
           height: 0
       };
       this.zoomSizeOrigin = {
           width: 0,
           height: 0
       };
       this.boundaries = {
           top: 0,
           left: 0,
           bottom: 0,
           right: 0
       };
       this.ready = false;
       this.expanded = false;
       this.activateTimer = null;
       this.resizeTimer = null;
       this.resizeCallback = v(function () {
           if (this.expanded) {
               if (G) {
                   this.expandBox.jSetCss({
                       height: window.innerHeight,
                       top: Math.abs(G.getBoundingClientRect().top)
                   })
               }
               this.image.node.jSetCss({
                   "max-height": Math.min(this.image.jGetSize("zoom").height, this.expandMaxHeight())
               });
               this.image.node.jSetCss({
                   "max-width": Math.min(this.image.jGetSize("zoom").width, this.expandMaxWidth())
               })
           }
           this.reflowZoom(arguments[0])
       }).jBind(this);
       this.onResize = v(function (M) {
           clearTimeout(this.resizeTimer);
           this.resizeTimer = v(this.resizeCallback).jDelay(10, M.type === "scroll")
       }).jBindAsEvent(this);
       this.onHistoryStateChange = v(function (M) {
           if (!M.state && this.expanded) {
               this.close()
           }
           if (M.state && M.state.mzId === this.id && !this.expanded) {
               this.expand()
           }
       }).jBindAsEvent(this);
       if (y) {
           r.append(q.$new("div", {}, {
               display: "none",
               visibility: "hidden"
           }).append(document.createTextNode(y)));
           y = undefined
       }
       this.lens = null;
       this.zoomBox = null;
       this.hint = null;
       this.hintMessage = null;
       this.hintRuns = 0;
       this.mobileZoomHint = true;
       this.loadingBox = null;
       this.loadTimer = null;
       this.thumb = null;
       this.expandBox = null;
       this.expandBg = null;
       this.expandCaption = null;
       this.expandStage = null;
       this.expandImageStage = null;
       this.expandFigure = null;
       this.navControlsLayer = null;
       this.expandNav = null;
       this.expandThumbs = null;
       this.expandGallery = [];
       this.buttons = {};
       this.startAttempts = 0;
       this.startTimer = null;
       this.start(K)
   };
   z.prototype = {
       loadOptions: function (K) {
           this.options.fromJSON(window[j + "Options"] || {});
           this.options.fromString(this.placeholder.getAttribute("data-options") || "");
           if (!q.browser.touchScreen) {
               this.option("forceTouch", false)
           }
           if (q.browser.mobile || this.option("forceTouch")) {
               this.options.fromJSON(this.touchOptions.getJSON());
               this.options.fromJSON(window[j + "MobileOptions"] || {});
               this.options.fromString(this.placeholder.getAttribute("data-mobile-options") || "")
           }
           if (q.jTypeOf(K) === "string") {
               this.options.fromString(K || "")
           } else {
               this.options.fromJSON(K || {})
           }
           if (this.option("cssClass")) {
               this.option("cssClass", this.option("cssClass").replace(",", " "))
           }
           if (this.option("zoomCaption") === false) {
               this.option("zoomCaption", "off")
           }
           if (this.option("hint") === false) {
               this.option("hint", "off")
           }
           switch (this.option("hint")) {
           case "off":
               this.hintRuns = 0;
               break;
           case "always":
               this.hintRuns = Infinity;
               break;
           case "once":
           default:
               this.hintRuns = 2;
               break
           }
           if (this.option("zoomMode") === "off") {
               this.option("zoomMode", false)
           }
           if (this.option("expand") === "off") {
               this.option("expand", false)
           }
           if (this.option("expandZoomMode") === "off") {
               this.option("expandZoomMode", false)
           }
           if (q.browser.mobile && this.option("zoomMode") === "zoom" && this.option("zoomPosition") === "inner") {
               if (this.option("expand")) {
                   this.option("zoomMode", false)
               } else {
                   this.option("zoomOn", "click")
               }
           }
       },
       start: function (N) {
           var L;
           var K = this;
           var M;
           if (this.startAttempts < 1) {
               this.loadOptions(N);
               if (l && !this.option("autostart")) {
                   return
               }
               this.originalImg = this.placeholder.querySelector("img");
               this.originalImgSrc = this.originalImg ? this.originalImg.getAttribute("src") : null;
               this.originalTitle = v(this.placeholder).getAttribute("title");
               v(this.placeholder).removeAttribute("title");
               if (this.originalImg && this.originalImg.parentNode.tagName === "PICTURE") {
                   this.originalImgSrc = null;
                   var R = q.$new("div").jAddClass("magic-temporary-img").jAppendTo(document.body);
                   var P = this.originalImg.parentNode.cloneNode(true);
                   P.getAttribute("style");
                   P.removeAttribute("style");
                   var O = P.querySelector("img");
                   O.getAttribute("style");
                   O.removeAttribute("style");
                   v(O).jAddEvent("load", function () {
                       K.size = v(O).jGetSize();
                       R.kill();
                       var S = K.originalImg.cloneNode(false);
                       v(S).jSetCss({
                           maxWidth: K.size.width,
                           maxHeight: K.size.height
                       }).setAttribute("src", K.originalImg.currentSrc || K.originalImg.src);
                       K.originalImg = K.placeholder.replaceChild(S, K.originalImg.parentNode);
                       K.start()
                   });
                   R.append(P);
                   ++this.startAttempts;
                   return
               }
           }
           M = new o().parseNode(this.placeholder, this.originalTitle, true);
           M.setSize("small", this.size);
           if (!M.small.url) {
               if (++this.startAttempts <= w) {
                   this.startTimer = setTimeout(function () {
                       K.start()
                   }, 100)
               }
               return
           }
           this.primaryImage = M;
           this.image = this.primaryImage;
           g(this.placeholder);
           this.id = this.placeholder.getAttribute("id") || "mz-" + Math.floor(Math.random() * q.now());
           this.placeholder.setAttribute("id", this.id);
           this.node = q.$new("figure").jAddClass("mz-figure");
           this.node.enclose(this.image.small.node).jAddClass(this.option("cssClass"));
           if (this.option("rightClick") !== true) {
               this.node.jAddEvent("contextmenu", function (S) {
                   S.stop();
                   return false
               })
           }
           this.node.jAddClass("mz-" + this.option("zoomOn") + "-zoom");
           if (!this.option("expand")) {
               this.node.jAddClass("mz-no-expand")
           }
           this.lens = {
               node: q.$new("div", {
                   "class": "mz-lens"
               }, {
                   top: 0
               }).jAppendTo(this.node),
               image: q.$new("img", {
                   src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
               }, {
                   position: "absolute",
                   top: 0,
                   left: 0
               }),
               width: 0,
               height: 0,
               pos: {
                   x: 0,
                   y: 0
               },
               spos: {
                   x: 0,
                   y: 0
               },
               size: {
                   width: 0,
                   height: 0
               },
               border: {
                   x: 0,
                   y: 0
               },
               dx: 0,
               dy: 0,
               innertouch: false,
               hide: function () {
                   if (q.browser.features.transform) {
                       this.node.jSetCss({
                           transform: "translate(-10000px, -10000px)"
                       })
                   } else {
                       this.node.jSetCss({
                           top: -10000
                       })
                   }
               }
           };
           this.lens.hide();
           this.lens.node.append(this.lens.image);
           this.zoomBox = {
               node: q.$new("div", {
                   "class": "mz-zoom-window"
               }, {
                   top: -100000
               }).jAddClass(this.option("cssClass")).jAppendTo(r),
               image: q.$new("img", {
                   src: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
               }, {
                   position: "absolute"
               }),
               aspectRatio: 0,
               width: 0,
               height: 0,
               innerWidth: 0,
               innerHeight: 0,
               size: {
                   width: "auto",
                   wunits: "px",
                   height: "auto",
                   hunits: "px"
               },
               mode: this.option("zoomMode"),
               position: this.option("zoomPosition"),
               trigger: this.option("zoomOn"),
               custom: false,
               active: false,
               activating: false,
               enabled: false,
               enable: v(function () {
                   this.zoomBox.enabled = arguments[0] !== false;
                   this.node[this.zoomBox.enabled ? "jRemoveClass" : "jAddClass"]("mz-no-zoom")
               }).jBind(this),
               hide: v(function () {
                   var S = v(this.node).jFetch("cr");
                   this.zoomBox.node.jRemoveEvent("transitionend");
                   this.zoomBox.node.jSetCss({
                       top: -100000
                   }).jAppendTo(r);
                   this.zoomBox.node.jRemoveClass("mz-deactivating mz-p-" + (this.zoomBox.mode === "zoom" ? this.zoomBox.position : this.zoomBox.mode));
                   if (!this.expanded && S) {
                       S.jRemove()
                   }
                   this.zoomBox.image.getAttribute("style");
                   this.zoomBox.image.removeAttribute("style")
               }).jBind(this),
               setMode: v(function (S) {
                   this.node[S === false ? "jAddClass" : "jRemoveClass"]("mz-no-zoom");
                   this.node[S === "magnifier" ? "jAddClass" : "jRemoveClass"]("mz-magnifier-zoom");
                   this.zoomBox.node[S === "magnifier" ? "jAddClass" : "jRemoveClass"]("mz-magnifier");
                   this.zoomBox.node[S === "preview" ? "jAddClass" : "jRemoveClass"]("mz-preview");
                   if (S !== "zoom") {
                       this.node.jRemoveClass("mz-inner-zoom");
                       this.zoomBox.node.jRemoveClass("mz-inner")
                   }
                   this.zoomBox.mode = S;
                   if (S === false) {
                       this.zoomBox.enable(false)
                   }
               }).jBind(this)
           };
           this.zoomBox.node.append(this.zoomBox.image);
           this.zoomBox.setMode(this.option("zoomMode"));
           this.zoomBox.image.removeAttribute("width");
           this.zoomBox.image.removeAttribute("height");
           if ((L = ("" + this.option("zoomWidth")).match(/^([0-9]+)?(px|%)?$/))) {
               this.zoomBox.size.wunits = L[2] || "px";
               this.zoomBox.size.width = (parseFloat(L[1]) || "auto")
           }
           if ((L = ("" + this.option("zoomHeight")).match(/^([0-9]+)?(px|%)?$/))) {
               this.zoomBox.size.hunits = L[2] || "px";
               this.zoomBox.size.height = (parseFloat(L[1]) || "auto")
           }
           if (this.zoomBox.mode === "magnifier") {
               this.node.jAddClass("mz-magnifier-zoom");
               this.zoomBox.node.jAddClass("mz-magnifier");
               if (this.zoomBox.size.width === "auto") {
                   this.zoomBox.size.wunits = "%";
                   this.zoomBox.size.width = 70
               }
               if (this.zoomBox.size.height === "auto") {
                   this.zoomBox.size.hunits = "%"
               }
           } else {
               if (this.option("zoom-position").match(/^#/)) {
                   if (this.zoomBox.custom = v(this.option("zoom-position").replace(/^#/, ""))) {
                       if (v(this.zoomBox.custom).jGetSize().height > 50) {
                           if (this.zoomBox.size.width === "auto") {
                               this.zoomBox.size.wunits = "%";
                               this.zoomBox.size.width = 100
                           }
                           if (this.zoomBox.size.height === "auto") {
                               this.zoomBox.size.hunits = "%";
                               this.zoomBox.size.height = 100
                           }
                       }
                   } else {
                       this.option("zoom-position", "right")
                   }
               }
               if (this.zoomBox.mode === "preview") {
                   if (this.zoomBox.size.width === "auto") {
                       this.zoomBox.size.wunits = "px"
                   }
                   if (this.zoomBox.size.height === "auto") {
                       this.zoomBox.size.hunits = "px"
                   }
               }
               if (this.zoomBox.mode === "zoom") {
                   if (this.zoomBox.size.width === "auto" || this.option("zoom-position") === "inner") {
                       this.zoomBox.size.wunits = "%";
                       this.zoomBox.size.width = 100
                   }
                   if (this.zoomBox.size.height === "auto" || this.option("zoom-position") === "inner") {
                       this.zoomBox.size.hunits = "%";
                       this.zoomBox.size.height = 100
                   }
               }
               if (this.option("zoom-position") === "inner") {
                   this.node.jAddClass("mz-inner-zoom")
               }
           }
           this.zoomBox.position = this.zoomBox.custom ? "custom" : this.option("zoom-position");
           this.lens.border.x = parseFloat(this.lens.node.jGetCss("border-left-width") || "0");
           this.lens.border.y = parseFloat(this.lens.node.jGetCss("border-top-width") || "0");
           this.image.loadSmall(function () {
               if (this.image.small.state !== 2) {
                   return
               }
               this.image.setCurNode("small");
               this.size = this.image.node.jGetSize();
               this.registerEvents();
               this.ready = true;
               if (this.option("lazyZoom") === true) {
                   I("onZoomReady", this.id);
                   if (q.browser.mobile) {
                       this.reflowZoom()
                   } else {
                       this.showHint()
                   }
               }
           }.jBind(this));
           if (this.option("lazyZoom") !== true || this.option("zoomOn") === "always") {
               this.image.load(v(function (S) {
                   this.setupZoom(S, true)
               }).jBind(this));
               this.loadTimer = v(this.showLoading).jBind(this).jDelay(400)
           }
           this.setupSelectors();
           this.setupButtons()
       },
       stop: function () {
           clearTimeout(this.startTimer);
           this.unregisterEvents();
           if (this.zoomBox) {
               this.zoomBox.node.kill()
           }
           if (this.expandThumbs) {
               this.expandThumbs.stop();
               this.expandThumbs = null
           }
           if (this.expandBox) {
               this.expandBox.kill()
           }
           if (this.expanded) {
               v(q.browser.getDoc()).jSetCss({
                   overflow: ""
               })
           }
           v(this.additionalImages).jEach(function (K) {
               v(K.origin).jRemoveClass("mz-thumb-selected").jRemoveClass(this.option("cssClass") || "mz-$dummy-css-class-to-jRemove$")
           }, this);
           if (this.originalImg) {
               this.placeholder.append(this.originalImg);
               if (this.originalImgSrc) {
                   this.originalImg.setAttribute("src", this.originalImgSrc)
               }
           }
           if (this.originalTitle) {
               this.placeholder.setAttribute("title", this.originalTitle)
           }
           if (this.node) {
               this.node.kill()
           }
       },
       setupZoom: function (L, M) {
           var K = this.image;
           if (L.zoom.state !== 2) {
               this.image = L;
               this.ready = true;
               this.zoomBox.enable(false);
               return
           }
           this.image = L;
           this.image.setCurNode(this.expanded ? "zoom" : "small");
           this.zoomBox.image.src = this.image.getURL("zoom");
           this.zoomBox.image.alt = this.image.alt;
           this.zoomBox.node.jRemoveClass("mz-preview");
           this.zoomBox.image.getAttribute("style");
           this.zoomBox.image.removeAttribute("style");
           this.zoomBox.node.jGetSize();
           setTimeout(v(function () {
               var O = this.zoomBox.image.jGetSize();
               var N;
               this.zoomSizeOrigin = this.image.jGetSize("zoom");
               if (O.width * O.height > 1 && O.width * O.height < this.zoomSizeOrigin.width * this.zoomSizeOrigin.height) {
                   this.zoomSizeOrigin = O
               }
               this.zoomSize = q.detach(this.zoomSizeOrigin);
               if (this.zoomBox.mode === "preview") {
                   this.zoomBox.node.jAddClass("mz-preview")
               }
               this.setCaption();
               this.lens.image.src = this.image.node.currentSrc || this.image.node.src;
               this.lens.image.alt = this.image.alt;
               this.zoomBox.enable(this.zoomBox.mode && !(this.expanded && this.zoomBox.mode === "preview"));
               this.ready = true;
               this.activateTimer = null;
               this.resizeCallback();
               this.node.jAddClass("mz-ready");
               this.hideLoading();
               if (K !== this.image) {
                   I("onUpdate", this.id, K.origin, this.image.origin);
                   if (this.nextImage) {
                       N = this.nextImage;
                       this.nextImage = null;
                       this.update(N.image, N.onswipe)
                   }
               } else {
                   if (!!M) {
                       I("onZoomReady", this.id)
                   }
               }
               if (this.initEvent) {
                   this.node.jCallEvent(this.initEvent.type, this.initEvent)
               } else {
                   if (this.expanded && this.option("expandZoomOn") === "always") {
                       this.activate()
                   } else {
                       if (!!M) {
                           this.showHint()
                       }
                   }
               }
           }).jBind(this), 256)
       },
       setupSelectors: function () {
           var L = this.id;
           var K;
           var M;
           M = new RegExp("zoom\\-id(\\s+)?:(\\s+)?" + L + "($|;)");
           if (q.browser.features.query) {
               K = q.$A(document.querySelectorAll('[data-zoom-id="' + this.id + '"]'));
               K = v(K).concat(q.$A(document.querySelectorAll('[rel*="zoom-id"]')).filter(function (N) {
                   return M.test(N.getAttribute("rel") || "")
               }))
           } else {
               K = q.$A(document.getElementsByTagName("A")).filter(function (N) {
                   return L === N.getAttribute("data-zoom-id") || M.test(N.getAttribute("rel") || "")
               })
           }
           v(K).jEach(function (O) {
               var N;
               var P;
               v(O).jAddEvent("click", function (Q) {
                   Q.stopDefaults()
               });
               N = new o().parseNode(O, this.originalTitle);
               if ((this.image.zoom.src.has(N.zoom.url) || this.image.zoom.url.has(N.zoom.url)) && (this.image.small.src.has(N.small.url) || this.image.small.url.has(N.small.url))) {
                   v(N.origin).jAddClass("mz-thumb-selected");
                   N = this.image;
                   N.origin = O
               }
               if (!N.link && this.image.link) {
                   N.link = this.image.link
               }
               P = v(function () {
                   this.update(N)
               }).jBind(this);
               v(O).jAddEvent("mousedown", function (Q) {
                   if ("stopImmediatePropagation" in Q) {
                       Q.stopImmediatePropagation()
                   }
               }, 5);
               v(O).jAddEvent("tap " + (this.option("selectorTrigger") === "hover" ? "mouseover mouseout" : "btnclick"), v(function (R, Q) {
                   if (this.updateTimer) {
                       clearTimeout(this.updateTimer)
                   }
                   this.updateTimer = false;
                   if (R.type === "mouseover") {
                       this.updateTimer = v(P).jDelay(Q)
                   } else {
                       if (R.type === "tap" || R.type === "btnclick") {
                           P()
                       }
                   }
               }).jBindAsEvent(this, 60)).jAddClass(this.option("cssClass")).jAddClass("mz-thumb");
               if (this.option("lazyZoom") !== true) {
                   N.loadSmall();
                   N.loadZoom()
               }
               this.additionalImages.push(N)
           }, this)
       },
       update: function (K, M) {
           if (!this.ready) {
               this.nextImage = {
                   image: K,
                   onswipe: M
               };
               return
           }
           if (!K || K === this.image) {
               return false
           }
           this.deactivate(null, true);
           this.ready = false;
           this.node.jRemoveClass("mz-ready");
           this.loadTimer = v(this.showLoading).jBind(this).jDelay(400);
           var L = v(function (T) {
               var N, U, S, P, O, R, Q = (q.browser.ieMode < 10) ? "jGetSize" : "getBoundingClientRect";
               this.hideLoading();
               T.setCurNode("small");
               if (!T.node) {
                   this.ready = true;
                   this.node.jAddClass("mz-ready");
                   return
               }
               this.setActiveThumb(T);
               N = this.image.node[Q]();
               if (this.expanded) {
                   T.setCurNode("zoom");
                   S = q.$new("div").jAddClass("mz-expand-bg");
                   if (q.browser.features.cssFilters || q.browser.ieMode < 10) {
                       S.append(q.$new("img", {
                           srcset: T.getURL("zoom") + " " + T.getRatio("zoom") + "x",
                           src: T.getURL("zoom"),
                           alt: T.alt
                       }).jSetCss({
                           opacity: 0
                       }))
                   } else {
                       S.append(new q.SVGImage(T.node).blur(k).getNode().jSetCss({
                           opacity: 0
                       }))
                   }
                   v(S).jSetCss({
                       "z-index": -99
                   }).jAppendTo(this.expandBox)
               }
               if (this.expanded && this.zoomBox.mode === "zoom" && this.option("expandZoomOn") === "always") {
                   v(T.node).jSetCss({
                       opacity: 0
                   }).jAppendTo(this.node);
                   U = N;
                   O = [T.node, this.image.node];
                   R = [{
                       opacity: [0, 1]
                   }, {
                       opacity: [1, 0]
                   }];
                   v(T.node).jSetCss({
                       "max-width": Math.min(T.jGetSize("zoom").width, this.expandMaxWidth()),
                       "max-height": Math.min(T.jGetSize("zoom").height, this.expandMaxHeight())
                   })
               } else {
                   this.node.jSetCss({
                       height: this.node[Q]().height
                   });
                   this.image.node.jSetCss({
                       position: "absolute",
                       top: 0,
                       left: 0,
                       bottom: 0,
                       right: 0,
                       width: "100%",
                       height: "100%",
                       "max-width": "",
                       "max-height": ""
                   });
                   v(T.node).jSetCss({
                       "max-width": Math.min(T.jGetSize(this.expanded ? "zoom" : "small").width, this.expanded ? this.expandMaxWidth() : Infinity),
                       "max-height": Math.min(T.jGetSize(this.expanded ? "zoom" : "small").height, this.expanded ? this.expandMaxHeight() : Infinity),
                       position: "relative",
                       top: 0,
                       left: 0,
                       opacity: 0,
                       transform: ""
                   }).jAppendTo(this.node);
                   U = v(T.node)[Q]();
                   if (!M) {
                       v(T.node).jSetCss({
                           "min-width": N.width,
                           height: N.height,
                           "max-width": N.width,
                           "max-height": ""
                       })
                   }
                   this.node.jSetCss({
                       height: "",
                       overflow: ""
                   }).jGetSize();
                   v(T.node).jGetSize();
                   O = [T.node, this.image.node];
                   R = [q.extend({
                       opacity: [0, 1]
                   }, M ? {
                       scale: [0.6, 1]
                   } : {
                       "min-width": [N.width, U.width],
                       "max-width": [N.width, U.width],
                       height: [N.height, U.height]
                   }), {
                       opacity: [1, 0]
                   }]
               }
               if (this.expanded) {
                   if (this.expandBg.firstChild && S.firstChild) {
                       P = v(this.expandBg.firstChild).jGetCss("opacity");
                       if (q.browser.gecko) {
                           O = O.concat([S.firstChild]);
                           R = R.concat([{
                               opacity: [0.0001, P]
                           }])
                       } else {
                           O = O.concat([S.firstChild, this.expandBg.firstChild]);
                           R = R.concat([{
                               opacity: [0.0001, P]
                           }, {
                               opacity: [P, 0.0001]
                           }])
                       }
                   }
               }
               new q.PFX(O, {
                   duration: (M || this.option("transitionEffect")) ? M ? 160 : 350 : 0,
                   transition: M ? "cubic-bezier(0.175, 0.885, 0.320, 1)" : (N.width === U.width) ? "linear" : "cubic-bezier(0.25, .1, .1, 1)",
                   onComplete: v(function () {
                       this.image.node.jRemove().getAttribute("style");
                       this.image.node.removeAttribute("style");
                       v(T.node).jSetCss(this.expanded ? {
                           width: "auto",
                           height: "auto"
                       } : {
                           width: "",
                           height: ""
                       }).jSetCss({
                           "min-width": "",
                           "min-height": "",
                           opacity: "",
                           "max-width": Math.min(T.jGetSize(this.expanded ? "zoom" : "small").width, this.expanded ? this.expandMaxWidth() : Infinity),
                           "max-height": Math.min(T.jGetSize(this.expanded ? "zoom" : "small").height, this.expanded ? this.expandMaxHeight() : Infinity)
                       });
                       if (this.expanded) {
                           this.expandBg.jRemove();
                           this.expandBg = undefined;
                           this.expandBg = S.jSetCssProp("z-index", -100);
                           v(this.expandBg.firstChild).jSetCss({
                               opacity: ""
                           });
                           if (this.expandCaption) {
                               if (T.caption) {
                                   if (T.link) {
                                       this.expandCaption.changeContent("").append(q.$new("a", {
                                           href: T.link
                                       }).jAddEvent("tap btnclick", this.openLink.jBind(this)).changeContent(T.caption))
                                   } else {
                                       this.expandCaption.changeContent(T.caption).jAddClass("mz-show")
                                   }
                               } else {
                                   this.expandCaption.jRemoveClass("mz-show")
                               }
                           }
                       }
                       this.setupZoom(T)
                   }).jBind(this),
                   onBeforeRender: v(function (V, W) {
                       if (undefined !== V.scale) {
                           W.jSetCssProp("transform", "scale(" + V.scale + ")")
                       }
                   })
               }).start(R)
           }).jBind(this);
           if (this.expanded) {
               K.load(L)
           } else {
               K.loadSmall(L)
           }
       },
       setActiveThumb: function (L) {
           var K = false;
           v(this.additionalImages).jEach(function (M) {
               v(M.origin).jRemoveClass("mz-thumb-selected");
               if (M === L) {
                   K = true
               }
           });
           if (K && L.origin) {
               v(L.origin).jAddClass("mz-thumb-selected")
           }
           if (this.expandThumbs) {
               this.expandThumbs.selectItem(L.selector)
           }
       },
       setCaption: function (K) {
           if (this.image.caption && this.option("zoomCaption") !== "off" && this.zoomBox.mode !== "magnifier") {
               if (!this.zoomBox.caption) {
                   this.zoomBox.caption = q.$new("div", {
                       "class": "mz-caption"
                   }).jAppendTo(this.zoomBox.node.jAddClass("caption-" + this.option("zoomCaption")))
               }
               this.zoomBox.caption.changeContent(this.image.caption)
           }
       },
       showHint: function (K, N, L) {
           var M;
           if (!this.expanded) {
               if (this.hintRuns <= 0) {
                   return
               }
               if (L !== true) {
                   this.hintRuns--
               }
           }
           if (N === undefined || N === null) {
               if (!this.zoomBox.active && !this.zoomBox.activating) {
                   if (this.option("zoomMode") && (this.zoomBox.enabled || !this.image.loaded()) && !(q.browser.mobile && this.option("expand") && this.zoomBox.mode === "zoom" && this.zoomBox.position === "inner")) {
                       if (this.zoomBox.trigger === "hover") {
                           N = this.option("textHoverZoomHint")
                       } else {
                           if (this.zoomBox.trigger === "click") {
                               N = this.option("textClickZoomHint")
                           }
                       }
                   } else {
                       N = this.option("expand") ? this.option("textExpandHint") : ""
                   }
               } else {
                   N = this.option("expand") ? this.option("textExpandHint") : ""
               }
           }
           if (!N) {
               this.hideHint();
               return
           }
           M = this.node;
           if (!this.hint) {
               this.hint = q.$new("div", {
                   "class": "mz-hint"
               });
               this.hintMessage = q.$new("span", {
                   "class": "mz-hint-message"
               }).append(document.createTextNode(N)).jAppendTo(this.hint);
               v(this.hint).jAppendTo(this.node)
           } else {
               v(this.hintMessage).changeContent(N)
           }
           this.hint.jSetCss({
               "transition-delay": ""
           }).jRemoveClass("mz-hint-hidden");
           if (this.expanded) {
               M = this.expandFigure
           } else {
               if ((this.zoomBox.active || this.zoomBox.activating) && this.zoomBox.mode !== "magnifier" && this.zoomBox.position === "inner") {
                   M = this.zoomBox.node
               }
           }
           if (K === true) {
               setTimeout(v(function () {
                   this.hint.jAddClass("mz-hint-hidden")
               }).jBind(this), 16)
           }
           this.hint.jAppendTo(M)
       },
       hideHint: function () {
           if (this.hint) {
               this.hint.jSetCss({
                   "transition-delay": "0ms"
               }).jAddClass("mz-hint-hidden")
           }
       },
       showLoading: function () {
           if (!this.loadingBox) {
               this.loadingBox = q.$new("div", {
                   "class": "mz-loading"
               });
               this.node.append(this.loadingBox);
               this.loadingBox.jGetSize()
           }
           this.loadingBox.jAddClass("shown")
       },
       hideLoading: function () {
           clearTimeout(this.loadTimer);
           this.loadTimer = null;
           if (this.loadingBox) {
               v(this.loadingBox).jRemoveClass("shown")
           }
       },
       setSize: function (M, Q) {
           var P = q.detach(this.zoomBox.size),
               O = (!this.expanded && this.zoomBox.custom) ? v(this.zoomBox.custom).jGetSize() : {
                   width: 0,
                   height: 0
               },
               L, K, N = this.size,
               R = {
                   x: 0,
                   y: 0
               };
           Q = Q || this.zoomBox.position;
           this.normalSize = this.image.node.jGetSize();
           this.size = this.image.node.jGetSize();
           this.boundaries = this.image.node.getBoundingClientRect();
           if (!O.height) {
               O = this.size
           }
           if (this.option("upscale") === false || this.zoomBox.mode === false || this.zoomBox.mode === "preview") {
               M = false
           }
           if (this.zoomBox.mode === "preview") {
               if (P.width === "auto") {
                   P.width = this.zoomSizeOrigin.width
               }
               if (P.height === "auto") {
                   P.height = this.zoomSizeOrigin.height
               }
           }
           if (this.expanded && this.zoomBox.mode === "magnifier") {
               P.width = 70;
               P.height = "auto"
           }
           if (this.zoomBox.mode === "magnifier" && P.height === "auto") {
               this.zoomBox.width = parseFloat(P.width / 100) * Math.min(O.width, O.height);
               this.zoomBox.height = this.zoomBox.width
           } else {
               if (this.zoomBox.mode === "zoom" && Q === "inner") {
                   this.size = this.node.jGetSize();
                   O = this.size;
                   this.boundaries = this.node.getBoundingClientRect();
                   this.zoomBox.width = O.width;
                   this.zoomBox.height = O.height
               } else {
                   this.zoomBox.width = (P.wunits === "%") ? parseFloat(P.width / 100) * O.width : parseInt(P.width);
                   this.zoomBox.height = (P.hunits === "%") ? parseFloat(P.height / 100) * O.height : parseInt(P.height)
               }
           }
           if (this.zoomBox.mode === "preview") {
               K = Math.min(Math.min(this.zoomBox.width / this.zoomSizeOrigin.width, this.zoomBox.height / this.zoomSizeOrigin.height), 1);
               this.zoomBox.width = this.zoomSizeOrigin.width * K;
               this.zoomBox.height = this.zoomSizeOrigin.height * K
           }
           this.zoomBox.width = Math.ceil(this.zoomBox.width);
           this.zoomBox.height = Math.ceil(this.zoomBox.height);
           this.zoomBox.aspectRatio = this.zoomBox.width / this.zoomBox.height;
           this.zoomBox.node.jSetCss({
               width: this.zoomBox.width,
               height: this.zoomBox.height
           });
           if (M) {
               O = this.expanded ? this.expandBox.jGetSize() : this.zoomBox.node.jGetSize();
               if (!this.expanded && (this.normalSize.width * this.normalSize.height) / (this.zoomSizeOrigin.width * this.zoomSizeOrigin.height) > 0.8) {
                   this.zoomSize.width = 1.5 * this.zoomSizeOrigin.width;
                   this.zoomSize.height = 1.5 * this.zoomSizeOrigin.height
               } else {
                   this.zoomSize = q.detach(this.zoomSizeOrigin)
               }
           }
           if (this.zoomBox.mode !== false && !this.zoomBox.active && !(this.expanded && this.option("expandZoomOn") === "always")) {
               if ((this.normalSize.width * this.normalSize.height) / (this.zoomSize.width * this.zoomSize.height) > 0.8) {
                   this.zoomSize = q.detach(this.zoomSizeOrigin);
                   this.zoomBox.enable(false)
               } else {
                   this.zoomBox.enable(true)
               }
           }
           this.zoomBox.image.jSetCss({
               width: this.zoomSize.width,
               height: this.zoomSize.height
           });
           this.zoomSize.maxWidth = this.zoomSize.width;
           this.zoomSize.maxHeight = this.zoomSize.height;
           L = this.zoomBox.node.getInnerSize();
           this.zoomBox.innerWidth = Math.ceil(L.width);
           this.zoomBox.innerHeight = Math.ceil(L.height);
           this.lens.width = Math.ceil(this.zoomBox.innerWidth / (this.zoomSize.width / this.size.width));
           this.lens.height = Math.ceil(this.zoomBox.innerHeight / (this.zoomSize.height / this.size.height));
           this.lens.node.jSetCss({
               width: this.lens.width,
               height: this.lens.height
           });
           this.lens.image.jSetCss(this.size);
           q.extend(this.lens, this.lens.node.jGetSize());
           if (this.zoomBox.active) {
               clearTimeout(this.moveTimer);
               this.moveTimer = null;
               if (this.lens.innertouch) {
                   this.lens.pos.x *= (this.size.width / N.width);
                   this.lens.pos.y *= (this.size.height / N.height);
                   R.x = this.lens.spos.x;
                   R.y = this.lens.spos.y
               } else {
                   R.x = this.boundaries.left + this.lens.width / 2 + (this.lens.pos.x * (this.size.width / N.width));
                   R.y = this.boundaries.top + this.lens.height / 2 + (this.lens.pos.y * (this.size.height / N.height))
               }
               this.animate(null, R)
           }
       },
       reflowZoom: function (O) {
           var R;
           var Q;
           var K;
           var P;
           var N;
           var M;
           var L = v(this.node).jFetch("cr");
           K = s(5);
           N = this.zoomBox.position;
           P = this.expanded ? "inner" : this.zoomBox.custom ? "custom" : this.option("zoom-position");
           M = this.expanded && this.zoomBox.mode === "zoom" ? this.expandImageStage : document.body;
           if (this.expanded) {
               K.y = 0;
               K.x = 0
           }
           if (!O) {
               this.setSize(true, P)
           }
           R = this.boundaries.top;
           if (this.zoomBox.mode !== "magnifier") {
               if (O) {
                   this.setSize(false);
                   return
               }
               switch (P) {
               case "inner":
               case "custom":
                   R = 0;
                   Q = 0;
                   break;
               case "top":
                   R = this.boundaries.top - this.zoomBox.height - this.option("zoom-distance");
                   if (K.top > R) {
                       R = this.boundaries.bottom + this.option("zoom-distance");
                       P = "bottom"
                   }
                   Q = this.boundaries.left;
                   break;
               case "bottom":
                   R = this.boundaries.bottom + this.option("zoom-distance");
                   if (K.bottom < R + this.zoomBox.height) {
                       R = this.boundaries.top - this.zoomBox.height - this.option("zoom-distance");
                       P = "top"
                   }
                   Q = this.boundaries.left;
                   break;
               case "left":
                   Q = this.boundaries.left - this.zoomBox.width - this.option("zoom-distance");
                   if (K.left > Q && K.right >= this.boundaries.right + this.option("zoom-distance") + this.zoomBox.width) {
                       Q = this.boundaries.right + this.option("zoom-distance");
                       P = "right"
                   }
                   break;
               case "right":
               default:
                   Q = this.boundaries.right + this.option("zoom-distance");
                   if (K.right < Q + this.zoomBox.width && K.left <= this.boundaries.left - this.zoomBox.width - this.option("zoom-distance")) {
                       Q = this.boundaries.left - this.zoomBox.width - this.option("zoom-distance");
                       P = "left"
                   }
                   break
               }
               switch (this.option("zoom-position")) {
               case "top":
               case "bottom":
                   if (K.top > R || K.bottom < R + this.zoomBox.height) {
                       P = "inner"
                   }
                   break;
               case "left":
               case "right":
                   if (K.left > Q || K.right < Q + this.zoomBox.width) {
                       P = "inner"
                   }
                   break;
               default:
               }
               this.zoomBox.position = P;
               if (!this.zoomBox.activating && !this.zoomBox.active) {
                   if (q.browser.mobile && !this.expanded && (this.zoomBox.mode === "zoom" || this.zoomBox.mode === false && this.option("expand"))) {
                       if (this.option("expand")) {
                           this.zoomBox.enable(P !== "inner")
                       } else {
                           if (this.option("zoomOn") !== "click") {
                               this.zoomBox.trigger = P === "inner" ? "click" : this.option("zoomOn");
                               this.unregisterActivateEvent();
                               this.unregisterDeactivateEvent();
                               this.registerActivateEvent(this.zoomBox.trigger === "click");
                               this.registerDeactivateEvent(this.zoomBox.trigger === "click" && !this.option("expand"))
                           }
                       }
                       this.showHint(false, null, !(this.option("lazyZoom") && this.image.loaded()))
                   }
                   return
               }
               this.setSize(false);
               if (O) {
                   return
               }
               if (P === "custom") {
                   M = this.zoomBox.custom;
                   K.y = 0;
                   K.x = 0
               }
               if (P === "inner") {
                   if (this.zoomBox.mode !== "preview") {
                       this.zoomBox.node.jAddClass("mz-inner");
                       this.node.jAddClass("mz-inner-zoom")
                   }
                   this.lens.hide();
                   R = this.boundaries.top + K.y;
                   Q = this.boundaries.left + K.x;
                   R = 0;
                   Q = 0;
                   if (!this.expanded) {
                       M = this.node
                   }
               } else {
                   R += K.y;
                   Q += K.x;
                   this.node.jRemoveClass("mz-inner-zoom");
                   this.zoomBox.node.jRemoveClass("mz-inner")
               }
               this.zoomBox.node.jSetCss({
                   top: R,
                   left: Q
               })
           } else {
               this.setSize(false);
               M = this.node;
               if (q.browser.mobile && !this.expanded && !this.zoomBox.activating && !this.zoomBox.active) {
                   this.showHint(false, null, !(this.option("lazyZoom") && this.image.loaded()))
               }
           }
           this.zoomBox.node[this.expanded ? "jAddClass" : "jRemoveClass"]("mz-expanded");
           if (!this.expanded && L) {
               L.jAppendTo(this.zoomBox.mode === "zoom" && P === "inner" ? this.zoomBox.node : this.node, ((Math.floor(Math.random() * 101) + 1) % 2) ? "top" : "bottom")
           }
           this.zoomBox.node.jAppendTo(M)
       },
       changeZoomLevel: function (Q) {
           var M;
           var K;
           var O;
           var N;
           var P = false;
           var L = Q.isMouse ? 5 : 3 / 54;
           if (!this.zoomBox.active) {
               return
           }
           v(Q).stop();
           L = (100 + L * Math.abs(Q.deltaY)) / 100;
           if (Q.deltaY < 0) {
               L = 1 / L
           }
           if (this.zoomBox.mode === "magnifier") {
               K = Math.max(100, Math.round(this.zoomBox.width * L));
               K = Math.min(K, this.size.width * 0.9);
               O = K / this.zoomBox.aspectRatio;
               this.zoomBox.width = Math.ceil(K);
               this.zoomBox.height = Math.ceil(O);
               this.zoomBox.node.jSetCss({
                   width: this.zoomBox.width,
                   height: this.zoomBox.height
               });
               M = this.zoomBox.node.getInnerSize();
               this.zoomBox.innerWidth = Math.ceil(M.width);
               this.zoomBox.innerHeight = Math.ceil(M.height);
               P = true
           } else {
               if (!this.expanded && this.zoomBox.mode === "zoom") {
                   K = Math.max(this.size.width, Math.round(this.zoomSize.width * L));
                   K = Math.min(K, this.zoomSize.maxWidth);
                   O = K / (this.zoomSize.maxWidth / this.zoomSize.maxHeight);
                   this.zoomSize.width = Math.ceil(K);
                   this.zoomSize.height = Math.ceil(O)
               } else {
                   return
               }
           }
           N = v(window).jGetScroll();
           this.lens.width = (this.zoomBox.innerWidth / (this.zoomSize.width / this.size.width));
           this.lens.height = (this.zoomBox.innerHeight / (this.zoomSize.height / this.size.height));
           this.lens.node.jSetCss({
               width: this.lens.width,
               height: this.lens.height
           });
           q.extend(this.lens, this.lens.node.jGetSize());
           if (this.zoomBox.active) {
               clearTimeout(this.moveTimer);
               this.moveTimer = null;
               if (P) {
                   this.moveTimer = true
               }
               this.animate(null, {
                   x: Q.x - N.x,
                   y: Q.y - N.y
               });
               if (P) {
                   this.moveTimer = null
               }
           }
       },
       registerActivateEvent: function (M) {
           var L;
           var K = M ? "dbltap btnclick" : "touchstart" + (window.navigator.pointerEnabled ? " pointerdown" : window.navigator.msPointerEnabled ? " MSPointerDown" : "") + (window.navigator.pointerEnabled ? " pointermove" : window.navigator.msPointerEnabled ? " MSPointerMove" : " mousemove");
           var N = this.node.jFetch("mz:handlers:activate:fn", (!M) ? v(function (O) {
               if (O.isTouchEvent() && !O.isPrimaryTouch()) {
                   return
               }
               if (O && O.pointerType === "touch" && O.type !== "pointerdown") {
                   return
               }
               L = (q.browser.ieMode < 9) ? q.extend({}, O) : O;
               if (!this.activateTimer) {
                   clearTimeout(this.activateTimer);
                   this.activateTimer = setTimeout(v(function () {
                       this.activate(L)
                   }).jBind(this), 120)
               }
           }).jBindAsEvent(this) : v(this.activate).jBindAsEvent(this));
           this.node.jStore("mz:handlers:activate:event", K).jAddEvent(K, N, 10)
       },
       unregisterActivateEvent: function () {
           var K = this.node.jFetch("mz:handlers:activate:event");
           var L = this.node.jFetch("mz:handlers:activate:fn");
           this.node.jRemoveEvent(K, L);
           this.node.jDel("mz:handlers:activate:fn")
       },
       registerDeactivateEvent: function (L) {
           var K = "touchend";
           if (window.navigator.pointerEnabled) {
               K += " pointerup pointerout pointermove"
           } else {
               if (window.navigator.msPointerEnabled) {
                   K += " MSPointerUp MSPointerOut MSPointerMove"
               } else {
                   K += " mouseout mousemove"
               }
           }
           if (L) {
               if (this.expanded || q.browser.mobile) {
                   K = "dbltap btnclick"
               } else {
                   K += " dbltap btnclick"
               }
           }
           var M = this.node.jFetch("mz:handlers:deactivate:fn", v(function (O) {
               if (O.isTouchEvent() && !O.isPrimaryTouch()) {
                   return
               }
               if (O && O.type === "pointerup" && O.pointerType !== "touch") {
                   return
               }
               if (O && (O.type === "pointermove" || O.type === "MSPointerMove" || O.type === "mousemove")) {
                   if (!this.ready || !this.zoomBox.enabled || !this.zoomBox.active) {
                       return
                   }
                   var N = O.getClientXY();
                   if (N.x < this.boundaries.left || N.x > this.boundaries.right || N.y < this.boundaries.top || N.y > this.boundaries.bottom) {
                       this.deactivate(O);
                       return
                   }
               } else {
                   if (this.zoomBox.node !== O.getRelated() && !((this.zoomBox.position === "inner" || this.zoomBox.mode === "magnifier") && this.zoomBox.node.hasChild(O.getRelated())) && !this.node.hasChild(O.getRelated())) {
                       this.deactivate(O);
                       return
                   }
               }
           }).jBindAsEvent(this));
           this.node.jStore("mz:handlers:deactivate:event", K).jAddEvent(K, M, 20)
       },
       unregisterDeactivateEvent: function () {
           var K = this.node.jFetch("mz:handlers:deactivate:event");
           var L = this.node.jFetch("mz:handlers:deactivate:fn");
           this.node.jRemoveEvent(K, L);
           this.node.jDel("mz:handlers:deactivate:fn")
       },
       registerAnimateEvent: function () {
           var K = "touchmove";
           if (q.browser.platform !== "android") {
               if (window.navigator.pointerEnabled) {
                   K += " pointermove"
               } else {
                   if (window.navigator.msPointerEnabled) {
                       K += " MSPointerMove"
                   } else {
                       K += " mousemove"
                   }
               }
           }
           var L = this.node.jFetch("mz:handlers:animate:fn", v(this.animate).jBindAsEvent(this));
           this.node.jStore("mz:handlers:animate:event", K).jAddEvent(K, L)
       },
       unregisterAnimateEvent: function () {
           var K = this.node.jFetch("mz:handlers:animate:event");
           var L = this.node.jFetch("mz:handlers:animate:fn");
           this.node.jRemoveEvent(K, L)
       },
       registerEvents: function () {
           this.moveBind = this.move.jBind(this);
           this.node.jAddEvent(["touchstart", window.navigator.pointerEnabled ? "pointerdown" : "MSPointerDown"], v(function (K) {
               if ((q.browser.androidBrowser) && this.option("zoomMode") && this.option("zoomOn") !== "click" && K.type === "touchstart") {
                   K.stopDefaults();
                   if (q.browser.gecko) {
                       K.stopDistribution()
                   }
               }
               if (!this.zoomBox.active) {
                   return
               }
               if (this.zoomBox.position === "inner" && K.isPrimaryTouch()) {
                   this.lens.spos = K.getClientXY()
               }
           }).jBindAsEvent(this), 10);
           this.node.jAddEvent(["touchend", window.navigator.pointerEnabled ? "pointerup" : "MSPointerUp"], v(function (K) {
               if (K.isTouchEvent() && K.isPrimaryTouch()) {
                   this.lens.touchmovement = false
               }
           }).jBindAsEvent(this), 10);
           this.registerAnimateEvent();
           if (this.option("zoomMode")) {
               this.registerActivateEvent(this.option("zoomOn") === "click");
               this.registerDeactivateEvent(this.option("zoomOn") === "click")
           }
           this.node.jAddEvent("mousedown", function (K) {
               K.stopDistribution()
           }, 10).jAddEvent("btnclick", v(function (K) {
               this.node.jRaiseEvent("MouseEvent", "click");
               if (this.expanded) {
                   this.expandBox.jCallEvent("btnclick", K)
               }
           }).jBind(this), 15);
           if (this.option("expand")) {
               this.node.jAddEvent("tap btnclick", v(this.expand).jBindAsEvent(this), 15)
           } else {
               this.node.jAddEvent("tap btnclick", v(this.openLink).jBindAsEvent(this), 15)
           }
           if (this.additionalImages.length > 1) {
               this.swipe()
           }
           if (!q.browser.mobile && this.option("variableZoom")) {
               this.node.jAddEvent("mousescroll", this.changeZoomLevel.jBindAsEvent(this))
           }
           if (q.browser.mobile) {
               this.pinchToZoom()
           }
           v(window).jAddEvent(q.browser.mobile ? "resize" : "resize scroll", this.onResize);
           if (this.option("history")) {
               v(window).jAddEvent("popstate", this.onHistoryStateChange)
           }
       },
       unregisterEvents: function () {
           if (this.node) {
               this.node.jRemoveEvent("mousescroll")
           }
           v(window).jRemoveEvent("resize scroll", this.onResize);
           if (this.option("history")) {
               v(window).jRemoveEvent("popstate", this.onHistoryStateChange)
           }
           v(this.additionalImages).jEach(function (K) {
               v(K.origin).jClearEvents()
           })
       },
       activate: function (Q) {
           var R;
           var P;
           var N;
           var O;
           var K;
           var L = 0;
           var M = 0;
           if (!this.image.loaded() || !this.ready || !this.zoomBox.enabled || this.zoomBox.active || this.zoomBox.activating) {
               if (!this.image.loaded() && !this.initEvent) {
                   if (Q) {
                       this.initEvent = m(Q);
                       Q.stopQueue()
                   }
                   this.image.load(this.setupZoom.jBind(this));
                   if (!this.loadTimer) {
                       this.loadTimer = v(this.showLoading).jBind(this).jDelay(400)
                   }
               }
               return
           }
           if (Q && Q.type === "pointermove" && Q.pointerType === "touch") {
               return
           }
           if (!this.option("zoomMode") && this.option("expand") && !this.expanded) {
               this.zoomBox.active = true;
               return
           }
           this.zoomBox.activating = true;
           if (this.expanded && this.zoomBox.mode === "zoom") {
               O = this.image.node.jGetRect();
               this.expandStage.jAddClass("mz-zoom-in");
               K = this.expandFigure.jGetRect();
               M = ((O.left + O.right) / 2 - (K.left + K.right) / 2);
               L = ((O.top + O.bottom) / 2 - (K.top + K.bottom) / 2)
           }
           this.zoomBox.image.jRemoveEvent("transitionend");
           this.zoomBox.node.jRemoveClass("mz-deactivating").jRemoveEvent("transitionend");
           this.zoomBox.node.jAddClass("mz-activating");
           this.node.jAddClass("mz-activating");
           this.reflowZoom();
           P = (this.zoomBox.mode === "zoom") ? this.zoomBox.position : this.zoomBox.mode;
           if (q.browser.features.transition && !(this.expanded && this.option("expandZoomOn") === "always")) {
               if (P === "inner") {
                   N = this.image.node.jGetSize();
                   this.zoomBox.image.jSetCss({
                       transform: "translate3d(0," + L + "px, 0) scale(" + N.width / this.zoomSize.width + ", " + N.height / this.zoomSize.height + ")"
                   }).jGetSize();
                   this.zoomBox.image.jAddEvent("transitionend", v(function () {
                       this.zoomBox.image.jRemoveEvent("transitionend");
                       this.zoomBox.node.jRemoveClass("mz-activating mz-p-" + P);
                       this.zoomBox.activating = false;
                       this.zoomBox.active = true
                   }).jBind(this));
                   this.zoomBox.node.jAddClass("mz-p-" + P).jGetSize();
                   if (!q.browser.mobile && q.browser.chrome && (q.browser.uaName === "chrome" || q.browser.uaName === "opera")) {
                       this.zoomBox.activating = false;
                       this.zoomBox.active = true
                   }
               } else {
                   this.zoomBox.node.jAddEvent("transitionend", v(function () {
                       this.zoomBox.node.jRemoveEvent("transitionend");
                       this.zoomBox.node.jRemoveClass("mz-activating mz-p-" + P)
                   }).jBind(this));
                   this.zoomBox.node.jSetCss({
                       transition: "none"
                   });
                   this.zoomBox.node.jAddClass("mz-p-" + P).jGetSize();
                   this.zoomBox.node.jSetCss({
                       transition: ""
                   }).jGetSize();
                   this.zoomBox.node.jRemoveClass("mz-p-" + P);
                   this.zoomBox.activating = false;
                   this.zoomBox.active = true
               }
           } else {
               this.zoomBox.node.jRemoveClass("mz-activating");
               this.zoomBox.activating = false;
               this.zoomBox.active = true
           }
           if (!this.expanded) {
               this.showHint(true)
           }
           if (Q) {
               Q.stop().stopQueue();
               R = Q.getClientXY();
               if (this.zoomBox.mode === "magnifier" && (/tap/i).test(Q.type)) {
                   R.y -= this.zoomBox.height / 2 + 10
               }
               if (P === "inner" && ((/tap/i).test(Q.type) || Q.isTouchEvent())) {
                   this.lens.pos = {
                       x: 0,
                       y: 0
                   };
                   R.x = -(R.x - this.boundaries.left - this.size.width / 2) * (this.zoomSize.width / this.size.width);
                   R.y = -(R.y - this.boundaries.top - this.size.height / 2) * (this.zoomSize.height / this.size.height)
               }
           } else {
               R = {
                   x: this.boundaries.left + (this.boundaries.right - this.boundaries.left) / 2,
                   y: this.boundaries.top + (this.boundaries.bottom - this.boundaries.top) / 2
               };
               if (q.browser.mobile && this.expanded && this.option("expandZoomOn") === "always") {
                   this.lens.innertouch = true;
                   this.lens.pos = {
                       x: 0,
                       y: 0
                   };
                   R.x = -(R.x - this.boundaries.left - this.size.width / 2) * (this.zoomSize.width / this.size.width);
                   R.y = -(R.y - this.boundaries.top - this.size.height / 2) * (this.zoomSize.height / this.size.height)
               }
           }
           this.node.jRemoveClass("mz-activating").jAddClass("mz-active");
           R.x += -M;
           R.y += -L;
           this.lens.spos = {
               x: 0,
               y: 0
           };
           this.lens.dx = 0;
           this.lens.dy = 0;
           this.animate(Q, R, true);
           I("onZoomIn", this.id)
       },
       deactivate: function (M, R) {
           var P;
           var N;
           var K;
           var L;
           var O = 0;
           var Q = 0;
           var S = this.zoomBox.active;
           this.initEvent = null;
           if (!this.ready) {
               return
           }
           if (M && M.type === "pointerout" && M.pointerType === "touch") {
               return
           }
           clearTimeout(this.moveTimer);
           this.moveTimer = null;
           clearTimeout(this.activateTimer);
           this.activateTimer = null;
           this.zoomBox.activating = false;
           this.zoomBox.active = false;
           if (R !== true && !this.expanded) {
               if (S) {
                   if (q.browser.mobile && !this.expanded && this.zoomBox.mode === "zoom") {
                       this.reflowZoom()
                   } else {
                       this.showHint()
                   }
               }
           }
           if (!this.zoomBox.enabled) {
               return
           }
           if (M) {
               M.stop()
           }
           this.zoomBox.image.jRemoveEvent("transitionend");
           this.zoomBox.node.jRemoveClass("mz-activating").jRemoveEvent("transitionend");
           if (this.expanded) {
               L = this.expandFigure.jGetRect();
               if (this.option("expandZoomOn") !== "always") {
                   this.expandStage.jRemoveClass("mz-zoom-in")
               }
               this.image.node.jSetCss({
                   "max-height": this.expandMaxHeight()
               });
               K = this.image.node.jGetRect();
               Q = ((K.left + K.right) / 2 - (L.left + L.right) / 2);
               O = ((K.top + K.bottom) / 2 - (L.top + L.bottom) / 2)
           }
           P = (this.zoomBox.mode === "zoom") ? this.zoomBox.position : this.zoomBox.mode;
           if (q.browser.features.transition && M && !(this.expanded && this.option("expandZoomOn") === "always")) {
               if (P === "inner") {
                   this.zoomBox.image.jAddEvent("transitionend", v(function () {
                       this.zoomBox.image.jRemoveEvent("transitionend");
                       this.node.jRemoveClass("mz-active");
                       setTimeout(v(function () {
                           this.zoomBox.hide()
                       }).jBind(this), 32)
                   }).jBind(this));
                   N = this.image.node.jGetSize();
                   this.zoomBox.node.jAddClass("mz-deactivating mz-p-" + P).jGetSize();
                   this.zoomBox.image.jSetCss({
                       transform: "translate3d(0," + O + "px,0) scale(" + N.width / this.zoomSize.maxWidth + ", " + N.height / this.zoomSize.maxHeight + ")"
                   })
               } else {
                   this.zoomBox.node.jAddEvent("transitionend", v(function () {
                       this.zoomBox.hide();
                       this.node.jRemoveClass("mz-active")
                   }).jBind(this));
                   this.zoomBox.node.jGetCss("opacity");
                   this.zoomBox.node.jAddClass("mz-deactivating mz-p-" + P);
                   this.node.jRemoveClass("mz-active")
               }
           } else {
               this.zoomBox.hide();
               this.node.jRemoveClass("mz-active")
           }
           this.lens.dx = 0;
           this.lens.dy = 0;
           this.lens.spos = {
               x: 0,
               y: 0
           };
           this.lens.hide();
           if (S) {
               I("onZoomOut", this.id)
           }
       },
       animate: function (U, T, S) {
           var M = T;
           var O;
           var N;
           var Q = 0;
           var L;
           var P = 0;
           var K;
           var V;
           var R = false;
           if (!this.zoomBox.active && !S) {
               return
           }
           if (U) {
               v(U).stopDefaults().stopDistribution();
               if (U.isTouchEvent() && !U.isPrimaryTouch()) {
                   return
               }
               R = (/tap/i).test(U.type) || U.isTouchEvent();
               if (R && !this.lens.touchmovement) {
                   this.lens.touchmovement = R
               }
               if (!M) {
                   M = U.getClientXY()
               }
           }
           if (this.zoomBox.mode === "preview") {
               return
           }
           if (this.zoomBox.mode === "zoom" && this.zoomBox.position === "inner" && (U && R || !U && this.lens.innertouch)) {
               this.lens.innertouch = true;
               O = this.lens.pos.x + (M.x - this.lens.spos.x);
               N = this.lens.pos.y + (M.y - this.lens.spos.y);
               this.lens.spos = M;
               Q = Math.min(0, this.zoomBox.innerWidth - this.zoomSize.width) / 2;
               L = -Q;
               P = Math.min(0, this.zoomBox.innerHeight - this.zoomSize.height) / 2;
               K = -P
           } else {
               this.lens.innertouch = false;
               if (this.zoomBox.mode === "magnifier") {
                   M.y = Math.max(this.boundaries.top, Math.min(M.y, this.boundaries.bottom));
                   M.x = Math.max(this.boundaries.left, Math.min(M.x, this.boundaries.right))
               }
               O = M.x - this.boundaries.left;
               N = M.y - this.boundaries.top;
               L = this.size.width - this.lens.width;
               K = this.size.height - this.lens.height;
               O -= this.lens.width / 2;
               N -= this.lens.height / 2
           }
           if (this.zoomBox.mode !== "magnifier") {
               O = Math.max(Q, Math.min(O, L));
               N = Math.max(P, Math.min(N, K))
           }
           this.lens.pos.x = O;
           this.lens.pos.y = N;
           if (this.zoomBox.mode === "zoom") {
               if (q.browser.features.transform) {
                   this.lens.node.jSetCss({
                       transform: "translate(" + this.lens.pos.x + "px," + this.lens.pos.y + "px)"
                   });
                   this.lens.image.jSetCss({
                       transform: "translate(" + -(this.lens.pos.x + this.lens.border.x) + "px, " + -(this.lens.pos.y + this.lens.border.y) + "px)"
                   })
               } else {
                   this.lens.node.jSetCss({
                       top: this.lens.pos.y,
                       left: this.lens.pos.x
                   });
                   this.lens.image.jSetCss({
                       top: -(this.lens.pos.y + this.lens.border.y),
                       left: -(this.lens.pos.x + this.lens.border.x)
                   })
               }
           }
           if (this.zoomBox.mode === "magnifier") {
               if (this.lens.touchmovement && !(U && U.type === "dbltap")) {
                   M.y -= this.zoomBox.height / 2 + 10
               }
               this.zoomBox.node.jSetCss({
                   top: M.y - this.boundaries.top - this.zoomBox.height / 2,
                   left: M.x - this.boundaries.left - this.zoomBox.width / 2
               })
           }
           if (!this.moveTimer) {
               this.lens.dx = 0;
               this.lens.dy = 0;
               this.move(1)
           }
       },
       move: function (P) {
           var N;
           var L;
           var K;
           var Q;
           var O;
           var M;
           if (!isFinite(P)) {
               if (this.lens.innertouch) {
                   P = this.lens.touchmovement ? 0.4 : 0.16
               } else {
                   P = this.option("smoothing") ? 0.2 : this.lens.touchmovement ? 0.4 : 0.8
               }
           }
           N = ((this.lens.pos.x - this.lens.dx) * P);
           L = ((this.lens.pos.y - this.lens.dy) * P);
           this.lens.dx += N;
           this.lens.dy += L;
           if (!this.moveTimer || Math.abs(N) > 0.000001 || Math.abs(L) > 0.000001) {
               if (this.lens.innertouch) {
                   K = this.lens.dx;
                   Q = this.lens.dy
               } else {
                   K = (this.lens.dx * (this.zoomSize.width / this.size.width) - Math.max(0, this.zoomSize.width - this.zoomBox.innerWidth) / 2);
                   Q = (this.lens.dy * (this.zoomSize.height / this.size.height) - Math.max(0, this.zoomSize.height - this.zoomBox.innerHeight) / 2);
                   if (this.zoomBox.mode === "magnifier") {
                       K = Math.round(K);
                       Q = Math.round(Q)
                   }
                   K = -K;
                   Q = -Q
               }
               O = this.zoomSize.width / this.zoomSize.maxWidth;
               M = this.zoomSize.height / this.zoomSize.maxHeight;
               this.zoomBox.image.jSetCss(q.browser.features.transform ? {
                   transform: d + K + "px," + Q + "px" + C + " scale(" + O + "," + M + ")"
               } : {
                   width: this.zoomSize.width,
                   height: this.zoomSize.height,
                   left: -(this.lens.dx * (this.zoomSize.width / this.size.width) + Math.min(0, this.zoomSize.width - this.zoomBox.innerWidth) / 2),
                   top: -(this.lens.dy * (this.zoomSize.height / this.size.height) + Math.min(0, this.zoomSize.height - this.zoomBox.innerHeight) / 2)
               })
           }
           if (this.zoomBox.mode === "magnifier") {
               return
           }
           this.moveTimer = setTimeout(this.moveBind, 16)
       },
       swipe: function () {
           var W;
           var M;
           var R = 30;
           var O = 201;
           var T;
           var U = "";
           var L = {};
           var K;
           var Q;
           var V = 0;
           var X = {
               transition: q.browser.cssTransform + String.fromCharCode(32) + "300ms cubic-bezier(.18,.35,.58,1)"
           };
           var N;
           var S;
           var P = v(function (Y) {
               if (!this.ready || this.zoomBox.active) {
                   return
               }
               if (Y.state === "dragstart") {
                   clearTimeout(this.activateTimer);
                   this.activateTimer = null;
                   V = 0;
                   L = {
                       x: Y.x,
                       y: Y.y,
                       ts: Y.timeStamp
                   };
                   W = this.size.width;
                   M = W / 2;
                   this.image.node.jRemoveEvent("transitionend");
                   this.image.node.jSetCssProp("transition", "");
                   this.image.node.jSetCssProp("transform", "translate3d(0, 0, 0)");
                   S = null
               } else {
                   K = (Y.x - L.x);
                   Q = {
                       x: 0,
                       y: 0,
                       z: 0
                   };
                   if (S === null) {
                       S = (Math.abs(Y.x - L.x) < Math.abs(Y.y - L.y))
                   }
                   if (S) {
                       return
                   }
                   Y.stop();
                   if (Y.state === "dragend") {
                       V = 0;
                       N = null;
                       T = Y.timeStamp - L.ts;
                       if (Math.abs(K) > M || (T < O && Math.abs(K) > R)) {
                           if ((U = (K > 0) ? "backward" : (K <= 0) ? "forward" : "")) {
                               if (U === "backward") {
                                   N = this.getPrev();
                                   V += W * 10
                               } else {
                                   N = this.getNext();
                                   V -= W * 10
                               }
                           }
                       }
                       Q.x = V;
                       Q.deg = -90 * (Q.x / W);
                       this.image.node.jAddEvent("transitionend", v(function (Z) {
                           this.image.node.jRemoveEvent("transitionend");
                           this.image.node.jSetCssProp("transition", "");
                           if (N) {
                               this.image.node.jSetCss({
                                   transform: "translate3d(" + Q.x + "px, 0px, 0px)"
                               });
                               this.update(N, true)
                           }
                       }).jBind(this));
                       this.image.node.jSetCss(X);
                       this.image.node.jSetCss({
                           "transition-duration": Q.x ? "100ms" : "300ms",
                           opacity: 1 - 0.2 * Math.abs(Q.x / W),
                           transform: "translate3d(" + Q.x + "px, 0px, 0px)"
                       });
                       K = 0;
                       return
                   }
                   Q.x = K;
                   Q.z = -50 * Math.abs(Q.x / M);
                   Q.deg = -60 * (Q.x / M);
                   this.image.node.jSetCss({
                       opacity: 1 - 0.2 * Math.abs(Q.x / M),
                       transform: "translate3d(" + Q.x + "px, 0px, " + Q.z + "px)"
                   })
               }
           }).jBind(this);
           this.node.jAddEvent("touchdrag", P)
       },
       pinchToZoom: function () {
           var M = {
               width: 0,
               height: 0
           };
           var O = false;
           var N;
           var L = v(function (T, P, S) {
               var Q;
               var R;
               if (!this.zoomBox.active && !S) {
                   return
               }
               var U = q.detach(this.zoomSize);
               Q = Math.max(N.width, Math.round(M.width * T));
               Q = Math.min(Q, this.zoomSize.maxWidth);
               R = Q / (this.zoomSize.maxWidth / this.zoomSize.maxHeight);
               this.zoomSize.width = Math.floor(Q);
               this.zoomSize.height = Math.floor(R);
               this.lens.width = Math.ceil(this.zoomBox.innerWidth / (this.zoomSize.width / N.width));
               this.lens.height = Math.ceil(this.zoomBox.innerHeight / (this.zoomSize.height / N.height));
               this.lens.node.jSetCss({
                   width: this.lens.width,
                   height: this.lens.height
               });
               q.extend(this.lens, this.lens.node.jGetSize());
               clearTimeout(this.moveTimer);
               this.moveTimer = null;
               P.x = this.lens.spos.x * (this.zoomSize.width / U.width) + (P.x - this.boundaries.left - this.size.width / 2) * (1 - (this.zoomSize.width / U.width));
               P.y = this.lens.spos.y * (this.zoomSize.height / U.height) + (P.y - this.boundaries.top - this.size.height / 2) * (1 - (this.zoomSize.height / U.height));
               this.lens.spos = {
                   x: 0,
                   y: 0
               };
               this.lens.pos = {
                   x: 0,
                   y: 0
               };
               this.lens.innertouch = true;
               this.animate(null, {
                   x: P.x,
                   y: P.y
               });
               clearTimeout(this.moveTimer);
               this.moveTimer = null
           }).jBind(this);
           var K = v(function (R) {
               if (!O && R.state !== "pinchstart" && !R.cloned) {
                   return
               }
               R.stop();
               var Q = v(window).jGetScroll();
               var P = false;
               var S = {
                   x: R.centerPoint.x - Q.x,
                   y: R.centerPoint.y - Q.y
               };
               switch (R.state) {
               case "pinchstart":
                   this.unregisterAnimateEvent();
                   M = q.detach(this.zoomSize);
                   if (this.expanded) {
                       N = this.image.node.jGetSize()
                   } else {
                       N = this.size
                   }
                   clearTimeout(this.moveTimer);
                   this.moveTimer = null;
                   if (this.zoomBox.active) {
                       this.lens.spos = q.detach(this.lens.pos)
                   }
                   O = true;
                   break;
               case "pinchend":
                   O = false;
                   if (this.zoomBox.active) {
                       if (this.option("expandZoomOn") !== "always" && this.zoomSize.width <= N.width && this.zoomSize.height <= N.height) {
                           O = false;
                           this.deactivate(null)
                       } else {
                           if (R.points.length > 0) {
                               this.lens.spos = {
                                   x: R.points[0].clientX,
                                   y: R.points[0].clientY
                               }
                           }
                       }
                   }
                   this.registerAnimateEvent();
                   break;
               case "pinchresize":
                   break;
               case "pinchmove":
                   if (this.expanded && R.zoom === -1 && (!this.zoomBox.active || this.option("expandZoomOn") === "always")) {
                       if (R.scale < c) {
                           this.close()
                       }
                   } else {
                       if (this.expanded && R.zoom === 1 && this.option("expandZoomOn") === "always") {} else {
                           if (this.option("expand") && !this.expanded) {
                               if (R.scale > x) {
                                   O = false;
                                   this.registerAnimateEvent();
                                   this.expand(R);
                                   return
                               }
                           } else {
                               if (R.zoom === 1 && !this.zoomBox.active) {
                                   if (!this.image.loaded() || !this.ready || !this.zoomBox.enabled) {
                                       if (!this.image.loaded() && !this.initEvent) {
                                           if (R) {
                                               this.initEvent = m(R);
                                               R.stopQueue()
                                           }
                                           this.image.load(this.setupZoom.jBind(this));
                                           if (!this.loadTimer) {
                                               this.loadTimer = v(this.showLoading).jBind(this).jDelay(400)
                                           }
                                       }
                                       return
                                   }
                                   this.zoomBox.activating = true;
                                   if (this.expanded && this.zoomBox.mode === "zoom") {
                                       this.expandStage.jAddClass("mz-zoom-in")
                                   }
                                   this.zoomBox.image.jRemoveEvent("transitionend");
                                   this.zoomBox.node.jRemoveClass("mz-deactivating").jRemoveEvent("transitionend");
                                   this.zoomBox.node.jAddClass("mz-activating");
                                   this.node.jAddClass("mz-activating");
                                   this.reflowZoom();
                                   this.zoomSize.width = N.width;
                                   this.zoomSize.height = N.height;
                                   this.zoomBox.activating = false;
                                   this.zoomBox.active = true;
                                   M = q.detach(this.zoomSize);
                                   this.zoomBox.node.jRemoveClass("mz-activating");
                                   this.node.jRemoveClass("mz-activating").jAddClass("mz-active");
                                   this.lens.spos = {
                                       x: 0,
                                       y: 0
                                   };
                                   this.lens.pos = {
                                       x: 0,
                                       y: 0
                                   };
                                   P = true;
                                   if (!this.expanded) {
                                       this.showHint(true)
                                   }
                               }
                               L(R.scale, S, P);
                               if (P) {
                                   I("onZoomIn", this.id)
                               }
                           }
                       }
                   }
                   break
               }
           }).jBind(this);
           this.node.jAddEvent("pinch", K)
       },
       setupButtons: function () {
           var K = document.createDocumentFragment();
           v(["prev", "next", "close"]).jEach(function (M) {
               var L = "mz-button";
               this.buttons[M] = q.$new("button", {
                   type: "button",
                   title: this.option("text-btn-" + M)
               }).jAddClass(L).jAddClass(L + "-" + M);
               K.appendChild(this.buttons[M]);
               switch (M) {
               case "prev":
                   this.buttons[M].jAddEvent("tap btnclick", function (N) {
                       N.stop();
                       this.update(this.getPrev())
                   }.jBindAsEvent(this));
                   break;
               case "next":
                   this.buttons[M].jAddEvent("tap btnclick", function (N) {
                       N.stop();
                       this.update(this.getNext())
                   }.jBindAsEvent(this));
                   break;
               case "close":
                   this.buttons[M].jAddEvent("tap btnclick", function (N) {
                       N.stop();
                       this.close()
                   }.jBindAsEvent(this)).hide();
                   break;
               default:
               }
           }, this);
           this.toggleNavButtons(this.additionalImages.length > 1);
           this.navControlsLayer = q.$new("div").jAddClass("mz-nav-controls").append(K).jAppendTo(this.node)
       },
       toggleNavButtons: function (K) {
           if (K) {
               this.buttons.next.show();
               this.buttons.prev.show()
           } else {
               this.buttons.next.hide();
               this.buttons.prev.hide()
           }
       },
       setupExpandGallery: function () {
           var L;
           var K;
           if (this.additionalImages.length) {
               this.expandGallery = this.additionalImages
           } else {
               L = this.placeholder.getAttribute("data-gallery");
               if (L) {
                   if (q.browser.features.query) {
                       K = q.$A(document.querySelectorAll('.MagicZoom[data-gallery="' + L + '"], .MagicZoomPlus[data-gallery="' + L + '"]'))
                   } else {
                       K = q.$A(document.getElementsByTagName("A")).filter(function (M) {
                           return L === M.getAttribute("data-gallery")
                       })
                   }
                   v(K).jEach(function (N) {
                       var M;
                       var O;
                       M = n(N);
                       if (M && M.additionalImages.length > 0) {
                           return
                       }
                       if (M) {
                           O = new o(M.image.small.url, M.image.zoom.url, M.image.caption, null, M.image.origin);
                           O.link = M.image.link;
                           O.alt = M.image.alt
                       } else {
                           O = new o().parseNode(N, M ? M.originalTitle : null)
                       }
                       if ((this.image.zoom.src.has(O.zoom.url) || this.image.zoom.url.has(O.zoom.url)) && (this.image.small.src.has(O.small.url) || this.image.small.url.has(O.small.url))) {
                           O = this.image
                       }
                       this.expandGallery.push(O)
                   }, this);
                   this.primaryImage = this.image
               }
           }
           if (!this.expandedViewId) {
               this.expandedViewId = Math.floor(Math.random() * q.now())
           }
           if (this.expandGallery.length > 1) {
               this.expandStage.jAddClass("with-thumbs");
               this.expandNav = q.$new("div", {
                   "class": "mz-expand-thumbnails"
               }).jAppendTo(this.expandStage);
               this.expandThumbs = new E(this.expandNav);
               v(this.expandGallery).jEach(function (M) {
                   var N = v(function (O) {
                       this.setActiveThumb(M);
                       this.update(M)
                   }).jBind(this);
                   M.selector = this.expandThumbs.addItem(q.$new("img", {
                       src: M.getURL("small"),
                       alt: M.alt
                   }).jAddEvent("tap btnclick", function (O) {
                       O.stop()
                   }).jAddEvent("tap " + (this.option("selectorTrigger") === "hover" ? "mouseover mouseout" : "btnclick"), v(function (P, O) {
                       if (this.updateTimer) {
                           clearTimeout(this.updateTimer)
                       }
                       this.updateTimer = false;
                       if (P.type === "mouseover") {
                           this.updateTimer = v(N).jDelay(O)
                       } else {
                           if (P.type === "tap" || P.type === "btnclick") {
                               N()
                           }
                       }
                   }).jBindAsEvent(this, 60)))
               }, this)
           } else {
               this.expandStage.jRemoveClass("with-thumbs")
           }
           this.toggleNavButtons(this.expandGallery.length > 1);
           this.buttons.close.show()
       },
       destroyExpandGallery: function () {
           var K;
           if (this.expandThumbs) {
               this.expandThumbs.stop();
               this.expandThumbs = null
           }
           if (this.expandNav) {
               this.expandNav.jRemove();
               this.expandNav = null
           }
           this.toggleNavButtons(this.additionalImages.length > 1);
           this.buttons.close.hide();
           if (this.expandGallery.length > 1 && !this.additionalImages.length) {
               this.node.jRemoveEvent("touchdrag");
               this.image.node.jRemove().getAttribute("style");
               this.image.node.removeAttribute("style");
               this.primaryImage.node.jAppendTo(this.node);
               this.setupZoom(this.primaryImage);
               while (K = this.expandGallery.pop()) {
                   if (K !== this.primaryImage) {
                       if (K.small.node) {
                           K.small.node.kill();
                           K.small.node = null
                       }
                       if (K.zoom.node) {
                           K.zoom.node.kill();
                           K.zoom.node = null
                       }
                       K = null
                   }
               }
           }
           this.expandGallery = []
       },
       close: function () {
           if (!this.ready || !this.expanded) {
               return
           }
           if (q.browser.platform === "ios" && q.browser.uaName === "safari" && parseInt(q.browser.uaVersion) === 7) {
               clearInterval(h);
               h = null
           }
           v(document).jRemoveEvent("keydown", this.keyboardCallback);
           this.deactivate(null, true);
           this.ready = false;
           if (q.browser.fullScreen.capable && q.browser.fullScreen.enabled()) {
               q.browser.fullScreen.cancel()
           } else {
               if (q.browser.features.transition) {
                   this.node.jRemoveEvent("transitionend").jSetCss({
                       transition: ""
                   });
                   this.node.jAddEvent("transitionend", this.onClose);
                   if (q.browser.webkit) {
                       setTimeout(v(function () {
                           this.onClose()
                       }).jBind(this), 260)
                   }
                   this.expandBg.jRemoveEvent("transitionend").jSetCss({
                       transition: ""
                   });
                   this.expandBg.jSetCss({
                       transition: "all 0.6s cubic-bezier(0.895, 0.030, 0.685, 0.220) 0.0s"
                   }).jGetSize();
                   this.node.jSetCss({
                       transition: "all .3s cubic-bezier(0.600, 0, 0.735, 0.045) 0s"
                   }).jGetSize();
                   if (this.zoomBox.mode !== false && this.option("expandZoomOn") === "always" && this.option("expandZoomMode") !== "magnifier") {
                       this.image.node.jSetCss({
                           "max-height": this.image.jGetSize("zoom").height
                       });
                       this.image.node.jSetCss({
                           "max-width": this.image.jGetSize("zoom").width
                       })
                   }
                   this.expandBg.jSetCss({
                       opacity: 0.4
                   });
                   this.node.jSetCss({
                       opacity: 0.01,
                       transform: "scale(0.4)"
                   })
               } else {
                   this.onClose()
               }
           }
       },
       expand: function (L) {
           if (!this.image.loaded() || !this.ready || this.expanded) {
               if (!this.image.loaded() && !this.initEvent) {
                   if (L) {
                       this.initEvent = m(L);
                       L.stopQueue();
                       if (L.type === "tap") {
                           L.events[1].stopQueue()
                       }
                   }
                   this.image.load(this.setupZoom.jBind(this));
                   if (!this.loadTimer) {
                       this.loadTimer = v(this.showLoading).jBind(this).jDelay(400)
                   }
               }
               return
           }
           if (L) {
               L.stopQueue()
           }
           var K = v(this.node).jFetch("cr");
           this.hideHint();
           this.hintRuns--;
           this.deactivate(null, true);
           this.unregisterActivateEvent();
           this.unregisterDeactivateEvent();
           this.ready = false;
           if (!this.expandBox) {
               this.expandBox = q.$new("div").jAddClass("mz-expand").jAddClass(this.option("cssClass")).jSetCss({
                   opacity: 0
               });
               this.expandStage = q.$new("div").jAddClass("mz-expand-stage").jAppendTo(this.expandBox);
               this.expandBox.jAddEvent("mousescroll touchstart dbltap", v(function (M) {
                   v(M).stop()
               }));
               if (this.option("closeOnClickOutside")) {
                   this.expandBox.jAddEvent("tap btnclick", function (O) {
                       var N = O.jGetPageXY();
                       var M = v(this.option("expandZoomMode") === "magnifier" ? this.zoomBox.node : this.zoomBox.image).jGetRect();
                       if (this.option("expandZoomOn") !== "always" && M.top <= N.y && N.y <= M.bottom && M.left <= N.x && N.x <= M.right) {
                           O.stopQueue();
                           this.deactivate(O);
                           return
                       }
                       if (this.option("expandZoomOn") !== "always" && this.node.hasChild(O.getOriginalTarget())) {
                           return
                       }
                       O.stop();
                       this.close()
                   }.jBindAsEvent(this))
               }
               this.keyboardCallback = v(function (N) {
                   var M = null;
                   if (N.keyCode !== 27 && N.keyCode !== 37 && N.keyCode !== 39) {
                       return
                   }
                   v(N).stop();
                   if (N.keyCode === 27) {
                       this.close()
                   } else {
                       M = (N.keyCode === 37) ? this.getPrev() : this.getNext();
                       if (M) {
                           this.update(M)
                       }
                   }
               }).jBindAsEvent(this);
               this.onExpand = v(function () {
                   var O;
                   this.node.jRemoveEvent("transitionend").jSetCss({
                       transition: "",
                       transform: "translate3d(0, 0, 0)"
                   });
                   if (this.expanded) {
                       return
                   }
                   this.expanded = true;
                   if (this.option("history")) {
                       try {
                           var M = "#mz-expanded-view-" + this.expandedViewId;
                           if (window.location.hash !== M) {
                               if (history.state && history.state.expandedView && history.state.mzId) {
                                   history.replaceState({
                                       expandedView: this.expandedViewId,
                                       mzId: this.id
                                   }, document.title, M)
                               } else {
                                   history.pushState({
                                       expandedView: this.expandedViewId,
                                       mzId: this.id
                                   }, document.title, M)
                               }
                           }
                       } catch (N) {}
                   }
                   this.expandBox.jRemoveClass("mz-expand-opening").jSetCss({
                       opacity: 1
                   });
                   this.zoomBox.setMode(this.option("expandZoomMode"));
                   this.zoomSize = q.detach(this.zoomSizeOrigin);
                   this.resizeCallback();
                   if (this.expandCaption && this.image.caption) {
                       this.expandCaption.jAddClass("mz-show")
                   }
                   if (this.option("expandZoomOn") !== "always") {
                       this.registerActivateEvent(true);
                       this.registerDeactivateEvent(true)
                   }
                   this.ready = true;
                   if (this.option("expandZoomOn") === "always") {
                       if (this.zoomBox.mode !== false) {
                           this.zoomBox.enable(true)
                       }
                       if (q.browser.mobile && this.mobileZoomHint) {
                           this.mobileZoomHint = false
                       }
                       this.activate()
                   }
                   if ((q.browser.mobile || this.option("forceTouch")) && this.mobileZoomHint && this.zoomBox.enabled) {
                       this.showHint(true, this.option("textClickZoomHint"));
                       if (this.hintRuns !== Infinity) {
                           this.mobileZoomHint = false
                       }
                   }
                   this.navControlsLayer.jRemoveClass("mz-hidden").jAddClass("mz-fade mz-visible");
                   if (this.expandNav) {
                       this.expandNav.jRemoveClass("mz-hidden").jAddClass("mz-fade mz-visible")
                   }
                   if (this.expandThumbs) {
                       this.expandThumbs.run();
                       this.setActiveThumb(this.image)
                   }
                   if (K) {
                       K.jAppendTo(this.expandBox, ((Math.floor(Math.random() * 101) + 1) % 2) ? "top" : "bottom")
                   }
                   if (this.expandGallery.length > 1 && !this.additionalImages.length) {
                       this.swipe()
                   }
                   v(document).jAddEvent("keydown", this.keyboardCallback);
                   if (q.browser.platform === "ios" && q.browser.uaName === "safari" && parseInt(q.browser.uaVersion) === 7) {
                       h = J()
                   }
                   I("onExpandOpen", this.id)
               }).jBind(this);
               this.onClose = v(function () {
                   this.node.jRemoveEvent("transitionend");
                   if (!this.expanded) {
                       return
                   }
                   if (this.expanded) {
                       v(document).jRemoveEvent("keydown", this.keyboardCallback);
                       this.deactivate(null, true)
                   }
                   this.setSize(true);
                   this.destroyExpandGallery();
                   this.expanded = false;
                   if (this.option("history")) {
                       if (window.location.hash === "#mz-expanded-view-" + this.expandedViewId) {
                           history.back()
                       }
                   }
                   this.zoomBox.setMode(this.option("zoomMode"));
                   this.node.replaceChild(this.image.getNode("small"), this.image.node);
                   this.image.setCurNode("small");
                   v(this.image.node).jSetCss({
                       width: "",
                       height: "",
                       "max-width": Math.min(this.image.jGetSize("small").width),
                       "max-height": Math.min(this.image.jGetSize("small").height)
                   });
                   this.lens.image.src = this.image.getURL("small");
                   this.node.jSetCss({
                       opacity: "",
                       transition: ""
                   });
                   this.node.jSetCss({
                       transform: "translate3d(0, 0, 0)"
                   });
                   v(this.placeholder).replaceChild(this.node, this.stubNode);
                   this.navControlsLayer.jRemoveClass("mz-expand-controls").jRemoveClass("mz-hidden").jAddClass("mz-fade mz-visible").jAppendTo(this.node);
                   this.setSize(true);
                   if (this.expandCaption) {
                       this.expandCaption.jRemove();
                       this.expandCaption = null
                   }
                   this.unregisterActivateEvent();
                   this.unregisterDeactivateEvent();
                   if (this.option("zoomOn") === "always") {
                       this.activate()
                   } else {
                       if (this.option("zoomMode") !== false) {
                           this.registerActivateEvent(this.option("zoomOn") === "click");
                           this.registerDeactivateEvent(this.option("zoomOn") === "click")
                       }
                   }
                   this.showHint();
                   this.expandBg.jRemoveEvent("transitionend");
                   this.expandBox.jRemove();
                   this.expandBg.jRemove();
                   this.expandBg = null;
                   if (G) {
                       G.jRemove()
                   }
                   v(q.browser.getDoc()).jRemoveClass("mz-expanded-view-open");
                   this.ready = true;
                   if (q.browser.ieMode < 10) {
                       this.resizeCallback()
                   } else {
                       v(window).jRaiseEvent("UIEvent", "resize")
                   }
                   I("onExpandClose", this.id)
               }).jBind(this);
               this.expandImageStage = q.$new("div", {
                   "class": "mz-image-stage"
               }).jAppendTo(this.expandStage);
               this.expandFigure = q.$new("figure").jAppendTo(this.expandImageStage);
               this.stubNode = this.node.cloneNode(false)
           }
           this.navControlsLayer.jAddClass("mz-expand-controls").jAppendTo(this.expandImageStage);
           this.setupExpandGallery();
           if (G) {
               G.jAppendTo(document.body)
           }
           v(q.browser.getDoc()).jAddClass("mz-expanded-view-open");
           v(document.body).jGetSize();
           if (this.option("expand") === "fullscreen") {
               this.prepareExpandedView();
               q.browser.fullScreen.request(this.expandBox, {
                   onEnter: v(function () {
                       this.onExpand()
                   }).jBind(this),
                   onExit: this.onClose,
                   fallback: v(function () {
                       this.expandToWindow()
                   }).jBind(this)
               })
           } else {
               setTimeout(v(function () {
                   this.prepareExpandedView();
                   this.expandToWindow()
               }).jBind(this), 96)
           }
       },
       prepareExpandedView: function () {
           var L;
           var K;
           L = q.$new("img", {
               srcset: this.image.getURL("zoom") + " " + this.image.getRatio("zoom") + "x",
               src: this.image.getURL("zoom"),
               alt: this.image.alt
           });
           this.expandBg = q.$new("div").jAddClass("mz-expand-bg").append((q.browser.features.cssFilters || q.browser.ieMode < 10) ? L : new q.SVGImage(L).blur(k).getNode()).jAppendTo(this.expandBox);
           if (this.option("expandZoomOn") === "always" && this.option("expandZoomMode") !== false) {
               this.expandStage.jAddClass("mz-always-zoom" + (this.option("expandZoomMode") === "zoom" ? " mz-zoom-in" : "")).jGetSize()
           }
           K = v(this.node)[(q.browser.ieMode < 10) ? "jGetSize" : "getBoundingClientRect"]();
           v(this.stubNode).jSetCss({
               width: K.width,
               height: K.height
           });
           this.node.replaceChild(this.image.getNode("zoom"), this.image.node);
           this.image.setCurNode("zoom");
           this.expandBox.jAppendTo(document.body);
           if (G) {
               this.expandBox.jSetCss({
                   height: window.innerHeight,
                   maxHeight: "100vh",
                   top: Math.abs(G.getBoundingClientRect().top)
               })
           }
           this.expandMaxWidth = function () {
               var M = this.expandImageStage;
               if (v(this.expandFigure).jGetSize().width > 50) {
                   M = this.expandFigure
               }
               return function () {
                   return this.option("expandZoomOn") === "always" && this.option("expandZoomMode") !== false && this.option("expandZoomMode") !== "magnifier" ? Infinity : Math.round(v(M).getInnerSize().width)
               }
           }.call(this);
           this.expandMaxHeight = function () {
               var M = this.expandImageStage;
               if (v(this.expandFigure).jGetSize().height > 50) {
                   M = this.expandFigure
               }
               return function () {
                   return this.option("expandZoomOn") === "always" && this.option("expandZoomMode") !== false && this.option("expandZoomMode") !== "magnifier" ? Infinity : Math.round(v(M).getInnerSize().height)
               }
           }.call(this);
           this.navControlsLayer.jRemoveClass("mz-fade mz-visible").jAddClass("mz-hidden");
           if (this.expandNav) {
               this.expandNav.jRemoveClass("mz-fade mz-visible").jAddClass("mz-hidden")
           }
           if (this.option("expandCaption")) {
               this.expandCaption = q.$new("figcaption", {
                   "class": "mz-caption"
               }).jAppendTo(this.expandImageStage);
               if (this.expandCaption && this.image.caption) {
                   if (this.image.link) {
                       this.expandCaption.append(q.$new("a", {
                           href: this.image.link
                       }).jAddEvent("tap btnclick", this.openLink.jBind(this)).changeContent(this.image.caption))
                   } else {
                       this.expandCaption.changeContent(this.image.caption)
                   }
               }
           }
           this.image.node.jSetCss({
               "max-height": Math.min(this.image.jGetSize("zoom").height, this.expandMaxHeight())
           });
           this.image.node.jSetCss({
               "max-width": Math.min(this.image.jGetSize("zoom").width, this.expandMaxWidth())
           });
           this.expandFigure.append(v(this.placeholder).replaceChild(this.stubNode, this.node))
       },
       expandToWindow: function () {
           this.node.jSetCss({
               transition: ""
           });
           this.node.jSetCss({
               transform: "scale(0.6)"
           }).jGetSize();
           this.node.jSetCss({
               transition: q.browser.cssTransform + " 0.4s cubic-bezier(0.175, 0.885, 0.320, 1) 0s"
           });
           if (q.browser.features.transition) {
               this.node.jAddEvent("transitionend", this.onExpand);
               if (q.browser.chrome && (q.browser.uaName === "chrome" || q.browser.uaName === "opera")) {
                   setTimeout(v(function () {
                       this.onExpand()
                   }).jBind(this), 500)
               }
           } else {
               this.onExpand.jDelay(16, this)
           }
           this.expandBox.jSetCss({
               opacity: 1
           });
           this.node.jSetCss({
               transform: "scale(1)"
           })
       },
       openLink: function () {
           if (this.image.link) {
               window.open(this.image.link, "_self")
           }
       },
       getNext: function () {
           var K = (this.expanded ? this.expandGallery : this.additionalImages).filter(function (N) {
               return (N.small.state !== -1 || N.zoom.state !== -1)
           });
           var L = K.length;
           var M = v(K).indexOf(this.image) + 1;
           return (L <= 1) ? null : K[(M >= L) ? 0 : M]
       },
       getPrev: function () {
           var K = (this.expanded ? this.expandGallery : this.additionalImages).filter(function (N) {
               return (N.small.state !== -1 || N.zoom.state !== -1)
           });
           var L = K.length;
           var M = v(K).indexOf(this.image) - 1;
           return (L <= 1) ? null : K[(M < 0) ? L - 1 : M]
       },
       imageByURL: function (L, M) {
           var K = this.additionalImages.filter(function (N) {
               return ((N.zoom.src.has(L) || N.zoom.url.has(L)) && (N.small.src.has(M) || N.small.url.has(M)))
           }) || [];
           return K[0] || ((M && L && q.jTypeOf(M) === "string" && q.jTypeOf(L) === "string") ? new o(M, L) : null)
       },
       imageByOrigin: function (L) {
           var K = this.additionalImages.filter(function (M) {
               return (M.origin === L)
           }) || [];
           return K[0]
       },
       imageByIndex: function (K) {
           return this.additionalImages[K]
       }
   };
   e = {
       version: "v5.3.7 (Plus) DEMO",
       start: function (N, L) {
           var M = null;
           var K = [];
           q.$A((N ? [v(N)] : q.$A(document.byClass("MagicZoom")).concat(q.$A(document.byClass("MagicZoomPlus"))))).jEach(v(function (O) {
               if (v(O)) {
                   if (!n(O)) {
                       M = new z(O, L);
                       if (l && !M.option("autostart")) {
                           M.stop();
                           M = null
                       } else {
                           t.push(M);
                           K.push(M)
                       }
                   }
               }
           }).jBind(this));
           return N ? K[0] : K
       },
       stop: function (N) {
           var L, M, K;
           if (N) {
               (M = n(N)) && (M = t.splice(t.indexOf(M), 1)) && M[0].stop() && (delete M[0]);
               return
           }
           while (L = t.length) {
               M = t.splice(L - 1, 1);
               M[0].stop();
               delete M[0]
           }
       },
       refresh: function (K) {
           this.stop(K);
           return this.start(K)
       },
       update: function (P, O, N, L) {
           var M = n(P);
           var K;
           if (M) {
               K = q.jTypeOf(O) === "element" ? M.imageByOrigin(O) : M.imageByURL(O, N);
               if (K) {
                   M.update(K)
               }
           }
       },
       switchTo: function (N, M) {
           var L = n(N);
           var K;
           if (L) {
               switch (q.jTypeOf(M)) {
               case "element":
                   K = L.imageByOrigin(M);
                   break;
               case "number":
                   K = L.imageByIndex(M);
                   break;
               default:
               }
               if (K) {
                   L.update(K)
               }
           }
       },
       prev: function (L) {
           var K;
           (K = n(L)) && K.update(K.getPrev())
       },
       next: function (L) {
           var K;
           (K = n(L)) && K.update(K.getNext())
       },
       zoomIn: function (L) {
           var K;
           (K = n(L)) && K.activate()
       },
       zoomOut: function (L) {
           var K;
           (K = n(L)) && K.deactivate()
       },
       expand: function (L) {
           var K;
           (K = n(L)) && K.expand()
       },
       close: function (L) {
           var K;
           (K = n(L)) && K.close()
       },
       registerCallback: function (K, L) {
           if (!F[K]) {
               F[K] = []
           }
           if (q.jTypeOf(L) === "function") {
               F[K].push(L)
           }
       },
       running: function (K) {
           return !!n(K)
       }
   };
   v(document).jAddEvent("domready", function () {
       var L = window[j + "Options"] || {};
       y = y();
       A();
       r = q.$new("div", {
           "class": "magic-hidden-wrapper"
       }).jAppendTo(document.body);
       p = (q.browser.mobile && window.matchMedia && window.matchMedia("(max-device-width: 767px), (max-device-height: 767px)").matches);
       if (q.browser.mobile) {
           q.extend(b, D)
       }
       if (p && q.browser.platform === "ios") {
           G = q.$new("div").jSetCss({
               position: "fixed",
               top: 0,
               width: 0,
               height: "100vh"
           })
       }
       for (var K = 0; K < u.length; K++) {
           if (L[u[K]] && q.$F !== L[u[K]]) {
               e.registerCallback(u[K], L[u[K]])
           }
       }
       e.start();
       l = false
   });
   window.MagicZoomPlus = window.MagicZoomPlus || {};
   return e
})();