'use strict';

/*!
 * bootstrap for jQuery Scotia Video Plugin
 */
(function($, window, document, undefined){
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
          console.log(tempUrl, jqxhr.status);
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

    (function (Loader) {
        
        var loadFiles = (function(){
            
            var $scotiaVideos = $('.scotia-video');
            var $careerVideos = $('.career-video');
            var $youTubeLinks = $('div.video');
            var $ccVideoPopup = $('.credit-card-video-popup');

            var loaderFiles = {};

            if($scotiaVideos.length) {
              loaderFiles.css  = [{
                                    href: '../core/css/player-core.css'
                                  },
                                  {
                                    href: '../custom/css/player-theme.css'
                                  }];

              loaderFiles.js  = [{
                                  src: '../core/javascript/swfobject/swfobject.js' 
                                },
                                {
                                  src: '../core/javascript/jquery.player.min.js'
                                },
                                {
                                  src: 'scotia-video-util.js'
                                },
                                {
                                  src: 'scotia-video.js'
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

              loaderFiles.css = {};
              loaderFiles.js = [{
                                  src: 'scotia-video-util.js'
                                },
                                {
                                  src: 'scotia-video-backcomp.js'
                                }];
            } else {
              loaderFiles = null;
            }

            return loaderFiles;

        })(); 

        if(loadFiles) {
          for (var cssFile in loadFiles.css) {
              dynamicLoadCSS(loadFiles.css[cssFile]);
          }
          
          var jsLoader = new Loader(loadFiles.js, $);
          jsLoader.loadScripts();

        }

    })(DynaLoader);


})(jQuery, window, document);