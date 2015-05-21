/*!
 * jQuery ScotiaVideo Plugin
 * TODO
 */
(function($, window, document, playerObj, _config){
    'use strict';

    // setup an instance of QuickCache for use withing this scope -SH
    var _quickCache = new QuickCache();

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
            classAttr: match[0]
          };
        } 

        return {
          selector: '.youtube-overlay',
          classAttr: 'show-video'
        };
      })(($jqObj && $jqObj.data('view')) || null);

      //nuke all the styles
      classHardReset($prntObj.find(viewDataObj.selector));
      $prntObj.find(viewDataObj.selector).addClass(viewDataObj.classAttr);
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
                  dialogClass: 'scotia-video-dialog',
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

    function applyTransHtml(item, $parentObj, beforeHtml, afterHtml) {
      var transItem = _parseTrans(item);
      var bHtml = beforeHtml ? beforeHtml : '';
      var aHtml = afterHtml ? afterHtml : '';
      var html = bHtml+_parseTransHtml(transItem)+aHtml;
      $parentObj.find('.career-video-transcript .'+_parseTransClass(transItem)).html(html);
    }

    function buildDialog(videoCode, linkDataObj, templateHelper, contentModelObj) { // TODO: This sucks and needs to be refactored -SH
      
      var dialogObj = {
                dialogTitle: "",
                dialogID: videoCode,
                iFrameObj: {
                  width: 640,
                  height: 385,
                  src: '//www.youtube.com/embed/'+videoCode
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
                
                var beforeHtml = '<a name="'+dialogObj.dialogID+'-trans-box" tabindex="1" class="transcript-anchor-wrap">';
                var afterHtml = '</a>';
                
                if(arguments[1] === 'success') { // this is a one dimentional array vs multi -sh
                  applyTransHtml(arguments, $videoDialog, beforeHtml, afterHtml);
                  return;
                }
                
                for (var i = arguments.length - 1; i >= 0; i--) {
                  applyTransHtml(arguments[i], $videoDialog, beforeHtml, afterHtml);
                };
                
              }, 
              function(err) {
                // console.log('error: ',err);
              }); 

            }
            return $videoDialog;  
          });
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
                      showCurrentDialogSection($videoLink, $videoDialog, function(){
                        _focusTranscripts($videoDialog);
                      });

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

              $videoDialog.dialog(dialogObjFactory(onDialogOpen, onDialogClose, {}));

              return false;
        };
        
        for (var sVideo = 0; sVideo < this.length; sVideo++) {   
            initClick($(this[sVideo]), clickEvent);
        }

        var transClick = function(e){
            var $linkObj  = $(this);
            var parentID = $linkObj.data('parent');
            var $parentObj = $(this).parents('div[id='+parentID+']');
            showCurrentDialogSection($linkObj, $parentObj, function(){
              if(_getTransViewState($parentObj) === 'show-video') {
                e.preventDefault();
                _focusTranscripts($parentObj);
                return false;
              } else {
                // Firefox has issue focusing on elements that are not visible when focus is shifted -SH
                if(/Firefox/i.test(navigator.userAgent)){
                  setTimeout(function(){
                    var eleName = $linkObj.attr('href').substring(1);
                    $('a[name='+eleName+']').focus();  
                  },500);
                }
              }
            });
            
        };

        // setup transcript clicks 
        $('.transcripts a.youtube').live('click', transClick);
        $('.career-video-transcript a.red-btn.youtube').live('click', transClick);
        $('.ui-dialog-titlebar-close.ui-corner-all').live('keydown', function(e){
            e.preventDefault();
            switch(e.which){
              case 13:
                _getDialogAsParent($(this)).dialog('close');
              break;
            }
            return false;
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
            $scotia_videos.scotiaVideo({contentModelObj: youTubeVideoList, onDialogOpen: function($link, $dialog){
              console.log('playerObj: ',playerObj);
            }});
          });
        });
    });

})(jQuery, window, document, YT, videoConfig);
