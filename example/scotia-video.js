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
      
      for (var item in jqObj) {
        var tempCode = parseVideoHrefSrc($(jqObj).attr('href'));
        tempCode && tempKeyList.push(tempCode);
      }

      return tempKeyList;
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

        return this;

    };

    // start
    $(function() {

        var $scotia_videos = $(".scotia-video");
        console.log($scotia_videos);
        return false;
        // youTubeVideoListFactory(parseVideoKeys(selector.selClass), function(youTubeVideoList){
        //   $("."+selector.selClass).scotiaVideo({init: selector.initHandler, contentModelObj: youTubeVideoList});
        // });

        // $scotia_videos.scotiaVideo();
    });

})(jQuery, window);

