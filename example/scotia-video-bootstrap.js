/*!
 * bootstrap for jQuery Scotia Video Plugin
 */
(function($, window, document, undefined){
    
    'use strict';

    var _configPath = (window.location.host.indexOf('localhost') >= 0)? './bns_config.js': "/ca/common/js/bns_config.js";

    var _isMobileUserAgent = function(){
      return /Mobile Safari|Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    /***************************************/


    function DynaLoader (scriptItems, jQueryInst, useCaching) {
      this.scriptItems = scriptItems || [];
      this.jQuery = jQueryInst || null;
      
      if(this.jQuery){ // setup caching if needed
        this.jQuery.ajaxSetup({
          cache: useCaching || false
        });
      } 
      
      this.nextScriptItem = 0;
    }

    DynaLoader.prototype = {
      constructor: DynaLoader,
      getNextScript: function(){
        var tempItem = this.scriptItems[this.nextScriptItem];
        if (tempItem) {
          this.nextScriptItem++; // move to ths next item if the current item is valid
        } 
        return tempItem;
      },
      recurrsiveLoad: function(scriptItem){
        if (! scriptItem) return false;
        var tempUrl = (scriptItem.src)? scriptItem.src: scriptItem.href;
        var that = this;
        this.jQuery.getScript( tempUrl, function( data, textStatus, jqxhr ) {
          // console.log(tempUrl, jqxhr.status);
          if(jqxhr.status === 200) {
            that.recurrsiveLoad(that.getNextScript());
          }
        });
      },
      loadScripts: function(){
        
        if(! this.scriptItems.length) return false;
        this.recurrsiveLoad(this.getNextScript());

        return true;
      }
    };

    function dynamicLoadCSS(options) {

      var newElement = document.createElement( 'link' );
      newElement.rel = options.rel || 'stylesheet';
      newElement.href = options.href;
      if (options.id) newElement.id = options.id;
      if(newElement) $('head')[0].appendChild(newElement);

    };


    // turn off plugin for mobile
    if(_isMobileUserAgent()) return;

    $.getScript(_configPath, function(data, textStatus, jqxhr){ // dynamically load config file

          (function (Loader, _config) {
            
            var loadFiles = (function(){
                
                var $scotiaVideos = $('.scotia-video');
                var $careerVideos = $('.career-video');
                var $youTubeLinks = $('div.video');
                var $ccVideoPopup = $('.credit-card-video-popup');

                var loaderFilesCSS = [];
                var loaderFilesJS = [];

                if($scotiaVideos.length) {
                 loaderFilesCSS  = [{
                                        href: _config.css_path+'scotia_video_dialog.css'
                                    }];

                  loaderFilesJS  = [{
                                      src: 'https://www.youtube.com/iframe_api'
                                    },
                                    {
                                      src: _config.js_path+'scotia-video-util.js'
                                    },
                                    {
                                      src: _config.js_path+'scotia-video.js'
                                    }];

                } else if($careerVideos.length || $youTubeLinks.length || $ccVideoPopup.length) {
                  
                  // store these is a global variable
                  if(! window.videoLengthObj) {
                    window.videoLengthObj = {
                      "career-video": $careerVideos.length, // career vids
                      "video": $youTubeLinks.length, // youTube vids
                      "credit-card-video-popup": $ccVideoPopup.length // credit card vids
                    };
                  } 

                  loaderFilesCSS  = [{
                                        href: _config.css_path+'scotia_video_dialog.css'
                                    }];

                  loaderFilesJS = [{
                                      src: _config.js_path+'scotia-video-util.js'
                                    },
                                    {
                                      src: _config.js_path+'scotia-video-backcomp.js'
                                    }];
                } else {
                  loaderFiles = null;
                }

                return {
                  css: loaderFilesCSS,
                  js: loaderFilesJS
                };

            })(); 

            if(loadFiles) {
              for (var cssFile in loadFiles.css) {
                  dynamicLoadCSS(loadFiles.css[cssFile]);
              }
              
              var jsLoader = new Loader(loadFiles.js, $);
              jsLoader.loadScripts();

            }

        })(DynaLoader, videoConfig);

    });
    
})(jQuery, window, document);