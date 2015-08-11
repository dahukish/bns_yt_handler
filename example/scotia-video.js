/*!
 * jQuery ScotiaVideo Plugin
 * TODO
 */
// IE fix for origin
if (!window.location.origin) {
       window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

(function($, window, document, _config){
    'use strict';

    // setup an instance of QuickCache for use withing this scope -SH
    var _quickCache = new QuickCache();
    var _playerInstances = new QuickCache();
    var _youTubeIframeRdy = false;
    var _eventLoopInterval = null, _playerSliderInterval = null;

    
    function parseVideoHrefSrc(hrefUrl) {
      var index = hrefUrl.indexOf('watch?v=');
      var indexShift = 8;
      if(index > -1) {
        return hrefUrl.substring(index + indexShift);
      }
      return false;
    }

    function parseScotiaVideoKeys(jqObj) {
      var tempKeyList = [];
      
      jqObj.each(function(index, ele) {
        var tempCode = parseVideoHrefSrc($(ele).attr('href'));
        tempCode && tempKeyList.push(tempCode);
      });
      
      return tempKeyList;
    }

    function classHardReset($jqObj){
      $jqObj.removeClass('show-video');
      $jqObj.removeClass('show-transcript-en');
      $jqObj.removeClass('show-transcript-fr');
      $jqObj.removeClass('show-transcript-es');
      $jqObj.removeClass('show-transcript-cn');
    }

    function showCurrentDialogSection($jqObj, $prntObj, callback) {
      var viewDataObj = (function(viewData){
        var match = _getTranLangCode(viewData);
        if (match) {
          return {
            selector: '.youtube-overlay',
            classAttr: match[0]
          };
        } 

        return {
          selector: '.youtube-overlay',
          classAttr: 'show-video'
        };
      })(($jqObj && $jqObj.data('view')) || null);

      //nuke all the styles
      classHardReset($prntObj);
      $prntObj.addClass(viewDataObj.classAttr);
      
      //swap aria-hidden attr -SH
      if(viewDataObj.classAttr === 'show-video') {
        $prntObj.find('.career-video-transcript').attr('aria-hidden', true);
        $prntObj.find('.career-video').attr('aria-hidden', false);
      } else {
        $prntObj.find('.career-video').attr('aria-hidden', true);
        $prntObj.find('.career-video-transcript').attr('aria-hidden', false);
      }

      if(callback && (typeof callback === 'function')) callback();
    }

    function openDialogOverlay($htmlOverlay) {
      $('body').append($htmlOverlay)
      .find('#main_video_overlay')
      .show();
    }

    function closeDialogOverlay() {
        $('#main_video_overlay').remove();
    }

    function _getDialogAsParent($jqObj) {
      return $jqObj
              .parents('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable')
              .find('.youtube-overlay');
    }

    function dialogObjFactory(onOpen, onClose, dialogOpts, onCleanUp) {
      
      var opts = dialogOpts || {};
      return {
                  resizable: opts.resizable || false,
                  modal: opts.modal || true,
                  width: opts.width || 980,
                  dialogClass: 'scotia-video-dialog',
                  open: (onOpen && (typeof onOpen === 'function')? onOpen : function(){}),
                  close: (onClose && (typeof onClose === 'function')? onClose : function(){}),
                  beforeClose: (onCleanUp && (typeof onCleanUp === 'function')? onCleanUp : function(){})
            };
    }

    function initClick(jqObj, onClick, dialogObj) {
      jqObj.live('click', (onClick && (typeof onClick === 'function')? onClick : function(){}) );
    }

    function loadTranscripts(transPaths, callback, fallback) {
      
      var deferreds = [];

      for (var i = transPaths.length - 1; i >= 0; i--) {
        deferreds.push($.get(transPaths[i].href));
      };

      $.when.apply($, deferreds)
      .done(callback)
      .fail(fallback);

    }

    function applyTranscriptData(dialogObj, linkDataObj, videoCode) {
      
      var transcripts = linkDataObj.transcripts.split(',');
      var transcriptsList = [];

      for (var transCode in transcripts) {
          var trans = transcripts[transCode];
          if(('transcript-'+trans) in linkDataObj) {
            // TODO: Allow overides from data obj -SH
          } else {
            
            var transObj = {};
            transObj.langCode = trans;
            var langFull = '';
            
            // set some default language codes
            switch(trans){
              case 'en':
                langFull = 'English';
              break;
              case 'fr':
                langFull = 'French';
              break;
              case 'es':
                langFull = 'Spanish';
              break;
            }

            transObj.langFull = langFull;
            transObj.href = _config.transcript_path+'/'+videoCode+'_'+trans+_config.transcript_ext;;
            transcriptsList.push(transObj);

          }
      }

      if(transcriptsList.length) {
        dialogObj.transcriptsList = transcriptsList;
      }
        
    }

    function _getTransViewState($jqDialog){
      var $ytOverlay = $jqDialog;
      var classAttr = $ytOverlay.attr('class');
      var ytIndex = classAttr.indexOf('show-');
      


      if( ytIndex >= 0) {
        return classAttr.substring(ytIndex, classAttr.length);
      }

      return false;
    }

    function _focusTranscripts($videoDialog, classAdd, markupOverride) {
      var classAdditions = (classAdd && classAdd.length)? ('.'+classAdd.join(' ')) : "";
      $videoDialog.find('.transcripts'+classAdditions+' '+(markupOverride ? markupOverride : 'a.youtube:eq(0)')).focus();
    }

    function _parseTrans(item) {
      return item[0];
    }

    function _parseTransClass(item) {
      var itemClass = $(item).attr('class');
      return itemClass.replace(' ', '.');
    }

    function _parseTransHtml(item) {
      return $(item).html();
    }

    function _parseLangCode(htmlString) {
      var startAt = 17;
      return htmlString[0].substr(startAt, 2);
    }

    function _getTranLangCode(string) {
      return /show-transcript-(\w{2})/i.exec(string);
    }

    function applyTransHtml(item, $parentObj, beforeHtml, afterHtml) {
      var transItem = _parseTrans(item);
      var bHtml = beforeHtml ? beforeHtml : '';
      var aHtml = afterHtml ? afterHtml : '';
      var html = bHtml+_parseTransHtml(transItem)+aHtml;
      $parentObj.find('.career-video-transcript .'+_parseTransClass(transItem)).html(html);
    }

    function _isDialogVideoHidden($parentObj) {
      return $parentObj.find('.career-video').attr('aria-hidden');
    }

    function buildDialog(videoCode, linkDataObj, templateHelper, contentModelObj) { // TODO: This sucks and needs to be refactored -SH
      var dialogObj = {
                dialogTitle: "",
                dialogID: videoCode,
                iFrameObj: {
                  width: 640,
                  height: 385,
                  src: '//www.youtube.com/embed/'+videoCode+'?enablejsapi=1&controls=0&cc_load_policy=1&origin='+window.location.origin
                },
                copy: {
                      title: contentModelObj.getItemPart(videoCode, 'title', ''),
                      body: contentModelObj.getItemPart(videoCode, 'description', '')
                },
                duration: contentModelObj.getItemPart(videoCode, 'duration', '')
              };
      return _quickCache.getItem(videoCode, function(){
            
            // see if we have any transcript data
            if ('transcripts' in linkDataObj) {
              applyTranscriptData(dialogObj, linkDataObj, videoCode);
            }
            
            var $videoDialog = $(templateHelper.buildModalDialog(dialogObj))
            .attr('id', videoCode)
            .css('display', 'none');

            // $('body').append($videoDialog);

            //TODO: possibly append this item to something else at this point. Currently no need. -SH
            
            if(dialogObj.transcriptsList) {
              loadTranscripts(dialogObj.transcriptsList, 
              function() {
                
                var langTabindex = 1;
                for (var i = arguments.length - 1; i >= 0; i--) {
                  var langCode = _parseLangCode(arguments[i]);
                  var beforeHtml = '<a id="'+dialogObj.dialogID+'-trans-box-'+langCode+'" tabindex="'+langTabindex+'" class="transcript-anchor-wrap">';
                  var afterHtml = '</a>';
                  applyTransHtml(arguments[i], $videoDialog, beforeHtml, afterHtml);
                  langTabindex++;
                };
                
              }, 
              function(err) {
                // console.log('error: ',err);
              }); 

            }
            return $videoDialog;  
          });
    }

    
    function _ytIframeApiLoader(){ //TODO Break this out into a generic dirver loader call -SH
        var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = function() {
          _youTubeIframeRdy = true;
      }

    }

    function _getAvialableRates(videoPlayerObj){
      // return videoPlayerObj.B.availablePlaybackRates;
      return videoPlayerObj.getAvailablePlaybackRates();
    }

    function _getAvialableQuality(videoPlayerObj){
      return videoPlayerObj.getAvailableQualityLevels();
      // return videoPlayerObj.B.availableQualityLevels;
    }


    function _ytIframeApiFactory(options, $dialog){ //TODO Break this out into a generic dirver loader call -SH
      var player;  
      // The API will call this function when the video player is ready.
      var onPlayerReady = function(event) {
        var videoPlayer = event.target;
        var maxDuration = videoPlayer.getDuration();
        var minDuration = 0;
        var playbackRates = _getAvialableRates(videoPlayer);
        var qualityValues = _getAvialableQuality(videoPlayer);
        
        // TODO: Refactor the snot of out this -SH
        $('#btn_play_pause_'+options.videoId).click(function(){
          var aria_pressed = $(this).attr('aria-pressed');
          var $img = $(this).find('img');
          var src = $img.attr('src');
          var srcParsed = src.split('/');
          if(aria_pressed && (aria_pressed === 'true')){
            $(this).attr('aria-pressed',false);
            $(this).removeClass('pause');
            $(this).addClass('play');    
            if(srcParsed) {
              srcParsed.pop();
              srcParsed.push('button-play.png');
              $img.attr('src', srcParsed.join('/'));
              $img.attr('alt', 'Play');
            }
            videoPlayer.pauseVideo();
          } else {
            $(this).attr('aria-pressed', true);
            $(this).removeClass('play');
            $(this).addClass('pause');
            if(srcParsed) {
              srcParsed.pop();
              srcParsed.push('button-pause.png');
              $img.attr('src', srcParsed.join('/'));
              $img.attr('alt', 'Pause');
            }    
            videoPlayer.playVideo();
          }
          return false;
        });
        // $('#btn_stop_'+options.videoId).click(function(){
        //   videoPlayer.stopVideo();
        //   return false;
        // });
        // $('#btn_pause_'+options.videoId).click(function(){
        //   videoPlayer.pauseVideo();
        //   return false;
        // });
        $('#btn_volUp_'+options.videoId).click(function(){
          var maxVolume = 100;
          var currentVolume = videoPlayer.getVolume();
          currentVolume += 10;
          if(currentVolume >= maxVolume) currentVolume = maxVolume;
          videoPlayer.setVolume(currentVolume);
          return false;
        });
        $('#btn_volDown_'+options.videoId).click(function(){
          var minVolume = 0;
          var currentVolume = videoPlayer.getVolume();
          currentVolume -= 10;
          if(currentVolume <= minVolume) currentVolume = minVolume;
          videoPlayer.setVolume(currentVolume);
          return false;
        });
        $('#btn_volMute_'+options.videoId).click(function(){
          if(videoPlayer.isMuted()){
            videoPlayer.unMute();
            $(this).removeClass('muted');
          }
          else{
            videoPlayer.mute();
            $(this).addClass('muted');
          }
          return false;
        });

        $('#btn_seekForward_'+options.videoId).click(function(){
          var currentSeek = videoPlayer.getCurrentTime();
          var incrementLength = (maxDuration*0.10);  
          currentSeek += incrementLength;
          if(currentSeek >= maxDuration) currentSeek = maxDuration;
          videoPlayer.seekTo(currentSeek, true);
          return false;
        });

        $('#btn_seekReverse_'+options.videoId).click(function(){
          var currentSeek = videoPlayer.getCurrentTime();
          var decrementLength = (maxDuration*0.10); 
          currentSeek -= decrementLength;
          if(currentSeek <= minDuration) currentSeek = minDuration;
          videoPlayer.seekTo(currentSeek, true); 
          return false;
        });

        var $pbRateSelect = $("#playbackRate_"+options.videoId);
        if($pbRateSelect.find('option').length <= 1){
          var pbRates = videoPlayer.getAvailablePlaybackRates();
          for (var i = 0; i < pbRates.length; i++) {
            $pbRateSelect.append('<option value="'+pbRates[i]+'" '+((pbRates[i] === 1)? ' selected="selected" ' : '')+'>'+((pbRates[i] === 1)? 'normal' : pbRates[i]+'x')+'</option>');
          };
          
        }
        $pbRateSelect.on('change', function(e){
          e.preventDefault();
          var newRate = parseFloat($(this).val());
          if(newRate) videoPlayer.setPlaybackRate(newRate);
        });

        //scrubber 
        $( "#video_scrubber_"+options.videoId ).slider({
          min: minDuration,
          max: maxDuration,
          change: function(event, ui) {},
          slide: function(event, ui) {
            var originalState = videoPlayer.getPlayerState();
            if(originalState === YT.PlayerState.PLAYING) videoPlayer.pauseVideo();
            videoPlayer.seekTo(ui.value, true);
            if(originalState === YT.PlayerState.PLAYING) videoPlayer.playVideo();
          },
          start: function(event, ui) {},
          stop: function(event, ui) {}
        });

        // Check for Ready state (This is a work around) -SH
        _eventLoopInterval = setInterval(function () {
            if(videoPlayer.getPlayerState) {
              if(videoPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                if(!_playerSliderInterval) {
                  _playerSliderInterval = setInterval(function () {
                    $( "#video_scrubber_"+options.videoId ).slider("value", parseInt(videoPlayer.getCurrentTime()));
                    //self cleaning for when the dialog closes
                    // if(!$( "div#"+options.videoId).length) {}
                  }, 500);
                }
              } 
              
              if(videoPlayer.getPlayerState() === YT.PlayerState.CUED) {
                $('#btn_play_pause_'+options.videoId).trigger('click'); 
                var $pbQualitySelect = $("#videoQuality_"+options.videoId);
                if($pbQualitySelect.find('option').length <= 1) {
                  var qualities = videoPlayer.getAvailableQualityLevels();
                  for (var i = 0; i < qualities.length; i++) {
                    $pbQualitySelect.append('<option value="'+qualities[i]+'">'+qualities[i]+'</option>');
                  };
                  
                }
                $pbQualitySelect.change(function(e){
                  e.preventDefault();
                  var newQuality = $(this).val();
                  if(newQuality){
                    videoPlayer.setPlaybackQuality(newQuality);
                  } 
                }); 
                videoPlayer.setPlaybackQuality('default');
              }

              if(videoPlayer.getPlayerState() !== YT.PlayerState.PLAYING) {
                clearInterval(_playerSliderInterval);
                _playerSliderInterval = null;
              }
            }
        }, 500);

      };
      var onPlayerStateChange = function(event) {
        // var videoPlayer = event.target;
        // var $pbQualitySelect = $("#videoQuality_"+options.videoId);
        // console.log($pbQualitySelect.find('option').length);
        // //Intial load for the video dialog -SH
        // if($pbQualitySelect.find('option').length === 1 && (videoPlayer.getPlayerState() === YT.PlayerState.PLAYING)){
        //   var qualities = videoPlayer.getAvailableQualityLevels();
        //   for (var i = 0; i < qualities.length; i++) {
        //     $pbQualitySelect.append('<option value="'+qualities[i]+'">'+qualities[i]+'</option>');
        //   };
        //   $pbQualitySelect.change(function(e){
        //     e.preventDefault();
        //     var newQuality = $(this).val();
        //     if(newQuality){
        //       videoPlayer.setPlaybackQuality(newQuality);
        //     } 
        //   }); 
        //   videoPlayer.setPlaybackQuality('default');
        // }
        
        // 


        // if(videoPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
        //   player.interval = setInterval(function () {
        //     $( "#video_scrubber_"+options.videoId ).slider("value", parseInt(videoPlayer.getCurrentTime()));
            
        //     //self cleaning for when the dialog closes
        //     if(!$( "div#"+options.videoId).length) {}
        //   }, 500);
        // }

        // if(videoPlayer.getPlayerState() === YT.PlayerState.PAUSED || videoPlayer.getPlayerState() === YT.PlayerState.ENDED) {
        //   if(player.interval) clearInterval(player.interval);
        // }

      };

      var onPlaybackQualityChange = function(event){};

      player = new YT.Player(options.selector, {
          videoId: options.videoId,
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onPlaybackQualityChange': onPlaybackQualityChange
          }
        });
      return player;
    }

    $.fn.scotiaVideo = function(options) {
    
        if (! this.length) return this;

        var defaults = {
          postInit: null,
          contentModelObj: null
        };
        
        var opts = $.extend(true, {}, defaults, options);

        var scotiaTemplate = new ScotiaVideoTemplate();

        var clickEvent = function(e) {
              e.preventDefault();
            var $videoLink = $(this);
            var videoSrc = parseVideoHrefSrc($(this).attr('href'));
            var $videoDialog = buildDialog(videoSrc, $videoLink.data(), scotiaTemplate, opts.contentModelObj); 
              
              var onDialogOpen = function() {
                      var $videoOverlay = $(scotiaTemplate.buildModalOverlay());
                      $videoOverlay.on('click', closeDialogOverlay());
                      openDialogOverlay($videoOverlay);
                      showCurrentDialogSection($videoLink, $videoDialog);

                      if(opts.onDialogOpen && (typeof opts.onDialogOpen === 'function')) {
                        opts.onDialogOpen($videoLink, $videoDialog);
                      }

              };

              var onDialogClose = function() { 
                      closeDialogOverlay();
                      $(this).remove();
                      
                      // kill the old and remake anew
                      initClick($videoLink, clickEvent);
                      $videoLink.focus();
              };

              var onCleanUp = function() {
                var dialogCode = $videoDialog.attr('id');
                var playerInstance = _playerInstances.getItem('player_'+dialogCode);
                if($('#btn_play_pause_'+dialogCode).attr('aria-pressed') === 'true') {
                  $('#btn_play_pause_'+dialogCode).trigger('click');
                } 
                
                if(playerInstance && playerInstance.stopVideo()) playerInstance.stopVideo();
                clearInterval(_playerSliderInterval);
                clearInterval(_eventLoopInterval);
                _eventLoopInterval = null; 
                _playerSliderInterval = null;
              };

              $videoDialog.dialog(dialogObjFactory(onDialogOpen, onDialogClose, {}, onCleanUp));

              return false;
        };
        
        for (var sVideo = 0; sVideo < this.length; sVideo++) {   
            initClick($(this[sVideo]), clickEvent);
        }

        var transClick = function(e){
            e.preventDefault();
            
            var $linkObj  = $(this);
            var parentID = $linkObj.data('parent');
            var $parentObj = $(this).parents('div[id='+parentID+']');
            
            showCurrentDialogSection($linkObj, $parentObj, function(){
              if(_getTransViewState($parentObj) === 'show-video') {
                e.preventDefault();
                $parentObj.find('.video-button.play').focus();
              } else {
                
                $($linkObj.attr('href')).focus(); //manually set focus to avoid screen jump browser behaviour -SH
                
                // Firefox has issue focusing on elements that are not visible when focus is shifted -SH
                if(/Firefox/i.test(navigator.userAgent)){
                  setTimeout(function(){
                    var eleName = $linkObj.attr('href').substring(1);
                    $('a[name='+eleName+']').focus();  
                  },500);
                }
              }
            });
          return false;  
        };

        // setup transcript clicks 
        $('.transcripts a.youtube').live('click', transClick);
        $('.career-video-transcript a.red-btn.youtube').live('click', transClick);
        $('.ui-dialog-titlebar-close.ui-corner-all').live('keydown', function(e){
            switch(e.which){
              case 13: // hit enter on the close button
                _getDialogAsParent($(this)).dialog('close');
              break;
              
              case 9: // tab off the close button
                var $parentDialogObj = _getDialogAsParent($(this));
                if(_isDialogVideoHidden($parentDialogObj) === "true") {
                  var langCode = _getTranLangCode($parentDialogObj.attr('class'));
                  $parentDialogObj.find('.career-video-transcript .copy.'+langCode[1]+' .transcript-anchor-wrap').focus();
                } else {
                  $parentDialogObj.find('.video-button.visual.first').focus();
                }
              break;
            }
        });

        $('a.ui-slider-handle.ui-state-default.ui-corner-all').live('keydown', function(e){
            var $parentDialogObj = _getDialogAsParent($(this));
            switch(e.which){
              case 9:
                if(e.shiftKey) {
                  $parentDialogObj.find('.transcripts a.youtube.last').focus();
                } else {
                  $(this).parent().parent().parent().prev().find('a.ui-dialog-titlebar-close').focus();
                  return false;
                }
              break;
            }
        });

        $('.career-video-transcript .copy .transcript-anchor-wrap').live('keydown', function(e){
          switch(e.which){
              case 9: // tab off
              if(e.shiftKey) {
                $(this).parent().parent().parent().prev().find('a.ui-dialog-titlebar-close').focus();
                return false; 
              }
              break;
          }
        });

        if(opts.postInit && (typeof opts.postInit === 'function')) {
          opts.postInit($(this));
        }

        return this;
    };

    // start
    $(function() {
        $(document).ready(function(){
          var $scotia_videos = $(".scotia-video");
          youTubeVideoListFactory(parseScotiaVideoKeys($scotia_videos), function(youTubeVideoList){
            $scotia_videos.scotiaVideo({contentModelObj: youTubeVideoList, 
              onDialogOpen: function($link, $dialog){
                var videoCode = parseVideoHrefSrc($link.attr('href'));
                var ytPlayer = _playerInstances.getItem('player_'+videoCode, function(){
                  return _ytIframeApiFactory({
                      selector: 'player_'+videoCode,
                      videoId: videoCode
                  }, $dialog);
                });
              },
              postInit: function($video){
                  _ytIframeApiLoader();
              }
            });
          });
        });
    });

})(jQuery, window, document, videoConfig);
  