/*!
 * jQuery ScotiaVideo Plugin
 * TODO
 */
(function($, window){
    'use strict';

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

    function closeDialogFactory (prntObj) {
      return function(e) {
        e.preventDefault();
        $(prntObj).find('.youtube-overlay').removeClass('show-video');
        $('#main_video_overlay').remove();
        $(prntObj).dialog('close');  
      };
    }

    function dialogObjFactory (jqClickObj, templateHelper, contentModelObj, dialogOpts) {
      
      var opts = dialogOpts || {};
      return {
                  resizable: opts.resizable || false,
                  modal: opts.modal || true,
                  width: opts.width || 980,
                  open: function() {
                    console.log('open');
                    var $vidObj = $(this);
                    $('body').append(templateHelper.buildModalOverlay())
                    .find('#main_video_overlay')
                    .show()
                    .on('click', closeDialogFactory($vidObj));
                    // showCurrentDialogSection(jqClickObj, $vidObj);
                    // initClickHandler(hrefSelector, $vidObj, templateHelper);
                  },
                  close: function() { 
                    console.log('close');
                    $('#main_video_overlay').remove();
                    $(this).remove();
                    // kill the old and remake anew
                    $('body').append(this);
                    initDialog(jqClickObj, templateHelper, contentModelObj)
                  }
            };
    }

    function initClick(jqObj, dialogObj, templateHelper, contentModelObj) {
      jqObj.live('click',function(e) {
                dialogObj.dialog(dialogObjFactory(jqObj, templateHelper, contentModelObj, {}));
                return false;
                // e.preventDefault();
                // dialogObj.dialog('open');
      });
    }

    function buildDialog(jqObj, templateHelper, contentModelObj) {
      
      var videoCode = parseVideoHrefSrc(jqObj.attr('href'));

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

      $('body').append($videoDialog);

      return $videoDialog;
    }

    function initDialog(jqObj, templateHelper, contentModelObj) {
      var $videoDialog = buildDialog(jqObj, templateHelper, contentModelObj); 
      initClick(jqObj, $videoDialog, templateHelper, contentModelObj);
    }

    $.fn.scotiaVideo = function(options) {
    
        if (! this.length) return this;

        var defaults = {};
        
        var opts = $.extend(true, {}, defaults, options);

        // setup template helper
        var contentModelObj = (opts.contentModelObj)? opts.contentModelObj : null;

        //setup our template handler
        var scotiaTemplate = new ScotiaVideoTemplate();
        // if we have items add the modal overlay markup to the body
        // $('body').append(scotiaTemplate.buildModalOverlay());

        for (var sVideo = 0; sVideo < this.length; sVideo++) {   
          initDialog($(this[sVideo]), scotiaTemplate, contentModelObj);    
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

