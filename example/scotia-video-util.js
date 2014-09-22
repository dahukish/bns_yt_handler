/*!
 * Util functions for Scotia Video Stuff
 * TODO
 */
(function(window){
    
    /* stil in progess */
    function youTubeAPI (apiKey) {
      this.apiKey = apiKey || false;
      this.apiCache = [];
      this.videoCodes = [];
    }

    youTubeAPI.prototype = {
      constructor: youTubeAPI,
      addVideos: function(key) {
        if(key) {
          if(key.constructor === Array) {
            for (k in key) {
              this.videoCodes.push(key[k]);  
            }
          } else {
            this.videoCodes.push(key);
          }
        }
      }
    };
    /*******************/

    function ScotiaVideoTemplate (options) {}

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

        html += '<'+listObject.prntTag+' class="transcripts">'; 

        if(listObject.preTitle) html += listObject.preTitle;

        html += listObject.title+':';

        if(listObject.postTitle) html += listObject.postTitle;

        for (var listItem in listObject.transcripts) {
          var trans = listObject.transcripts[listItem];
          html += '<a href="#'+listObject.href+'" class="youtube" data-view="show-transcript-'+trans.langCode+'">'+trans.langFull+'</a>';

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
        html += '<div id="'+contObj.dialogID+'" class="ui-dialog ui-widget ui-widget-content ui-corner-all" tabindex="-1" role="dialog" aria-labelledby="ui-dialog-title-meet_henri_video" style="display: none; z-index: 10000; outline: 0px;">';
        html += '<div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">';
        if(contObj.dialogTitle) {
          html += '<span class="ui-dialog-title" id="ui-dialog-video-title">'+contObj.dialogTitle+'</span>';
        }
        html += '<a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button">'
        html += '<span class="ui-icon ui-icon-closethick">Close dialog</span>';
        html += '</a>';
        html += '</div>';
        // html += '<div id="'+contObj.dialogID+'" class="youtube-overlay ui-dialog-content ui-widget-content">';
        html += '<div class="youtube-overlay ui-dialog-content ui-widget-content">';
        html += '<img src="http://www.scotiabank.com/ca/common/icons/logo-scotiabank-lrg.png" alt="Scotiabank®">';
        
        html += '<div class="career-video">'
        var ifrm = contObj.iFrameObj;
        html += '<iframe class="youtube-player" type="text/html" tabindex="-1" width="'+ifrm.width+'" height="'+ifrm.height+'" src="'+ifrm.src+'" data-video-src="'+ifrm.src+'" frameborder="0"></iframe>';
        
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
        /*<div class="job-centre"> DO WE NEED JOB CENTRE? -SH
          <p><b>Featured Job:</b> <a href="#">Personal Banking Officer</a></p>
          <a href="http://jobs.scotiabank.com/careers/retail-banking-jobs" role="button" class="red-btn">Search Retail Banking Jobs</a> 
        </div>*/
        
        if(contObj.transcriptsList) {
          html += this.buildTranscripts({
            prntTag: 'div',
            preTitle: '<b>',
            title: 'View the transcript',
            postTitle: '</b><br>',
            href: contObj.dialogID,
            transcripts: contObj.transcriptsList
          }); 
        }
        
        html += '</div>'; // career-video
        
        if(contObj.transcriptsList) {
          html += '<div class="career-video-transcript">';
          html += this.buildTranscripts({
            prntTag: 'span',
            title: 'Video Transcript',
            href: contObj.dialogID,
            transcripts: contObj.transcriptsList
          }); 
          
          for (var trans in contObj.transcriptsList) {
            html += '<div class="copy '+contObj.transcriptsList[trans].langCode+'">';
            if(trans.body) html += trans.body;
            html += '</div>';
          }
          
          html += '<a href="#'+contObj.dialogID+'" class="red-btn youtube">';
          html += 'Watch<span class="hidden"> the '+(contObj.copy ? contObj.copy.title : '')+'</span> Video';
          html += '</a>';
          
          if(contObj.copy && contObj.addthis) {
          
          html += '<a class="addthis_button" href="http://www.addthis.com/bookmark.php?v=250&amp;pub=xa-4ae06b902327004d" addthis:url="https://www.youtube.com/watch?v='+contObj.dialogID+'" addthis:title="'+contObj.copy.title+'" addthis:description="'+contObj.copy.body+'">';
          html += '<img src="http://s7.addthis.com/static/btn/sm-share-en.gif" alt="Bookmark and Share" style="border: 0pt none;" height="16" width="83">';
          html += '</a>';
          
          }
          html += '</div>';
        }
      
        html += '</div>';
        html += '</div>';

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
    };

    function applyApiOverrides(domObj, options) {
      return domObj.testText = {
        text: "testing again"
      };
    }

    function buildVideoTile(domObj, templateHelper, context) {
      if(domObj["videoImage"]) {
        var modalObject = {
          title: domObj["videoImage"].alt,
          imgSrc: domObj["videoImage"].src
        };
        
      }

      if(domObj["videoImage"]) {
        var modalObject = {
          title: domObj["videoImage"].alt,
          imgSrc: domObj["videoImage"].src
        };
        
      }

    }

    // add some util functions to the global scope once if not defined
    if(typeof window.ScotiaVideoTemplate === 'undefined') {
          window.ScotiaVideoTemplate = ScotiaVideoTemplate;
          window.processVideoItem = processVideoItem;
          window.applyApiOverrides = applyApiOverrides;
          window.buildVideoTile = buildVideoTile;
    }

})(window);