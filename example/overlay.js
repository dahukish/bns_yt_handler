$(function () {
    $('#ready-to-apply-overlay').dialog({
        title: 'Ready to Apply?',
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: false,
        closeText: 'Close dialog',
        width: 676,
        open: function (event, ui) {

            var $overlay = $(event.target).parent();

            var $firstTab = $overlay.find(':focusable:first');
            var $lastTab = $overlay.find(':focusable:last');

            $firstTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                    e.preventDefault();
                    setTimeout(function () {
                        $lastTab.focus();
                    }, 1);
                }
            });
            $lastTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                } else if (e.which == 9) { //tab
                    e.preventDefault();
                    setTimeout(function () {
                        $firstTab.focus();
                    }, 1);
                }
            });

            $overlay.attr('aria-hidden', 'false');
            // console.log($(event.target).data('launcher'));
            $overlay.find('.ui-dialog-titlebar-close').removeAttr('role').attr('href', '#' + $(event.target).data('launcher').attr('id'));
        },
        close: function (e, ui) {
            var $overlay = $(e.target).parent();

            //$(e.target).data('launcher').focus();

            $overlay.attr('aria-hidden', 'true');

        }
    });

    $('.ui-widget-overlay').live('click', function () {
        $('#ready-to-apply-overlay').dialog('close');
    });

    // });



    //$(function() {
    $('#ready-to-apply-overlay-scene').dialog({
        title: 'Ready to Apply?',
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: false,
        closeText: 'Close dialog',
        width: 676,
        open: function (event, ui) {

            var $overlay = $(event.target).parent();

            var $firstTab = $overlay.find(':focusable:first');
            var $lastTab = $overlay.find(':focusable:last');

            $firstTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                    e.preventDefault();
                    setTimeout(function () {
                        $lastTab.focus();
                    }, 1);
                }
            });
            $lastTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                } else if (e.which == 9) { //tab
                    e.preventDefault();
                    setTimeout(function () {
                        $firstTab.focus();
                    }, 1);
                }
            });

            $overlay.attr('aria-hidden', 'false');
            // console.log($(event.target).data('launcher'));
            $overlay.find('.ui-dialog-titlebar-close').removeAttr('role').attr('href', '#' + $(event.target).data('launcher').attr('id'));
        },
        close: function (e, ui) {
            var $overlay = $(e.target).parent();

            //$(e.target).data('launcher').focus();

            $overlay.attr('aria-hidden', 'true');

        }
    });

    $('.ui-widget-overlay').live('click', function () {
        $('#ready-to-apply-overlay-scene').dialog('close');
    });

    // });

    //$(function() {
    $('#ready-to-apply-overlay-btr').dialog({
        title: 'Ready to Apply?',
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: false,
        closeText: 'Close dialog',
        width: 676,
        open: function (event, ui) {

            var $overlay = $(event.target).parent();

            var $firstTab = $overlay.find(':focusable:first');
            var $lastTab = $overlay.find(':focusable:last');

            $firstTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                    e.preventDefault();
                    setTimeout(function () {
                        $lastTab.focus();
                    }, 1);
                }
            });
            $lastTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                } else if (e.which == 9) { //tab
                    e.preventDefault();
                    setTimeout(function () {
                        $firstTab.focus();
                    }, 1);
                }
            });

            $overlay.attr('aria-hidden', 'false');
            // console.log($(event.target).data('launcher'));
            $overlay.find('.ui-dialog-titlebar-close').removeAttr('role').attr('href', '#' + $(event.target).data('launcher').attr('id'));
        },
        close: function (e, ui) {
            var $overlay = $(e.target).parent();

            //$(e.target).data('launcher').focus();

            $overlay.attr('aria-hidden', 'true');

        }
    });

    $('.ui-widget-overlay').live('click', function () {
        $('#ready-to-apply-overlay-btr').dialog('close');
    });

    // });

    $('#ready-to-apply-overlay-slf').dialog({
        title: 'Get a Quote',
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: false,
        closeText: 'Close dialog',
        width: 460,
        open: function (event, ui) {
            var $overlay = $(event.target).parent();

            var $firstTab = $overlay.find(':focusable:first');
            var $lastTab = $overlay.find(':focusable:last');

            $firstTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                    e.preventDefault();
                    setTimeout(function () {
                        $lastTab.focus();
                    }, 1);
                }
            });
            $lastTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                } else if (e.which == 9) { //tab
                    e.preventDefault();
                    setTimeout(function () {
                        $firstTab.focus();
                    }, 1);
                }
            });

            $overlay.attr('aria-hidden', 'false');
            // console.log($(event.target).data('launcher'));
            $overlay.find('.ui-dialog-titlebar-close').removeAttr('role').attr('href', '#' + $(event.target).data('launcher').attr('id'));
        },
        close: function (e, ui) {
            var $overlay = $(e.target).parent();

            //$(e.target).data('launcher').focus();

            $overlay.attr('aria-hidden', 'true');

        }
    });

    $('.ui-widget-overlay').live('click', function () {
        $('#ready-to-apply-overlay-slf').dialog('close');
    });

    //$(function() {
    $('#business-overlay').dialog({
        title: 'Banking for Business',
        autoOpen: false,
        modal: true,
        resizable: false,
        draggable: false,
        closeText: 'Close dialog',
        width: 676,
        open: function (event, ui) {

            var $overlay = $(event.target).parent();

            var $firstTab = $overlay.find(':focusable:first');
            var $lastTab = $overlay.find(':focusable:last');

            $firstTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                    e.preventDefault();
                    setTimeout(function () {
                        $lastTab.focus();
                    }, 1);
                }
            });
            $lastTab.keydown(function (e) {
                if (e.which == 9 && e.shiftKey) { // shift+tab
                } else if (e.which == 9) { //tab
                    e.preventDefault();
                    setTimeout(function () {
                        $firstTab.focus();
                    }, 1);
                }
            });

            $(document).keydown(function (e) {
                if (e.keyCode == 27) return false;
            });



            $overlay.attr('aria-hidden', 'false');
            // console.log($(event.target).data('launcher'));
            $overlay.find('.ui-dialog-titlebar-close').removeAttr('role').attr('href', '#' + $(event.target).data('launcher').attr('id'));
        },
        close: function (e, ui) {
            var $overlay = $(e.target).parent();

            //$(e.target).data('launcher').focus();

            $overlay.attr('aria-hidden', 'true');

        }
    });

    $('.ui-widget-overlay').live('click', function () {
        $('#business-overlay').dialog('close');
    });

});


if(typeof $.fancybox == 'function') {
   
   
 if (/Mobile Safari|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  //native
} else {
     $.getScript("/ca/common/js/fancybox-calls.js");
  }
} else {
  //console.log("fancy box not loaded");
}