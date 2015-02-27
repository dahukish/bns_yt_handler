/*!
 * jQuery ScotiaVideo Plugin
 * TODO
 */
(function($, window, document){
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

    function showCurrentDialogSection($jqObj, $prntObj, callback) {
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
      return $jqObj.parents('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable')
              .find('.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-dialog-content');
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
      var $ytOverlay = $jqDialog.find('.youtube-overlay');
      console.log($ytOverlay.attr('class').indexOf('show-'));
    }

    function _focusTranscripts($videoDialog, classAdd) {
      var classAdditions = (classAdd && classAdd.length)? ('.'+classAdd.join(' ')) : "";
      console.log($videoDialog.find('.transcripts'+classAdditions+' a.youtube:eq(0)').focus());
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

    function applyTransHtml(item, $parentObj) {
      var transItem = _parseTrans(item);
      $parentObj.find('.career-video-transcript .'+_parseTransClass(transItem)).html(_parseTransHtml(transItem));
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
            
            // see if we have any transcript data
            if ('transcripts' in linkDataObj) {
              applyTranscriptData(dialogObj, linkDataObj, videoCode);
            }
            
            var $videoDialog = $(templateHelper.buildModalDialog(dialogObj))
            .attr('id', videoCode)
            .css('display', 'none');

            //TODO: possibly append this item to something else at this point. Currently no need. -SH
            
            if(dialogObj.transcriptsList) {
              loadTranscripts(dialogObj.transcriptsList, 
              function(success) {
                
                if(arguments[1] === 'success') { // this is a one dimentional array vs multi -sh
                  applyTransHtml(arguments, $videoDialog);
                  return;
                }
                
                for (var i = arguments.length - 1; i >= 0; i--) {
                  applyTransHtml(arguments[i], $videoDialog);
                };
                
              }, 
              function(err) {
                console.log('error: ',err);
              }); 

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
                      showCurrentDialogSection($videoLink, $videoDialog, function(){
                        _focusTranscripts($videoDialog);
                      });
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

        var transClick = function(e){
            e.preventDefault();
            var $linkObj  = $(this);
            var href = $linkObj.attr('href');
            var $parentObj = $(this).parents('div[id='+href.substring(1)+']');
            showCurrentDialogSection($linkObj, $parentObj, function(){
              _getTransViewState($parentObj)
            });
            return false;
        };

        // setup transcript clicks 
        $('.transcripts a.youtube').live('click', transClick);
        $('.career-video-transcript a.red-btn.youtube').live('click', transClick);
        $('.ui-dialog-titlebar-close.ui-corner-all').live('keydown', function(e){
            e.preventDefault();
            console.log(e);
            switch(e.which){
              case 13:
                _getDialogAsParent($(this)).dialog('close');
              break;
            }
            return false;
        });

        return this;
    };

    // start
    $(function() {
        $(document).ready(function(){
          var $scotia_videos = $(".scotia-video");
          youTubeVideoListFactory(parseScotiaVideoKeys($scotia_videos), function(youTubeVideoList){
            $scotia_videos.scotiaVideo({contentModelObj: youTubeVideoList});
          });
        });
    });

})(jQuery, window, document);
