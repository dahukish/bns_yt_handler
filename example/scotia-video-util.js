/*!
 * Util functions for Scotia Video Stuff
 * TODO
 */
(function(window, $){
    'use strict';
    
    var _config = window._BnsVideoConfig;

    /*---------------------------------------------*/
    function QuickCache(){}

    QuickCache.prototype = {
      constructor: QuickCache,
      _items: [],
      getItem: function(key, fallback){
        if(this._items && this._items[key]) return this._items[key];

        if(fallback && typeof fallback === 'function') {
          var retVal = fallback();
          this._items[key] = retVal;
          return retVal;
        }
        
        return false; 
      },
      removeItem: function(key) {
        if(this._items && this._items[key]) {
          delete this._items[key];
        }        
      }
    };

    /*---------------------------------------------*/

    function YouTubeVideoInfoCollection (videoItemsArray) {
      this.videoItems = videoItemsArray || [];
      this.cachedList = {};
      if(this.videoItems.length) this.buildList();
    }

    YouTubeVideoInfoCollection.prototype = {
      constructor: YouTubeVideoInfoCollection,
      buildList: function(){

        for (var item in this.videoItems) {
          var current = this.videoItems[item];
          this.cachedList[current.id] = {
            id: current.id,
            title: current.snippet.title,
            description: current.snippet.description,
            thumbnails: current.snippet.thumbnails,
            duration: this._formatTime(current.contentDetails.duration)
          };
        }
        return this;
      },
      getItem: function(itemKey) {
        return this.cachedList[itemKey];
      },
      getItemPart: function(itemKey, part, fallback) {
        return (this.cachedList[itemKey] && this.cachedList[itemKey][part])? this.cachedList[itemKey][part] : fallback;
      },
      getItems: function() { // alias for listItems
        return this.listItems();
      },
      listItems: function(itemFilter) {
        var tempItems = [];
        for (var item in this.cachedList) {
          var current = this.cachedList[item];
          var tempItem  = (itemFilter) ? current[itemFilter] : current;
          tempItems.push(tempItem);
        }
        return tempItems;
      },
      listDescriptions: function() {
        return this.listItems('description');
      },
      listTitles: function() {
        return this.listItems('title');
      },
      listThumbnails: function() {
        return this.listItems('thumbnails');
      },
      _padTime: function(numAsString, bypass){
        if(bypass) return numAsString; //skip this if needed - SH
        
        var num = parseInt(numAsString);
        return (num > 9)? num : ('0'+num); 
      },

      _formatTime: function(ytTimeString){
        var match = /^PT(\d{0,3})?M?(\d{0,2})S/.exec(ytTimeString);
        if(match[1] && match[2]) {
          return (this._padTime(match[1], true) + ':' + this._padTime(match[2])) + " min";
        } else if(match[1] && (match[2] === "")) {
          return this._padTime(match[1]) + " sec";
        }
        return false;
      }

    };
    /*---------------------------------------------*/

    /*****************************/
    function YouTubeAPI (apiKey) { 
      this.apiKey = apiKey || false;
      this.apiCache = null;
      this.videoKeys = [];
    }

    YouTubeAPI.prototype = {
      constructor: YouTubeAPI,
      addVideoKey: function(videoKey) {
        if(videoKey) {
           this.videoKeys.push(videoKey);
          }
      },
      addVideoKeys: function(videoList) {
        for (var videoIndex = 0; videoIndex < videoList.length; videoIndex++) {
          this.addVideoKey(videoList[videoIndex]);
        }
        return this;
      },
      getVideoKeys: function() {
        return this.videoKeys;
      },
      normalizeVideos: function() {
        var vidCodes = this.getVideoKeys();
        if(vidCodes.length){
          return vidCodes.join(',');
        }
        return;
      },
      fetchVideoInfo: function(callback) {
        
        if(this.apiCache !== null) return this.apiCache;

        // TODO remove these dependancies to a config.json file or something -SH
        var that = this;
        $.ajax({
          url: 'https://www.googleapis.com/youtube/v3/videos',
          data: {
            id: this.normalizeVideos(),
            key: this.apiKey,
            part: 'contentDetails,snippet'
          },
          success: function(apiJSON, textStatus, jqXHR) {
            if(jqXHR.status === 200) {
              that.apiCache = apiJSON;
              if (typeof callback === 'function') callback();
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
          },
          dataType: 'jsonp'
        });
      },
      getVideoItems: function() {
        return (this.apiCache) ? this.apiCache.items : false;
      },
      flushVideoCache: function() {
        this.apiCache = [];
      }
    };
    /***********************************/
    function youTubeVideoListFactory(videoKeys, callback) {
      
      if(!videoKeys || (!callback && typeof callback !== 'function')) return;

        var ytApi = new YouTubeAPI('AIzaSyC1voi8E7DWtNEGZMf59MD13in_ueQlsLQ'); // put API Key into config file -SH
        
        ytApi
        .addVideoKeys(videoKeys)
        .fetchVideoInfo(function(){
          callback(new YouTubeVideoInfoCollection(ytApi.getVideoItems()));
        });
    }
    /***********************************/

    function ScotiaVideoTemplate () {}

    ScotiaVideoTemplate.prototype = {
      constructor: ScotiaVideoTemplate,
      buildModalLink: function(modalObject) {
        
        if (! modalObject) return;

        var html = "";
        html += '<a href="#scotia_video_modal" class="open-modal" title="'+modalObject.title+'">';
        html += '<span class="play-icon" /></span>';
        html += '<img class="thumb" src="'+modalObject.imgSrc+'" alt="'+modalObject.title+'"/>';
        html += '</a> ';
        return html;
      },
      buildSmallTitles: function(titleObject) {
        
        if (! titleObject) return;

        var html = "";
        if (titleObject.main) html += '<p class="video main-title">'+titleObject.main+'</p>';
        if (titleObject.sub) html += '<p class="video sub-title">'+titleObject.sub+'</p>';
        return html;
      },
      buildTranscripts: function(listObject) { 
        
        if (! listObject) return;
        var html = "";
        var classAdditions = (listObject.classAdd)? listObject.classAdd.join(' ') : "";

        html += '<'+listObject.prntTag+' class="transcripts '+classAdditions+'">'; 

        if(listObject.preTitle) html += listObject.preTitle;

        html += listObject.title+':';

        if(listObject.postTitle) html += listObject.postTitle;
        var tabIndex = 1;
        for (var listItem in listObject.transcripts) {
          var trans = listObject.transcripts[listItem];
          
          html += '<a href="#'+listObject.dialogID+'-trans-box-'+trans.langCode+'" class="youtube'+(tabIndex === 1 ? ' first' : '')+(tabIndex === listObject.transcripts.length ? ' last' : '')+'" data-parent="'+listObject.dialogID+'" data-view="show-transcript-'+trans.langCode+'">'+trans.langFull+'</a>';
          tabIndex++;
        }
        html += '</'+listObject.prntTag+'>';

        return html;
      },
      buildHiddenHTML: function(hiddenObject) {
        var html = "";
        html += '<ul class="hidden-data">';
        html += '<li class="" ></li>';
        html += '</ul>';
        return html;
      },
      buildModalOverlay: function(htmlContent){
        var html ="";
        
        html += '<div id="main_video_overlay" class="scotia-video-overlay" tabindex="-1" >';
        if(htmlContent) html += htmlContent;
        html += '</div>';

        return html;  
      },
      buildModalDialog: function(contObj){
        var html = "";
        html += '<div id="'+contObj.dialogID+'" class="youtube-overlay">';
        // html += '<div class="youtube-overlay ui-dialog-content ui-widget-content">';
        html += '<img src="http://www.scotiabank.com/ca/common/icons/logo-scotiabank-lrg.png" alt="Scotiabank®">';
        var ifrm = contObj.iFrameObj;
        var videoContentHeight = ifrm.height+46;
        html += '<div class="career-video" aria-hidden="false" style="height: '+videoContentHeight+'px;">';
        html += '<iframe id="player_'+contObj.dialogID+'" class="youtube-player" type="text/html" tabindex="-1" width="'+ifrm.width+'" height="'+ifrm.height+'" src="'+ifrm.src+'" data-video-src="'+ifrm.src+'" frameborder="0"></iframe>';
        if(contObj.copy) {
          html += '<div class="copy">';
          html += '<h2 class="frutiger">'+contObj.copy.title+'</h2>';
          html += '<p>';
          html += contObj.copy.body;
          html += '</p>';
          
          if(contObj.duration) html += '<span class="duration">'+contObj.duration+'</span>';
          
          if(contObj.addThis) {
          html += '<a class="addthis_button" href="http://www.addthis.com/bookmark.php?v=250&amp;pub=xa-4ae06b902327004d" addthis:url="https://www.youtube.com/watch?v='+contObj.videoCode+'" addthis:title="'+contObj.copy.title+'" addthis:description="'+contObj.copy.body+'">';
          html += '<img src="http://s7.addthis.com/static/btn/sm-share-en.gif" alt="Bookmark and Share" style="border: 0pt none;" height="16" width="83">';
          html += '</a>';
          }    
              
          html += '</div>'; // copy
        }
        html += '<div class="player-controls">';
        html += '<a href="#" id="btn_play_pause_'+contObj.dialogID+'" role="button" class="video-button visual first play" aria-pressed="false" title="play/pause video"><img src="'+_config.img_path+'button-play.png" alt="Play"/></a>';
        html += '<a href="#" id="btn_seekReverse_'+contObj.dialogID+'" role="button" class="video-button visual reverse" title="reverse video"><img src="'+_config.img_path+'button-rewind.png" alt="Reverse"/></a>';
        html += '<a href="#" id="btn_seekForward_'+contObj.dialogID+'" role="button" class="video-button visual forward" title="forward video"><img src="'+_config.img_path+'button-forward.png" alt="Fast Forward"/></a>';
        html += '<a href="#" id="btn_volMute_'+contObj.dialogID+'" role="button" class="video-button aural volMute" aria-pressed="false" title="mute/unmute"><img src="'+_config.img_path+'button-mute.png" alt="Mute Volume"/></a>';
        html += '<a href="#" id="btn_volDown_'+contObj.dialogID+'" role="button" class="video-button aural volDown" title="volume down"><img src="'+_config.img_path+'button-volume-minus.png" alt="Volume Up"/></a>';
        html += '<a href="#" id="btn_volUp_'+contObj.dialogID+'" role="button" class="video-button aural volUp" title="volume up"><img src="'+_config.img_path+'button-volume-plus.png" alt="Volume Down"/></a>';
        html += '<div class="control fieldset"><label for="videoQuality_'+contObj.dialogID+'" class="video-control label quality">Video Quality</label>';
        html += '<select name="videoQuality_'+contObj.dialogID+'" class="video-control select quality" id="videoQuality_'+contObj.dialogID+'">';
        html += '<option value="default" selected="selected">default</option>';
        html += '</select></div>';
        html += '<div class="control fieldset"><label for="playbackRate_'+contObj.dialogID+'" class="video-control label playbackrate">Playback Rate</label>';
        html += '<select name="playbackRate_'+contObj.dialogID+'" class="video-control select playbackrate" id="playbackRate_'+contObj.dialogID+'">';
        html += '</select></div>';
        html += '<a href="https://www.youtube.com/watch?v='+contObj.dialogID+'" class="youtube watch">Watch on: </a>'; 
        
        //transcript links
        if(contObj.transcriptsList) {
          html += this.buildTranscripts({
            prntTag: 'div',
            preTitle: '<b>',
            title: 'View the transcript',
            postTitle: '</b><br>',
            dialogID: contObj.dialogID,
            transcripts: contObj.transcriptsList
          }); 
        }

        html += '</div>'; // player-controls

        
        
        html += '<div class="video-control tool-box" style="width: '+ifrm.width+'px;"><div id="video_scrubber_'+contObj.dialogID+'" class="video-control scrubber"><div class="buffer-bar"></div></div></div>';

        html += '</div>'; // career-video
        
        if(contObj.transcriptsList) {
          html += '<div class="career-video-transcript" aria-hidden="true">';
         
          for (var trans in contObj.transcriptsList) {
            html += '<div class="copy '+contObj.transcriptsList[trans].langCode+'">';
            if(trans.body) html += trans.body;
            html += '</div>';
          }
          
          html += '<a href="#'+contObj.dialogID+'" class="red-btn youtube" data-parent="'+contObj.dialogID+'" tabindex="'+(contObj.transcriptsList.length+1)+'">';
          html += 'Watch<span class="hidden"> the '+(contObj.copy ? contObj.copy.title : '')+'</span> Video';
          html += '</a>';
          
          if(contObj.copy && contObj.addthis) {
          
          html += '<a class="addthis_button" href="http://www.addthis.com/bookmark.php?v=250&amp;pub=xa-4ae06b902327004d" addthis:url="https://www.youtube.com/watch?v='+contObj.dialogID+'" addthis:title="'+contObj.copy.title+'" addthis:description="'+contObj.copy.body+'">';
          html += '<img src="http://s7.addthis.com/static/btn/sm-share-en.gif" alt="Bookmark and Share" style="border: 0pt none;" height="16" width="83">';
          html += '</a>';
          
          }
          html += '</div>';
        }
      
        // html += '</div>'; // youtube-overlay
        html += '</div>'; // ui-dialog

        return html;
      }
    };

    function processVideoItem(videoItem) {
        
        $(videoItem).removeClass('scotia-video').addClass('scotia-video-tile');

        var eleChildren  = videoItem.children();
        var domObj = {};
        
        if (eleChildren.length) {

          // sort the 
          for (var eleChild = (eleChildren.length - 1); eleChild >= 0; eleChild--) {
            
            var eleClass = $(eleChildren[eleChild]).attr('class');

            switch (eleClass) {
              case "video":
                var match = /www\.youtube\.com\/watch\?v=(\w+)/i.exec($(eleChildren[eleChild]).attr('href'));
                domObj["video"] = {
                  videoId: match[1],
                  videoUrl: match['input'] 
                };
              break;
              
              case "video-image":
                domObj["videoImage"] = {
                  src: $(eleChildren[eleChild]).attr('src'),
                  alt: $(eleChildren[eleChild]).attr('alt')
                };
              break;
              
              case "tile-title":
              case "main-title":
              case "sub-title":
                if (! domObj["titleObject"]) {
                  domObj["titleObject"] = {};
                }
                domObj["titleObject"][eleClass] = {
                  text: $(eleChildren[eleChild]).text()
                };
              break;
              
              case "transcript":
                if (! domObj["listObjects"]) {
                  domObj["listObjects"] = [];
                }
                domObj["listObjects"].push({
                  text: $(eleChildren[eleChild]).text(),
                  href: $(eleChildren[eleChild]).attr('href')
                });
              break;
              
              case "intro":
                domObj["intro"] = {
                  text: $(eleChildren[eleChild]).text()
                };
              break;

              case "featured-page":
              case "featured-link":
                if (! domObj["featuredLinks"]) {
                  domObj["featuredLinks"] = [];
                }
                domObj["featuredLinks"].push({
                    type: eleClass,
                    text: $(eleChildren[eleChild]).html(),
                    href: $(eleChildren[eleChild]).attr('href')
                });             
              break;
            }

            // remove it from the dom tree
            $(eleChildren[eleChild]).remove();

          }
          return domObj;
        }

        return false;
    }

    // add some util functions to the global scope once if not defined
    if(typeof window.ScotiaVideoTemplate === 'undefined') {
          window.youTubeVideoListFactory = youTubeVideoListFactory;
          // window.YouTubeAPI = YouTubeAPI;
          // window.YouTubeVideoInfoCollection = YouTubeVideoInfoCollection;
          window.ScotiaVideoTemplate = ScotiaVideoTemplate;
          window.processVideoItem = processVideoItem;
          window.QuickCache = QuickCache;
      }

})(window, jQuery);