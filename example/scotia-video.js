/*!
 * jQuery ScotiaVideo Plugin
 * TODO
 */
(function($, window){
    'use strict';

    // setup an instance of QuickCache for use withing this scope -SH
    var _quickCache = new QuickCache();

    // config to store out paths etc -SH
    var _config = {
      transcript_path: '../transcripts',
      transcript_ext: '.html'
    };

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

    function showCurrentDialogSection($jqObj, $prntObj) {
      var viewDataObj = (function(viewData){
        var match = /show-transcript-(\w{2})/i.exec(viewData);
        if (match) {
          return {
            selector: '.youtube-overlay',
            class: match[0]
          };
        } 

        return {
          selector: '.youtube-overlay',
          class: 'show-video'
        };
      })(($jqObj && $jqObj.data('view')) || null);

      //nuke all the styles
      classHardReset($prntObj.find(viewDataObj.selector));
      $prntObj.find(viewDataObj.selector).addClass(viewDataObj.class);
    }

    function openDialogOverlay($htmlOverlay) {
      $('body').append($htmlOverlay)
      .find('#main_video_overlay')
      .show();
    }

    function closeDialogOverlay() {
        $('#main_video_overlay').remove();
    }

    function dialogObjFactory(onOpen, onClose, dialogOpts) {
      
      var opts = dialogOpts || {};
      return {
                  resizable: opts.resizable || false,
                  modal: opts.modal || true,
                  width: opts.width || 980,
                  open: (onOpen && (typeof onOpen === 'function')? onOpen : function(){}),
                  close: (onClose && (typeof onClose === 'function')? onClose : function(){})
            };
    }

    function initClick(jqObj, onClick, dialogObj) {
      jqObj.live('click', (onClick && (typeof onClick === 'function')? onClick : function(){}) );
    }

    function loadTranscripts(transPaths, callback, fallback) {
      
      var deferreds = [];

      for (var transPath in transPaths) {
          deferreds.push($.get(transPaths[transPath]));
      }

      $.when.apply($, deferreds)
      .done(callback)
      .fail(fallback);

    }

    function applyTranscriptData(dialogObj, linkDataObj, transOpts) {
      
      if(!('vidCode' in transOpts)) return false;

      var transcripts = linkDataObj.transcripts.split(',');
      var transPaths = [];
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
            var href = _config.transcript_path+'/'+transOpts.vidCode+'_'+trans+_config.transcript_ext;
            transPaths.push(href);
            transObj.href = href;
          }
      }
        
      if(transPaths.length) {
        loadTranscripts(transPaths, 
        function(data) {
          // transcriptsList: transListObj
          console.log('success: ', arguments);
          console.log(dialogObj);
        }, 
        function(err) {
          console.log('error: ',err);
        });
      }



    }

    function buildDialog(videoCode, linkDataObj, templateHelper, contentModelObj) { // TODO: This sucks and needs to be refactored -SH
      
      var dialogObj = {
                dialogTitle: "",
                dialogID: videoCode,
                iFrameObj: {
                  width: 640,
                  height: 385,
                  src: 'http://www.youtube.com/embed/'+videoCode
                },
                copy: {
                      title: contentModelObj.getItemPart(videoCode, 'title', ''),
                      body: contentModelObj.getItemPart(videoCode, 'description', '')
                },
                duration: contentModelObj.getItemPart(videoCode, 'duration', '')
              };

      return _quickCache.getItem(videoCode, function(){
            var $videoDialog = $(templateHelper.buildModalDialog(dialogObj))
            .attr('id', videoCode)
            .css('display', 'none');

            //TODO: possibly append this item to something else at this point. Currently no need. -SH

            // see if we have any transcript data
            if ('transcripts' in linkDataObj) {
              applyTranscriptData(dialogObj, linkDataObj, {vidCode: videoCode, attachEle: $videoDialog});
            }

            return $videoDialog;  
          });
    }

    $.fn.scotiaVideo = function(options) {
    
        if (! this.length) return this;

        var defaults = {};
        
        var opts = $.extend(true, {}, defaults, options);

        var contentModelObj = (opts.contentModelObj)? opts.contentModelObj : null;

        var scotiaTemplate = new ScotiaVideoTemplate();

        var clickEvent = function(e) {
              e.preventDefault();
            var $videoLink = $(this);
            var $videoDialog = buildDialog(parseVideoHrefSrc($(this).attr('href')), $(this).data(), scotiaTemplate, contentModelObj); 
              
              var onDialogOpen = function() {
                      var $videoOverlay = $(scotiaTemplate.buildModalOverlay());
                      $videoOverlay.on('click', closeDialogOverlay());
                      openDialogOverlay($videoOverlay);
                      showCurrentDialogSection($videoLink, $videoDialog);
              };

              var onDialogClose = function() { 
                      closeDialogOverlay();
                      $(this).remove();
                      
                      // kill the old and remake anew
                      initClick($videoLink, clickEvent);
              };

              $videoDialog.dialog(dialogObjFactory(onDialogOpen, onDialogClose, {}));

              return false;
        };
        
        for (var sVideo = 0; sVideo < this.length; sVideo++) {   
            initClick($(this[sVideo]), clickEvent);
        }

        return this;
    };

    // start
    $(function() {
        var $scotia_videos = $(".scotia-video");
        youTubeVideoListFactory(parseScotiaVideoKeys($scotia_videos), function(youTubeVideoList){
          $scotia_videos.scotiaVideo({contentModelObj: youTubeVideoList});
        });

    });

})(jQuery, window);
