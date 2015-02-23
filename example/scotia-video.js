/*!
 * jQuery ScotiaVideo Plugin
 * TODO
 */
(function($, window){
    'use strict';

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

    function buildDialog(videoCode, templateHelper, contentModelObj) { // TODO: This sucks and needs to be refactored -SH
      
      return _quickCache.getItem(videoCode, function(){
            var $videoDialog = $(templateHelper.buildModalDialog({
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
              }))
            .attr('id', videoCode)
            .css('display', 'none');

            //TODO: possibly append this item to something else at this point. Currently no need. -SH

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
            var $videoDialog = buildDialog(parseVideoHrefSrc($(this).attr('href')), scotiaTemplate, contentModelObj); 
              
              var onDialogOpen = function() {
                      console.log('open');
                      var $videoOverlay = $(scotiaTemplate.buildModalOverlay());
                      $videoOverlay.on('click', closeDialogOverlay());
                      openDialogOverlay($videoOverlay);
                      showCurrentDialogSection($videoLink, $videoDialog);
              };

              var onDialogClose = function() { 
                      console.log('close');
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

        // $scotia_videos.scotiaVideo();
    });

})(jQuery, window);

