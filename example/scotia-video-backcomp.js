'use strict';

/*!
 * jQuery ScotiaVideo Plugin For Backwards compatibility
 * TODO
 */
(function($){
    
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
                    $vidObj = $(this);
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
            
            var dialogSelector = hrefSelector[ele]+'_dialog';
            $videoParentObj.attr('id', dialogSelector.substring(1));

            var _this = this;
            
            $(".video-retail-banking a[href="+hrefSelector[ele]+"]").live('click', function(e){
              e.preventDefault();
              
              $this = $(this);
              
              $($this.attr('href') + "_dialog").dialog(dialogObjFactory($this, _this.templateHelper));

              // $($this.attr('href') + "_dialog").dialog({
              //     resizable: false,
              //     modal: true,
              //     width: 980,
              //     open: function() {
              //       $vidObj = $(this);
              //       console.log('open');
              //       $('body').append(_this.templateHelper.buildModalOverlay())
              //       .find('#main_video_overlay')
              //       .show()
              //       .on('click', closeDialogFactory($vidObj));
              //       showCurrentDialogSection($this, $vidObj);
                    
              //       initClickHandler("a[href^='#meet_']", $vidObj, _this.templateHelper);
                    
              //       // $vidParent.find('.career-video').focus();
              //     },
              //     close: function() { 
              //       $('#main_video_overlay').remove();
              //       $(this).remove();
              //       // kill the old and remake anew
              //       $('body').append(this);
              //       initClickHandler("a[href^='#meet_']", $(this), _this.templateHelper);
              //     }
              //   });
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
        var templateHelper = new ScotiaVideoTemplate();
        // console.log(opts);
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
        
        var vidKeys = [
          'xt4AB2xsGxs',
          'xE3qt144dM8'
        ];

        var ytApi = new YouTubeAPI('AIzaSyC1voi8E7DWtNEGZMf59MD13in_ueQlsLQ');
        
        ytApi.addVideoKeys(vidKeys)
        .fetchVideoInfo(function(){
          console.log(ytApi.listDescriptions());
        });

        var selector = getVideoSelector();
        if (selector) {
          $("."+selector.selClass).scotiaVideo({init: selector.initHandler});
        }
    });
})(jQuery);