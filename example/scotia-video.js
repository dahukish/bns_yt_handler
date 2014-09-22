/*!
 * jQuery ScotiaVideo Plugin
 * TODO
 */
(function($, window){
    
    $.fn.scotiaVideo = function(options) {
    
        if (! this.length) return this;

        var defaults = {};
        
        var opts = $.extend(true, {}, defaults, options);

        //setup our template handler
        var scotiaTemplate = new ScotiaVideoTemplate();
        // if we have items add the modal overlay markup to the body
        $('body').append(scotiaTemplate.buildModalOverlay());

        for (var sVideo = 0; sVideo < this.length; sVideo++) {
          var domObj = processVideoItem($(this[sVideo]));
          applyApiOverrides(domObj);
          buildvideoTile(domObj, scotiaTemplate, $(this[sVideo]));
        }

        return this;
    };

    // start
    $(function() {
        $(".scotia-video").scotiaVideo();
    });

})(jQuery, window);

