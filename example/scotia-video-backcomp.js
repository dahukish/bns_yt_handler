'use strict';

/*!
 * jQuery ScotiaVideo Plugin For Backwards compatibility
 * TODO
 */
(function($, window){
    
    
    function CareerVideoHelper (jQueryObject) {
      this._videoObj = jQueryObject;
    }

    CareerVideoHelper.prototype = {
      constructor: CareerVideoHelper
    };


    function classHardReset(jqObj){
      jqObj.removeClass('show-video');
      jqObj.removeClass('show-transcript-en');
      jqObj.removeClass('show-transcript-fr');
      jqObj.removeClass('show-transcript-es');
      jqObj.removeClass('show-transcript-cn');
    }

    function closeDialogFactory (prntObj) {
      return function(e) {
        e.preventDefault();
        $(prntObj).find('.youtube-overlay').removeClass('show-video');
        $('#main_video_overlay').remove();
        $(prntObj).dialog('close');  
      };
    }

    function dialogObjFactory (jqClickObj, templateHelper, dialogOpts) {
      
      var hrefSelector = (jqClickObj && jqClickObj.attr('href'))? "a[href^='"+jqClickObj.attr('href')+"']" : "a[href^='#meet_']";
      var opts = dialogOpts || {};
      return {
                  resizable: opts.resizable || false,
                  modal: opts.modal || true,
                  width: opts.width || 980,
                  open: function() {
                    var $vidObj = $(this);
                    $('body').append(templateHelper.buildModalOverlay())
                    .find('#main_video_overlay')
                    .show()
                    .on('click', closeDialogFactory($vidObj));
                    showCurrentDialogSection(jqClickObj, $vidObj);
                    initClickHandler(hrefSelector, $vidObj, templateHelper);
                  },
                  close: function() { 
                    $('#main_video_overlay').remove();
                    $(this).remove();
                    // kill the old and remake anew
                    $('body').append(this);
                    initClickHandler(hrefSelector, $(this), templateHelper);
                  }
            };
    }

    function showCurrentDialogSection(jqObj, prntObj) {
      var viewDataObj = (function(viewData){
        var match = /show-transcript-(\w{2})/i.exec(viewData);
        // console.log(match, viewData);
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
      })((jqObj && jqObj.data('view')) || null);

      // console.log(viewDataObj);
      
      //nuke all the styles
      classHardReset(prntObj.find(viewDataObj.selector));
      prntObj.find(viewDataObj.selector).addClass(viewDataObj.class);
    }

    function updateDialog(jqObj, contentModelObj) {
      var videoID = parseVideoEmbedSrc(jqObj.find('iframe').attr('src'));
      var modelObj = contentModelObj.getItem(videoID);
      var divCopy = jqObj.find('.copy');
      var divCopyTitle = divCopy.find('.frutiger');
      var divCopyDesc = divCopy.find('p:eq(0)');
      var divCopyDesc = divCopy.find('p:eq(0)');
      
      divCopyTitle.html(modelObj.title);
      divCopyDesc.html(modelObj.description);

      // TODO: add duration -SH

    }

    function initClickHandler(selector, prntObj, tmpHelper) {
      
      $(selector, prntObj).each(function(index, item) {
              
              var $this = $(this);
              $this.off(); // strip the old stuff if any
              var $vidParent = prntObj; //save a local ref
              $this.live('click',function(e) {
                e.preventDefault();
                
                showCurrentDialogSection($this, $vidParent);
                
                $($vidParent).dialog('open');
              });// on click
            }); // .each
    }


    function InitHandler(templateHelper) {
      this.templateHelper = templateHelper;
    }
    
    InitHandler.prototype = {
      constructor: InitHandler,
      careerInit: function (jqObj) {
        var hrefSelector = new Array();
        for (var ele = 0; ele < jqObj.length; ele++) {
            var $videoObj = $(jqObj[ele]);
            var $videoParentObj = $videoObj.parents('.ui-dialog');
            var $transcriptObj = $videoObj.next();
            hrefSelector.push($transcriptObj.children('a.youtube').attr('href'));
            
            //refresh the careers dialog to use the YouTube data -SH
            updateDialog($videoObj, window.contentModelObj);

            var dialogSelector = hrefSelector[ele]+'_dialog';
            $videoParentObj.attr('id', dialogSelector.substring(1));

            var _this = this;
            
            $(".video-retail-banking a[href="+hrefSelector[ele]+"]").live('click', function(e){
              e.preventDefault();
              
              var $this = $(this);
              // TODO: add youtube Integration here
              $($this.attr('href') + "_dialog").dialog(dialogObjFactory($this, _this.templateHelper));

            });

          }
      },
      videoInit: function (jqObj) {
        var vidObjDlogCol = [];
        for (var ele = 0; ele < jqObj.length; ele++) {
          
          var $videoObj = $(jqObj[ele]);
          var $ytLink  = $videoObj.find('a[href^="http://www.youtube.com"]');
          var match = /www\.youtube\.com\/watch\?v=(\w+)/i.exec($ytLink.attr('href'));
          
          if(match) {
            var videoCode = match[1];
            $ytLink.attr('href', '#'+videoCode);

            // run through the list of item and build a transcript object if any
            var transListObj = (function(jqChildList){
              var transList = null;
              jqChildList.each(function(item, ele){
                
                if(!transList) 
                {
                  transList = []; 
                }

                transList.push({ 
                              href: $(ele).attr('href'),
                              langCode: 'en',
                              langFull: 'English'
                          });
                
                $(ele).attr('data-view', 'show-transcript-en').attr('href', '#'+videoCode);
              });
              return transList;
            })($videoObj.find('.transcript'));
            
            var _this = this;
            // TODO: add youtube Integration here
            vidObjDlogCol[videoCode] = $(this.templateHelper.buildModalDialog({
            // $videoDialog = $(this.templateHelper.buildModalDialog({
              dialogTitle: "",
              dialogID: videoCode,
              iFrameObj: {
                width: 640,
                height: 385,
                src: 'http://www.youtube.com/embed/'+videoCode
              },
              transcriptsList: transListObj
            })).css('display', 'none');

            //hack to get the transcripts loaded via ajax
            for (var transItem in transListObj) {
              if(transListObj[transItem].langCode) {
                var transCopy = vidObjDlogCol[videoCode]
                .find('.copy.'+transListObj[transItem].langCode); 
                
                $(transCopy).load(transListObj[transItem].href);
              }
            }
            
            $("a[href=#"+videoCode+"]").on('click', function(e){
              
              var match = /[^#]+/i.exec($(this).attr('href'));
              if(match) {
                vidObjDlogCol[match[0]].dialog(dialogObjFactory($(this), _this.templateHelper, "a[href=#"+videoCode+"]"));
              }
            });
          }
        }
      },
      creditCardInit: function(jqObj) {
        
        if(! $(jqObj).data('youtube-ref')) return;

        var $videoLink = $('a.video');
        var videoCode = $(jqObj).data('youtube-ref');
        
        $videoLink.attr('href','#'+videoCode);
        $videoDialog = $(this.templateHelper.buildModalDialog({
          dialogTitle: "",
          dialogID: videoCode,
          iFrameObj: {
            width: 640,
            height: 385,
            src: 'http://www.youtube.com/embed/'+videoCode
          }
        })).css('display', 'none');
        
        var _this = this;

        $("a[href=#"+videoCode+"]").on('click', function(e){
          e.preventDefault();
          $videoDialog.dialog(dialogObjFactory($(this), _this.templateHelper, "a[href=#"+videoCode+"]"));
        });
        
      }

    };

    function getInitHandler(selector) {
      var initHandler;
      switch(selector) {
        case "career-video":
          initHandler = "careerInit";
        break;
        case "video":
          initHandler = "videoInit";
        break;
        case "credit-card-video-popup":
          initHandler = "creditCardInit";
        break;
      }
      return initHandler;
    }

    function parseVideoKeys(selector) {
      
      var tempKeyList = [];
      switch(selector) {
        case "career-video":
          $('iframe').each(function(index, ele){
            var match = /www\.youtube\.com\/embed\/(\w+)/i.exec($(ele).attr('src'));
            if(match) tempKeyList.push(match[1]);
          });
        break;
        case "credit-card-video-popup":
        case "video":
          $('a[href^="http://www.youtube.com"]').each(function(index, ele){
            var match = /www\.youtube\.com\/watch\?v=(\w+)/i.exec($(ele).attr('href'));
            if(match) tempKeyList.push(match[1]);
          });
        break;
      }
      return tempKeyList;
    }

    function parseVideoEmbedSrc(embedUrl) {
      var index = embedUrl.indexOf('embed/');
      var indexShift = 6;
      if(index > -1) {
        return embedUrl.substring(index + indexShift);
      }
      return false;
    }

    function getVideoSelector() {

      if(window.videoLengthObj) {
        
        for (var item in window.videoLengthObj) {
          if (window.videoLengthObj[item]) {
            return {
              selClass: item,
              initHandler: getInitHandler(item)
            };
          }
        }  
      }

      return null;
    }

    $.fn.scotiaVideo = function(options) {
    
        if (! this.length) return this;

        var defaults = {};
        
        var opts = $.extend(true, {}, defaults, options);

        if(! opts.init) return this; // if no handler abort the whole process
        
        // setup template helper
        window.contentModelObj = (opts.contentModelObj)? opts.contentModelObj : null; //try this on the window object for now -SH
        // var contentModelObj = (opts.contentModelObj)? opts.contentModelObj : null;
        
        var templateHelper = new ScotiaVideoTemplate(window.contentModelObj);
        
        var initHandler = new InitHandler(templateHelper);
        initHandler[opts.init](this);

        // for (var sVideo = 0; sVideo < this.length; sVideo++) {
          // var domObj = processVideoItem($(this[sVideo]));
          // applyApiOverrides(domObj);
          // buildvideoTile(domObj, scotiaTemplate, $(this[sVideo]));
        // }

        return this;
    };

    // start
    $(function() {
        
        var selector = getVideoSelector();

        if (selector) {
            youTubeVideoListFactory(parseVideoKeys(selector.selClass), function(youTubeVideoList){
              $("."+selector.selClass).scotiaVideo({init: selector.initHandler, contentModelObj: youTubeVideoList});
            });
        }
    });
})(jQuery, window);