/* 
 * JS deployed in C2C host application's sites - SOL, SiTcom, CCV, OAM, .COM etc.
 * It is responsible to asynchronously load C2C plugin libraries from C2C site.
 * Depencency - jquery 1.5 and above
 *
 * PreProduction and Production version of loader is different from DEV/IST/UAT version
 * due to multiple data centres with different domain names.
 * 
 * Author: Richard Zhang
 * 
 */
(function(window, undefined) {

	/**
	 * if any name clission, hold the previous BnsPostMessage
	*/
	(function() {
		if (window.jQuery === undefined) {
			throw "jQuery not included!";
		}
		if (jQuery.prototype.jquery === undefined) {
			throw "jQuery version not found!";
		}
		usedVer = jQuery.prototype.jquery.split(".");
		if (parseInt(usedVer[0]) < 1 || parseInt(usedVer[1]) < 5) {
			throw "Minimum jQuery version must be 1.5";
		}
		if (BnsC2CLoader !== undefined) {
			window._BnsC2CLoader = BnsC2CLoader;
		}
		if (window.console === undefined) {
			window.console = { 
				log: function(){}, 
				debug: function(){},
				info: function(){},
				warn: function(){},
				error: function(){}
			};
		}
	})();
	
	var BnsC2CLoader = {
	
		version: '1.0',
		/** 
		 * Specific C2C deployment root URL - DEV, UAT, PreProd, Production
		*/
		c2cSiteRootURL: 'https://www.livehelp.scotiabank.com/',
		contextRoot: 'c2cui',
		qualifierURI: '/rs/page/getQualifiers/',
		
		/**
		 * c2c-loader.js can behave as a configuration since it is deployed as a static file in IHS server.
		 * c2cEnabled is a flag to turn off the loader to start CSS/JS loading and plugin processing.
		*/
		c2cEnabled: true,
		c2cPluginCSS: 'css/plugin/c2c-plugin.css?v=1.0',
		c2cDCIndJS: 'dcjs/c2c-dcdef.js?v=1/0',
		c2cJQueryCookieJS: 'js/base/jquery.cookie.js?v=1.3.1',
		c2cJSList: [ 
			'js/base/c2c-cookie.js?v=1.0',
			'js/base/c2c-pstmsg.js?v=1.0', 
			'js/plugin/c2c-plugin.js?v=1.0'
		],
		
		languages: {
			en: true,
			fr: false
		},
		
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		
		/**
		 * defualt here. should be override by hosting page which is eligible for UI/SI/AA initiated chat
		*/
		hostInfo: {
			app: null,
			page: null,
			language: 'en'
		},
		
		/** use OS info to exclude the most popular mobile devices */
		ineligibleUAs: {
			iOS: /(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i,
			Android: /(android)[\/\s-]?([\w\.]+)*/i,
			BlackBerry: /(blackberry)\w*\/?([\w\.]+)*/i,
			winRT: /(windows)\snt\s6\.2;\s(arm)/i
		},
		
		getC2CQualificationURL: function() {
			return BnsC2CLoader.c2cSiteRootURL + BnsC2CLoader.contextRoot + BnsC2CLoader.qualifierURI;
		},
		
		insertHeadNode: function(headElem){
			firstScript = null;
			scriptElem=document.getElementsByTagName('script');
			for(i=scriptElem.length-1; i>=0; i--) {
				if(scriptElem[i].src && /.+c2c-loader\.js.+$/.test(scriptElem[i].src)) {
					firstScript = scriptElem[i];
					break;
				}
			}
			if(firstScript != null) {
				firstScript.parentNode.insertBefore(headElem, firstScript);
			}
		},
		
		createCSSRule: function(cssRule){
			try {
				styleElem = document.createElement("style");
				styleElem.type="text/css";
				if (/WebKit|MSIE/i.test(navigator.userAgent)) {
					if (styleElem.styleSheet) {
						styleElem.styleSheet.cssText=cssRule;
					} else {
						styleElem.innerText=cssRule;
					}
				} else {
					styleElem.innerHTML=cssRule;
				}
				BnsC2CLoader.insertHeadNode(styleElem);
			}catch(err) {
			}
		},
		
		/**
		 * CSS classes must be around even in the case of C2C site is unavailable
		*/
		createCSS: function() {
			cssRule = 'div.c2c_background_cover {background-image: url(';
			cssRule += BnsC2CLoader.c2cSiteRootURL;
			cssRule += 'images/Transparent_background.png)}';
			BnsC2CLoader.createCSSRule(cssRule);
		},
		
		asyncLoadCSS: function() {
			head = document.head || jQuery("head")[0] || document.documentElement;
			cssLnk = document.createElement("link");
			cssLnk.href = BnsC2CLoader.c2cSiteRootURL + BnsC2CLoader.c2cPluginCSS;
			cssLnk.rel = "stylesheet";
			cssLnk.type = "text/css";
			head.appendChild(cssLnk);
		},
		
		asyncLoadScript: function(url, callback) {
			head = document.head || jQuery("head")[0] || document.documentElement;
			script = document.createElement("script");

			script.async = true;
			script.src = url;
			//Attach handlers for all browsers
			script.onload = script.onreadystatechange = function() {
				//if (!script.readyState || /loaded|complete/.test( script.readyState )) {
				if (!script.readyState || /loaded|complete/.test( script.readyState )) {
					// Handle memory leak in IE
					script.onload = script.onreadystatechange = null;
					script.onerror = null;
					// Dereference the script
					script = null;

					callback();
				}
			};
			script.onerror = function() {
				script.onerror = null;
				// Remove the script
				if ( script.parentNode ) {
					script.parentNode.removeChild( script );
					if (console && console.log) {
						console.log("Async script loading error: " + url);
					}
				}
			};
			head.appendChild(script);
		},
		
		/*
		 * call setJsList before use.
		*/
		jsDownloadEnum: {
			enumIndex: -1,
			//array of js names
			jsList: null,
			
			next: function() {
				if (! jsList || jsList == null || ++enumIndex >= jsList.length) {
					enumIndex = -1;
					return null;
				}
				return jsList[enumIndex];
			},
			
			setJsList: function(list) {
				enumIndex = -1;
				jsList = list;
			},
			
			resetEnum: function() {
				enumIndex = -1;
			}
		},
		
		loadJavaScript: function() {
			if (! BnsC2CLoader.c2cEnabled) {
				return;
			}
			nextJs = BnsC2CLoader.jsDownloadEnum.next();
			if (nextJs != null) {
				BnsC2CLoader.asyncLoadScript(BnsC2CLoader.c2cSiteRootURL + nextJs, BnsC2CLoader.loadJavaScript);
			}
		},
		
		isC2CEligibleOS: function() {
			for (regProp in BnsC2CLoader.ineligibleUAs) {
				if (BnsC2CLoader.ineligibleUAs[regProp].test(navigator.userAgent)) {
					if (console && console.log) {
						console.log('Not C2C eligible: ' + regProp);
					}
					return false;
				}
			}
			return true;
		},
		
		isIE7AndUnder: function() {
			if (document.documentMode !== undefined && document.documentMode < 8) {
				if (console && console.log) {
					console.log('Invalid IE document mode: ' + document.documentMode);
				}
				return true;
			}
			return false;
		},
		
		isBrowserC2CEligible: function() {
			if (window.postMessage === undefined || BnsC2CLoader.isIE7AndUnder() || ! BnsC2CLoader.isC2CEligibleOS()) {
				//alert("HTML5 postMessage not supported by " + window.navigator.userAgent);
				BnsC2CLoader.c2cEnabled = false;
				return false;
			}
			/**
			 * Disable on French hosting page
			*/
			if (BnsC2CLoader.hostInfo 
					&& BnsC2CLoader.hostInfo.language 
					&& BnsC2CLoader.languages[BnsC2CLoader.hostInfo.language]
					&& BnsC2CLoader.languages[BnsC2CLoader.hostInfo.language] != true) {
				//alert("Not supported language");
				return false;
			}
			/*
			 * TODO: disable on iPad, mobile devices
			*/
			return true;
		},
		
		loadCSSAndJsOnDCLoaded: function() {
			BnsC2CLoader.asyncLoadCSS();
			if (! jQuery.cookie) {
				BnsC2CLoader.c2cJSList.unshift(BnsC2CLoader.c2cJQueryCookieJS);
			}
			BnsC2CLoader.jsDownloadEnum.setJsList(BnsC2CLoader.c2cJSList);
			BnsC2CLoader.loadJavaScript();
		},
			
		hookDocReady: function() {
			jQuery(document).ready(function() {
				if (! BnsC2CLoader.isBrowserC2CEligible()) {
					return;
				}
				/*
				BnsC2CLoader.asyncLoadCSS();
				if (! jQuery.cookie) {
					BnsC2CLoader.c2cJSList.unshift(BnsC2CLoader.c2cJQueryCookieJS);
				}
				BnsC2CLoader.jsDownloadEnum.setJsList(BnsC2CLoader.c2cJSList);
				BnsC2CLoader.loadJavaScript();
				*/
				dcIndJsURL = BnsC2CLoader.c2cSiteRootURL + BnsC2CLoader.c2cDCIndJS;
				BnsC2CLoader.asyncLoadScript(dcIndJsURL, BnsC2CLoader.loadCSSAndJsOnDCLoaded);
			});
		}
	};
      
	(function() {
		window.BnsC2CLoader = BnsC2CLoader;
		if (BnsC2CLoader.c2cEnabled) {
			BnsC2CLoader.hookDocReady();
		}
	})();

})(window);
