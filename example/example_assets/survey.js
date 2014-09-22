//$.getScript('/ca/common/js/jquery.cookie.js');
jQuery.cookie=function(e,t,n){if(arguments.length>1&&String(t)!=="[object Object]"){n=jQuery.extend({},n);if(t===null||t===undefined){n.expires=-1}if(typeof n.expires==="number"){var r=n.expires,i=n.expires=new Date;i.setDate(i.getDate()+r)}t=String(t);return document.cookie=[encodeURIComponent(e),"=",n.raw?t:encodeURIComponent(t),n.expires?"; expires="+n.expires.toUTCString():"",n.path?"; path="+n.path:"",n.domain?"; domain="+n.domain:"",n.secure?"; secure":""].join("")}n=t||{};var s,o=n.raw?function(e){return e}:decodeURIComponent;return(s=(new RegExp("(?:^|; )"+encodeURIComponent(e)+"=([^;]*)")).exec(document.cookie))?o(s[1]):null}

$(function () {
    //console.log("ready!");
    var cid = getContentId(),
        lang = $("html").attr("lang"),
        modalLaunched = $.cookie("modal-survey"),
        modalClicked = $.cookie("modal-clicked"),
        cidRandomness = {
            2: 50,
            3: 25,
            6: 25,
            7: 25,
            1001: 10,
            1003: 3,
            1239: 5,
            1279: 5,
            6984: 2
        },
        arrayProbabilty = cidRandomness[cid],
        randomNumber = randomIntFromInterval(1, arrayProbabilty),
        response = "";
    if (lang == "en") {
        strTitle = "Survey";
        $.ajax({
            type: "GET",
            url: "/assets/survey-modal.html",
            async: false,
            success: function (text) {
                response = text;
            }
        });
        $("#wrapper").prepend(response);
    } else {
        strTitle = "Questionnaire banquescotia.com";
        $.ajax({
            type: "GET",
            url: "/ca/fr/files/14/08/survey-modal-fr.html",
            async: false,
            success: function (text) {
                response = text;
            }
        });
        $("#wrapper").prepend(response);
    }


    if (modalClicked || modalLaunched) {

       //console.log("cookie");
    } else {
		 //console.log(randomNumber + '/' + arrayProbabilty);
        if (randomNumber == arrayProbabilty) {
            ModalWindow();
        }
	}
});


function getContentId() {
    var a = window.location.href;
    cid = a.split(",")[2];
    return window.parseInt(cid);
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function ModalWindow() {
    $.cookie("modal-survey", '1', {
        expires: 90,
        path: '/'
    });

    $('#survey-overlay').dialog({
        title: strTitle,
        modal: true,
        resizable: false,
        draggable: false,
        closeText: 'Close dialog',
        closeOnEscape: false,
        stack: true,
        width: 515,
        open: function (event, ui) {
            var $overlay = $(event.target).parent();
            $overlay.attr('aria-hidden', 'false');
        },
        close: function (e, ui) {
            var $overlay = $(e.target).parent();
            $overlay.attr('aria-hidden', 'true');
        }
    });
}