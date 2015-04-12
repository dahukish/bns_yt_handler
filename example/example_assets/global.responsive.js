var start = navigator.userAgent.indexOf("Android ");
var majorversion = navigator.userAgent.substr(start+8,1);
if (majorversion < 3) { $("body, html").addClass("android"); }


console.log('HELLO!!!');

var topPos = 124;
var pos = 0;
var updatedPos;
newPosition = "relative";

$(window).bind("touchmove scroll MozMousePixelScroll", function(e){
    pos = $(this).scrollTop();
    if (!$("#wrapper").hasClass("menu")){
     navPos();
    }
});

function changePosition(position){
    pos = $(window).scrollTop();
    newPosition = position;
    navPos();
}

function navPos() {
    //if (!$("html").hasClass("is980") && majorversion != 2){
    if( /Mobile Safari|Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        
        
        var st = document.getElementById('service-menu-container');
        st.style.position = newPosition;
        if (st) {
            if (pos < topPos) {
                st.style.top = '0px';
                st.style.position = "relative";
                $('#service-menu-container').removeClass("fixed");
                $('#header').removeClass("fixed-nav");   
            } else if (pos >= topPos) {
                if (newPosition === "absolute"){
                    st.style.top = pos + 'px';
                    $('#service-menu-container').addClass("fixed");
                    $('#header').addClass("fixed-nav");        
                }
                else{
                    st.style.position = "fixed";
                    st.style.top = "0px";
                    $('#service-menu-container').addClass("fixed");
                    $('#header').addClass("fixed-nav");       
                }
            }
        }
    }
}
navPos();

$(window).resize(function(){
  //  Cufon.refresh();
    var st = document.getElementById('service-menu-container');
        if (!$("#wrapper").hasClass("menu")){
            navPos();
        }
    if( $("html").attr("id") != "ie8"){
     
    
     //   $(".tabbed-content").children("div").removeAttr("class");
      //  $(".tabbed-content").children("div").addClass("tab-controller a");
    } 
});

//$(window).scrollTop("300"); // cause for jump?


// Rewritten version
// By @mathias, @cheeaun and @jdalton
 
(function(doc) {
    

    // This fix addresses an iOS bug, so return early if the UA claims it's something else.
    var ua = navigator.userAgent;
    if( !(/iPhone|iPad|iPod/.test( navigator.platform ))){
        return;
    }

    var addEvent = 'addEventListener',
        type = 'gesturestart',
        qsa = 'querySelectorAll',
        scales = [1, 1],
        meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];
 
    function fix() {
        meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
        doc.removeEventListener(type, fix, true);
    }
 
    if ((meta = meta[meta.length - 1]) && addEvent in doc) {
        fix();
        scales = [.25, 1.6];
        doc[addEvent](type, fix, true);
    }
 
}(document));

var sb = sb||{};
sb.Swipe = function(el,t){
    this.touch = "ontouchend" in document;
    this.lock = false;
    this.startTime = 0;
    this.startX = 0;
    this.startY = 0;
    this.maxTime = 1000;
    this.maxDistance = 50;
    this.currentX;
    this.duration;
    this.caller = t;
    this.el = el;
    this.startEvent = (this.touch) ? 'touchstart' : 'mousedown';
    this.moveEvent = (this.touch) ? 'touchmove' : 'mousemove';
    this.endEvent = (this.touch) ? 'touchend' : 'mouseup';
    this.outEvent = (this.touch) ? '' : 'mouseout'; 
    this.swipe = false;
    this.bind();
};
sb.Swipe.prototype = {
    bind:function(){
        var _this = this;
        $(this.el)
        .live(this.startEvent,function(e){
            if(!_this.lock){
                _this.lock=true;
                _this.startTime = e.timeStamp;
                _this.startX = _this.getX(e);
                _this.startY = _this.getY(e);
            }
        })
        .live(this.moveEvent,function(e){
            _this.currentX = _this.getX(e);
            _this.currentY = _this.getY(e);

            absX = Math.abs(_this.currentX - _this.startX);
            absY = Math.abs(_this.currentY - _this.startY);

            if(absY < absX){
                e.preventDefault();
            }

            if(_this.lock){
                _this.currentX = _this.getX(e);
                _this.currentY = _this.getY(e);
                _this.distance = (_this.currentX - _this.startX);
                _this.duration = e.timeStamp - _this.startTime;
                if(_this.duration > 30 && Math.abs(_this.distance) > 100){
                    _this.swipe = true;
                    _this.currentX < _this.startX ? _this.caller.doNext():_this.caller.doPrev();
                    _this.reset();
                    return true;
                }
            }
        })
        .live(this.endEvent,function(e){
            if(!_this.swipe){_this.caller.defaultHandler(e);}
            _this.swipe = false;
            _this.reset();          
            //return false;
        })
        .live(this.outEvent,function(e){
            _this.reset();
           // return false;
        });
        
    },
    getX:function(e){return e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;},
    getY:function(e){return e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;},
    reset:function(){
        this.startTime = 0;
        this.startX = 0;
        this.lock = false;
    }   
};


var BNS = 'Uninitialized';
var slideMenuState = false;
var searchMenuState = false;
var scrollLoc = "";
var touchmove = false;
var clicked = false;

var originalXClick = 0;
var originalYClick = 0;

var vclick =  "ontouchend" in document ? 'touchend' : 'click';



var vclickstart =  "ontouchstart" in document ? 'touchstart' : 'click';
var vmousedown =  "ontouchend" in document ? 'mousedown' : 'click';

BNS = function() {

    // let the DOM note that JS is enabled  
    $('html').removeClass('no-js').addClass('js-on');

    // determine if userAgent is IE / IE6, dependant on the DOM structure
    var isIE    = ($('#ie6, #ie7, #ie8, #ie9').length) ? true : false;
    var isIE6   = ($('#ie6').length) ? true : false;
    var mobile  = false; // to be implemented


    //syze.sizes(320, 768, 980);// screen width
    
syze.sizes(320, 480, 720, 768, 980).from('device');

   // if ($("html").hasClass("is980")){
    // Cufon.replace('.frutiger');
   // }

  $.getScript("//ajax.googleapis.com/ajax/libs/webfont/1.5.0/webfont.js", function () {

      WebFont.load({
          custom: {
              families: ['Frutiger Roman']
          }
      });
  });


    var mobile_menu = {
                init:function(){
                    console.log('mm_init');
                    var func = this;
                    var swipe = new sb.Swipe('#mobile-side-nav',this);
                    $(".mega-menu-button").bind(vmousedown,function(e){
                        e.preventDefault();
                        if (!slideMenuState){
                            func.openMenu();
                        } else {
                            func.closeMenu();
                        }
                        
                    });

                },
                defaultHandler:function(){},
                doNext:function(){
                    this.closeMenu();
                },
                doPrev:function(){
                    
                },
                openMenu:function(){
                    $("#mobile-side-nav").show();

                    $("#search").addClass("phone-hide");
                    $("#service-menu-container").removeClass("search-open");
                    searchMenuState = false;

                    setTimeout(function(){
                        scrollLoc = window.pageYOffset;
                        $("body, html").addClass("menu");
                        $("#wrapper").addClass("menu");

                        $(".mega-menu-button").html("Close Navigation");
                        $("#wrapper a, #wrapper input").attr("tabindex","-1");
                        $(".mega-menu-button").attr("tabindex","0");

                        //Locks the left pane to the users current location
                        if(majorversion != 2){
                            $("#wrapper").css("top", -scrollLoc);
                        }

                        $("#mobile-side-nav").addClass("menu");
                        slideMenuState = true;

                        $("#mobile-side-nav").focus();
                    },100);

                },
                closeMenu:function(){

                    setTimeout(function(){
                        $("#mobile-side-nav").hide();
                    }, 500);



                    $("body, html").removeClass("menu");
                    $("#wrapper").removeClass("menu");

                    $("#wrapper a, #wrapper input").attr("tabindex","0");
                    $(".mega-menu-button").html("Open Navigation");

                    $("#wrapper").removeAttr("style");
                    $("#mobile-side-nav").removeClass("menu");

                    //Closes any opened item in the list in mobile menu
                    $(".primary-nav .open").removeClass("open");

                    

                    if(majorversion != 2){
                        setTimeout(function(){
                            $(window).scrollTop(scrollLoc);
                        },1);
                    }

                    // FIX FOR IPHONE 4 on 5.1.1 CAUSING THE SERVICE BAR TO SCROLL TO TOP
                    if (scrollLoc > 124){
                        $("#service-menu-container").removeClass("fixed");

                        setTimeout(function(){
                            $("#service-menu-container").addClass("fixed");
                        },10);
                    }

                    slideMenuState = false;
                    
                }
    }

   // mobile_menu.init();

    //if ($("html").hasClass("is768") || $("html").hasClass("is320") || (/iphone|ipod|ipad/gi).test(navigator.platform)){
        
if( /Mobile Safari|Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        
    
        
//var theSource = '/ca/responsive/nav/ca_en.personal_banking.json';

var parent_cid = $(document.body).attr("id");

if ( parent_cid === "cid587" || parent_cid === "cid575"  || parent_cid === "cid1181" || parent_cid === "cid610"  || parent_cid === "cid1159"|| parent_cid === "cid580" || parent_cid === "cid543"|| parent_cid === "cid4635"  || parent_cid === "cid564" || parent_cid === "cid1236" || parent_cid === "cid3" || parent_cid === "cid1140") {
    $.ajax({
        url: "/assets/mobile-sidenav-small-business.html",
        success: function (data) { $(data).prependTo('body');  mobile_menu.init(); },
        dataType: 'html'
        });

} else {

var buildCaHrefEn = function(cid) {
    return '/ca/en/0,,'+cid+',00.html';
};


var isBlackListed = function(cid) {

    if (typeof cid === 'undefined') return true;

    // quick and dirty psuedo 'in_array'
    var blackList = {
        '3789' : true,
        '3648' : true,
        '7595' : true,
        '3800' : true
    };

    return blackList[cid];
};

$(window).load(function(){ // .load

        var theSource = '/ca/responsive/nav/ca_en.personal_banking.json';
        var mobileNavContainer =    "<div tabindex=\"-1\" role=\"navigation\" id=\"mobile-side-nav\" aria-label=\"Mobile Menu\"></div>"
        $(mobileNavContainer).prependTo('body');
        
        $.getJSON(theSource, function(json){ //.getJSON
        var plug = '<h3> <a href="https://www1.scotiaonline.scotiabank.com/online/authentication/authentication.bns" class="sign-on-btn red-btn phone-hide">SIGN IN</a>';
        var holder;
        //plug += '<span> to <em>Scotia OnLine</em> </span>';
        plug += ' <a href="https://login.scotiabank.mobi/b/" class="sign-on-btn red-btn tablet-hide">SIGN IN</a>';
        plug += '</h3>';
        plug += '<ul class="primary-nav" role="menubar">';
        plug += '<li role="menuitem" class="active">';
        plug += '<div class="list-item">';
        plug += '<a href="#" class="home link">';
        plug += '<span class="icon"></span> Home ';
        plug += '</a>';
        plug += '</div>';
        plug += '</li>';
        
        
        for (var i in json.navmenu){ // for i

            if (json.navmenu[i].menu != null){ // if i
                
                for (var j = 1; j < json.navmenu[i].menu.length; j++){ // for j
                    
                    //if this cid is blacklisted skip it -SH
                    if (isBlackListed(json.navmenu[i].menu[j].cid)) continue;

                    plug += '<li role="menuitem" class="level-1">';
                    plug += '<div class="list-item">';
                    plug += "<a href=\"" + buildCaHrefEn(json.navmenu[i].menu[j].cid) + "\" class=\"_" + json.navmenu[i].menu[j].cid + " link\" > <span class=\"icon\"></span>" + json.navmenu[i].menu[j].linkname + "</a>";
                    plug += "<a href=\"#UL2-" + json.navmenu[i].menu[j].cid + "\" class=\"accordion-control\" title=\"Content collapsed: click to expand\">";
                    plug += "<span class=\"divider\"></span>"; 
                    plug += "<span class=\"arrow\"></span>";
                    plug += "</a>";
                    plug += "</div>";
                    
                    if (json.navmenu[i].menu[j].menu != null){ //if ij
                        plug += "<ul id=\"UL2-" + json.navmenu[i].menu[j].cid + "\" role=\"menu\" class=\"level-2\" aria-expanded=\"false\" aria-haspopup=\"true\">";
                        
                        
                        for (var k in json.navmenu[i].menu[j].menu){ // for k
                        
                        //Before we add a heading band we need to first check that there is a menu beneath it requireing a label
                        if (!$.isEmptyObject(json.navmenu[i].menu[j].menu)){ 
                        
                          if (json.navmenu[i].menu[j].menu[k].type !== holder){
                          plug += "<li role=\"menuitem\" class=\"heading\"> <h3>" + json.navmenu[i].menu[j].menu[k].type + "</h3> </li>";
                          }
                          holder = json.navmenu[i].menu[j].menu[k].type;

                        }
                        
                            plug += "<li role=\"menuitem\" class=\"open\">";
                            plug += "<div class=\"list-item\">";
                            plug += "<a href=\"" + buildCaHrefEn(json.navmenu[i].menu[j].cid) + "\" class=\"link\">" + json.navmenu[i].menu[j].menu[k].linkname + "</a>";
                                                        

                            if (!$.isEmptyObject(json.navmenu[i].menu[j].menu[k].menu)){ //only add 'clickable arrow' if there is a submenu
                              plug += "<a href=\"#UL3-" + json.navmenu[i].menu[j].menu[k].cid + "\" class=\"accordion-control\" title=\"Content collapsed: click to expand\"> ";
                              plug += "<span class=\"divider\"></span>";
                              plug += "<span class=\"arrow\"></span>";
                              plug += "</a>";
                            }                           
                            
                            plug += "</div>";
                            
                            if (json.navmenu[i].menu[j].menu[k].menu != null){ //if ijk
                              plug += "<ul id=\"UL3-" + json.navmenu[i].menu[j].menu[k].cid + "\" class=\"level-3\" aria-expanded=\"false\" aria-haspopup=\"true\">";
                              
                              for (var l in json.navmenu[i].menu[j].menu[k].menu){ //for l
                                                                  
                                  plug += "<li role=\"menuitem\"> <a href=\"#\">" + json.navmenu[i].menu[j].menu[k].menu[l].linkname + "</a></li>";
                                  
                              } //for l
                              
                              plug += "</ul> <!--if ijk-->";
                            }
                            
                            
                            plug += "</li>";
                            
                            
                            
                            
                        } // for k
                        
                        
                        }; //if ij
                    
                        
                    plug += "</ul> <!--if ij-->";
                    
                }; // for j
                plug += '</li>';
            }; //if i
            
        } // for i
        
        
        // START: INSERT CONTACT US INFORMATION:
		     plug += '</li>';  
        plug += '</ul>';  
      plug += '<ul class="primary-nav" role="menubar">';
        plug += '<li role="menuitem" class="level-1">';
        plug += '<div class="list-item">'; 
        plug += "<a href=\"" + buildCaHrefEn(json.navmenu[0].menu[0].cid) + "\" class=\"_" + json.navmenu[0].menu[0].cid + " link\" > <span class=\"icon\"></span>" + json.navmenu[0].menu[0].linkname + "</a>";
        plug += "<a href=\"#UL2-" + json.navmenu[0].menu[0].cid + "\" class=\"accordion-control\" title=\"Content collapsed: click to expand\">";
        plug += "<span class=\"divider\"></span>"; 
        plug += "<span class=\"arrow\"></span>";
        plug += "</a>";
        plug += "</div>";
        plug += "<ul id=\"UL2-" + json.navmenu[0].menu[0].cid + "\" role=\"menu\" class=\"level-2\" aria-expanded=\"false\" aria-haspopup=\"true\">";
        plug += "<li role=\"menuitem\" class=\"heading\"> <h3>" + "CONTACT US" + "</h3> </li>";
        plug += "<li role=\"menuitem\" class=\"open\">";
        plug += "<div class=\"list-item\">";
        plug += "<a href=\"" + buildCaHrefEn(json.navmenu[0].menu[0].menu[0].cid) + "\" class=\"link\">" + json.navmenu[0].menu[0].menu[0].linkname + "</a>";    
        plug += '</li>'; 
        plug += "<li role=\"menuitem\" class=\"open\">";
        plug += "<div class=\"list-item\">";
        plug += "<a href=\"" + buildCaHrefEn(json.navmenu[0].menu[0].menu[1].cid) + "\" class=\"link\">" + json.navmenu[0].menu[0].menu[1].linkname + "</a>";    
        plug += '</li>'; 
        plug += "<li role=\"menuitem\" class=\"open\">";
        plug += "<div class=\"list-item\">";
        plug += "<a href=\"" + buildCaHrefEn(json.navmenu[0].menu[0].menu[2].cid) + "\"class=\"link\">" + json.navmenu[0].menu[0].menu[2].linkname + "</a>";    
        plug += '</li>';                 
        plug += "<li role=\"menuitem\" class=\"heading\"> <h3>" + "HAVE QUESTIONS?" + "</h3> </li>";
        plug += "<li role=\"menuitem\" class=\"open\">";
        plug += "<div class=\"list-item\">";
        plug += "<a href=\"" + buildCaHrefEn(json.navmenu[0].menu[0].menu[3].cid) + "\" class=\"link\">" + json.navmenu[0].menu[0].menu[3].linkname + "</a>";    
        plug += '</li>';         
        plug += '</ul>';   
        // END: INSERT CONTACT US INFORMATION:
        
            
        plug += '</li>';  
        plug += '</ul>';  
        plug += '<div class="menu-divider"> &nbsp; </div>';
        plug += '<ul class="secondary-nav">';
        plug += '<li role="menuitem"> <a href="http://www.scotiabank.com/ca/en/0,,1238,00.html"> Business </a> </li>';
        plug += '<li role="menuitem"> <a href="http://www.scotiabank.com/ca/en/0,,5,00.html"> About Scotiabank </a> </li>';
        plug += '<li role="menuitem"> <a href="http://www.scotiabank.com/ca/en/0,,7764,00.html"> More Scotiabank Sites </a> </li>';
        plug += '</ul>';
        plug += '<div class="menu-divider"> &nbsp; </div>';
        plug += '<ul class="footer-nav">';
        plug += '<li role="menuitem"> <a href="http://www.scotiabank.com/ca/en/0,,178,00.html"> Careers </a> </li>';
        plug += '<li role="menuitem"> <a href="http://www.scotiabank.com/ca/en/0,,353,00.html"> Legal </a> </li>';
        plug += '<li role="menuitem"> <a href="http://www.scotiabank.com/ca/en/0,,351,00.html"> Privacy </a> </li>';
        plug += '<li role="menuitem"> <a href="http://www.scotiabank.com/ca/en/0,,352,00.html"> Security </a> </li>';
        plug += '<li role="menuitem"> <a href="http://www.scotiabank.com/ca/en/0,,297,00.html"> Accessibility </a> </li>';
        plug += '<li role="menuitem"> <a href="http://www.scotiabank.com/ca/fr/0,,1001,00.html"> Fran&ccedil;ais </a> </li>';
        plug += '</ul>';
  
        document.getElementById("mobile-side-nav").innerHTML = plug;
        
    }); //.getJSON
});// .load
    
}
    
     mobile_menu.init(); //handled in json load .done
    
    }// .hasClass("is768....

    $(document).keyup(function(e) {
      if (e.keyCode == 27) { 
        mobile_menu.closeMenu();
      }
    });

    $("#search-btn").bind(vmousedown, function(e){
        e.preventDefault();
        e.stopPropagation();
        if (!searchMenuState){
            $("#search").removeClass("phone-hide");
            $("#service-menu-container").addClass("search-open");

            $('#search-query').focus();

            searchMenuState = true;
        }else{
            $("#search").addClass("phone-hide");
            $("#search-btn").focus();
            $("#service-menu-container").removeClass("search-open");
            searchMenuState = false;
        }
    });


    if (majorversion != 2) {
        $(".primary-nav > li > a").bind("click" , function(e){ return false; });
    }




   $(".primary-nav > li > .list-item a.accordion-control").live(vclick , function(e){
    
        var elem = $(this).parent();
        var anchor = $(this);
        setTimeout(function(){
            if(touchmove != true){
                
                if(elem.parent().hasClass("open")){
                    $(".primary-nav .level-1.open").children("ul").attr("aria-expanded","false");
                    $(".primary-nav .level-1.open").removeClass("open");
                    $(".primary-nav .level-2 .open").children("ul").attr("aria-expanded","false");
                    $(".primary-nav .level-2 .open").removeClass("open");
                    elem.parent().focus();

                    if($("html").attr("lang") == "en"){
                        anchor.attr("title", "Content collapsed: click to expand");
                    } else {
                        anchor.attr("title", "Contenu minimisÃ©: cliquer pour maximiser");
                    }


                } else {
                    $(".primary-nav .level-1.open").removeClass("open");
                    $(".primary-nav .level-2 .open").children("ul").attr("aria-expanded","false");
                    $(".primary-nav .level-2 .open").removeClass("open");
                    elem.parent().addClass("open");
                    elem.parent().children("ul").attr("aria-expanded","true");
                    elem.parent().children("ul").children("li").find("a").first().focus();

                    if($("html").attr("lang") == "en"){
                        anchor.attr("title", "Content expanded: click to collapse");
                    } else {
                        anchor.attr("title", "Contenu maximisÃ©: cliquer pour minimiser");
                    }
                }
            }
        }, 100);
    });

    $(".primary-nav .level-2 a.accordion-control").live(vclick, function(e){
        var elem = $(this).parent();
        setTimeout(function(){
            if(touchmove != true){
                if(elem.parent().hasClass("open")){

                    $(".primary-nav .level-2 .open").children("ul").attr("aria-expanded","false");
                    $(".primary-nav .level-2 .open").removeClass("open");
                    elem.focus();

                    if($("html").attr("lang") == "en"){
                        elem.attr("title", "Content collapsed: click to expand");
                    } else {
                        elem.attr("title", "Content collapsed: click to expand");
                    }
                } else {

                    $(".primary-nav .level-2 .open").removeClass("open");
                    elem.parent().addClass("open");
                    elem.parent().children("ul").attr("aria-expanded","true");
                    elem.parent().children("ul").children("li").children("a").first().focus();

                    if($("html").attr("lang") == "en"){
                        elem.attr("title", "Content expanded: click to collapse");
                    } else {
                        elem.attr("title", "Content expanded: click to collapse");
                    }
                }
            }
        },100);
    });

    $(".primary-nav > li > a").live("touchmove",function(e){
        touchmove = true;
    })

    $(".primary-nav > li > a").live("touchstart",function(e){
        touchmove = false;
    })

    $("body").bind("touchmove",function(e){
        touchmove = true;
    });

    $("body").bind("touchstart",function(e){
        touchmove = false;
    });

    //SCROLLING UP FIX ON ANDROID
    $(".accordion a").bind("click", function(e){
        if (!touchmove && $("#wrapper").hasClass("menu")){
            e.preventDefault();
            return false;
        }
    });


   var accordianClick = $(".accordion a").not(".primary-nav .link");
    $(".accordion a").bind(vclick, function(e){
    
        var _this = $(this);
        if (!touchmove && !$("#wrapper").hasClass("menu")){
            var tab = _this.attr("class");
                if($(".tab-controller").hasClass(tab)){
                    $(".tab-controller").removeClass(tab);
                } else {
                    $(".tab-controller").attr("class", "tab-controller "+tab);
                }

                if (!$("#service-menu-container").hasClass("fixed")){
                    $("."+tab+".content").focus();
                    $(window).scrollTop(_this.offset().top - 100);
                    $('#service-menu-container').removeClass("fixed");
                    $('#service-menu-container').addClass("fixed");
                } else {
                    $("."+tab+".content").focus();
                    $(window).scrollTop(_this.offset().top - 50);
                    $('#service-menu-container').removeClass("fixed");
                    $('#service-menu-container').addClass("fixed");
                }
        }
       return false;
    });



    $(".see-more-btn").bind("click", function(e){
        clicked = true;
        var _this = $(this);
        if (!touchmove){
            if(!_this.parents(".more").hasClass("active")){
                var numberActive = $(".more .active".length > 0)

                $(".see-more-btn").children("span").html("more");
                _this.children("span").html("fewer");
                var oldID = $(".more").attr("id");

                $(".more").removeClass("active");
                _this.parents(".more").addClass("active");
                var newID = _this.parents(".more").attr("id");

                _this.parents(".more").focus();

                $(window).scrollTop(_this.parents(".more").offset().top - 50);

               
                
            } else {
                _this.children("span").html("more");
                _this.parents(".more").removeClass("active");

                _this.parents(".more").focus();

                $(window).scrollTop(_this.parents(".more").offset().top - 50);
            }
        }
        return false;

    });

    //SEE MORE ON MONEYBACK
    $("#overview a").bind(vclick, function(e){

        if ($(this).siblings(".additional-info").css("display") == "none"){
            $(this).html("See Less");
            $(this).siblings(".additional-info").show();
        } else {
            $(this).html("See More");
            $(this).siblings(".additional-info").hide();
        }
    });

    /* collapsable Q & A*/
    var programOffers = $(".link").not(".primary-nav .link");
        programOffers.bind(vclick, function(e) {
        if(!$(this).parents(".more").hasClass("active")){
            $(".more").removeClass("active");
            $(this).parents(".more").addClass("active");
        } else {
            $(this).parents(".more").removeClass("active");
        }
        e.preventDefault();
        return false;
    });

    $(".one-col").hover(
          function () {
            $(".one-col").removeClass("hover");
            $(this).addClass("hover");
          },
          function () {
            $(this).removeClass("hover");
          }
    );

    $(".two-col").hover(
          function () {
            $(".two-col").removeClass("hover");
            $(this).addClass("hover");
          },
          function () {
            $(this).removeClass("hover");
          }
    );


    // input clear
    $('input.clear-on-focus').each( function() {

        $(this).data('initValue', $(this).val());

        $(this).focus( function(e) {

            if ($(this).val() === $(this).data('initValue'))
                $(this).val('');
        });
        $(this).blur( function(e) {

            if ($(this).val() === '')
                $(this).val($(this).data('initValue'));
        });
    });
    // font-sizer
    $('#font-size a').click( function(e) {
        e.preventDefault();
        var fontSizer = $('#font-size');
        var selectedClass = $(this).parent().attr('class');
        var className = 'default';

        fontSizer.attr('class', selectedClass);

        if (selectedClass.indexOf('lrg') != -1)
            className = 'lrg';
        if (selectedClass.indexOf('x-lrg') != -1)
            className = 'x-lrg';

        $('#content,#footer').removeClass('default lrg x-lrg').addClass(className);

        $(this).blur();
    });
    // Fix hovers in IE6
    if (isIE6) {
        $('#font-size li,#footer .products li h3').hover( function() {
            $(this).addClass('hover');
        }, function() {
            $(this).removeClass('hover');
        }
        );
    }

    // mega menu & service menu
    $('#mega-menu > li > a,#service-menu > li > a').keydown( function(e) {
        if ($("#search").css("display") != "none"){
            // tabbing forward
            if (!e.shiftKey) {
                if (e.which == 9) {
                    // If we're blurring from the "How do I?" menu item, focus the search field.
                    if ($(this).attr('id')=='how') {
                        e.preventDefault();
                        $(this).parent().removeClass('active');
                        $(this).parent().next().find('#search-query').focus();
                    } else if ($(this).attr('id')=='mm-tab-g' || $(this).parent().is(':last-child')) {
                        e.preventDefault();
                        $(this).parent().removeClass('active');
                        var contentLink = $('#content a').filter(':visible').eq(0);
                        if (contentLink.length) {
                            contentLink.focus();
                        } else {
                            $('#footer a:eq(0)').focus();
                        }
                    } else {
                        var nextTopLevel = $(this).parent().next().find('a:eq(0)');
                        if (nextTopLevel.length) {
                            e.preventDefault();
                            $(this).parent().removeClass('active');
                            nextTopLevel.focus();
                        }
                    }
                }
            }
            //tabbing backward
            else {
                if (e.which == 9) {
                    var prevTopLevel = $(this).parent().prev().find('a:eq(0)');
                    if (prevTopLevel.length) {
                        e.preventDefault();
                        $(this).parent().removeClass('active');
                        prevTopLevel.focus();
                    }
                    if ($(this).parent().is(':first-child')) {
                        $(this).parent().removeClass('active');
                    }
                }
            }
        }
    });
    var menu = {
        services    : $('#service-menu'),
        mega        : $('#mega-menu'),
        signin      : $('#sign-in-panel'),
        sites       : $('#scotia-sites')
    };

    menu.services.data('contentHeight', 265);
    menu.services.data('tabOpen', false);

    menu.mega.data('contentHeight', 280);
    menu.mega.data('tabOpen', false);

    menu.signin.data('contentHeight', 65);
    menu.signin.data('tabOpen', false);
    
    menu.sites.data('contentHeight', 460);
    menu.sites.data('tabOpen', false);
    
    if (navigator.userAgent.match(/mobile/i)) {
        document.body.ontouchstart = function(e) {
            var $target = $(e.target);
            if (jQuery.contains(menu.mega.get(0),$target.get(0)) || jQuery.contains(menu.services.get(0), $target.get(0)) ) {
                return;
            }

            $('#mega-menu,#service-menu,#sign-in-panel,#scotia-sites').find('a.tab').parent().removeClass('active');
            $('#mega-menu li .content, #service-menu li .content, #sign-in-panel li .content, #scotia-sites li .content').hide();
        }
    }

    function activateMenu(menu) {

        if ( ! menu )
            return;

        if ("ontouchstart" in document) {
            // Bind click to close all megamenus and open the clicked one
            var menuItems = menu.find('a.tab');
            menuItems.bind(vclick, function(e) {
                if ($("html").hasClass("is980")){ 
                    e.preventDefault();
                    var $content = $(this).next();
                    // If the user clicked the already active mega menu,
                    // navigate to the url
                    if ($(this).parent().hasClass('active')) {
                        document.location = $(this).attr('href');
                    } 
                    $('#mega-menu,#service-menu,#sign-in-panel,#scotia-sites').find('a.tab').parent().removeClass('active');
                    $(this).parent().addClass('active');

                    // Hide all open megamenus
                    $('#mega-menu li .content, #service-menu li .content, #sign-in-panel li .content, #scotia-sites li .content').hide();
                    // Then show the content for the menu clicked
                    $content.css('height',menu.data('contentHeight')+'px').show();
                } else {
                    if(!touchmove){
                       document.location = $(this).attr('href');
                    }
                }
            });
        } else {
            // capture MENU mouse leave
            menu.mouseleave( function(e) {

                var node = menu.find('li.active'),
                content = node.children('.content');

                content.css('height', 0);
                content.css('border-width', '0');
                content.css('display', 'none');
                node.removeClass('active');

                menu.data('tabOpen', false);
            });
            // default behavior
            var menuItems = menu.children('li');
            menuItems.each( function(i) {

                $(this).children('.content').css('height', '0');

                // capture MENU ITEM mouse enter
                $(this).mouseenter( function(e) {

                    var node = $(e.currentTarget),
                    content = node.children('.content');

                    if (menu.data('tabOpen')) {

                        menu.find('li.active').removeClass('active');
                        content.css('display', 'block');
                        content.css('border-width','1px');
                        content.css('height', menu.data('contentHeight') +'px');
                        node.addClass('active');

                        menu.data('tabOpen', true);
                    } else {

                        menuTimeout = window.setTimeout( function() {

                            content.css('height', '0');
                            content.css('border-width','0');
                            content.css('display', 'block');
                            content.css('border-width','1px');
                            content.animate({
                                height: menu.data('contentHeight')
                            }, 100, 'swing');
                            node.addClass('active');

                            menu.data('tabOpen', true);
                        }, 500);
                    }
                });
                // capture MENU ITEM mouse leave
                $(this).mouseleave( function(e) {

                    var node = $(e.currentTarget),
                    content = node.children('.content');

                    if (menuTimeout)
                        clearTimeout(menuTimeout);

                    $('.content:animated').stop();

                    content.css('height', '0');
                    content.css('border-width','0');
                    content.css('display', 'none');
                    node.removeClass('active');
                });
            });
        }

        // screen reader behavior
        var menuTabs = menu.find('a.tab');
        if (!navigator.userAgent.match(/mobile/i)) {
            menuTabs.each( function(i) {

                $(this).focus( function(e) {

                    menuItems.removeClass('active');
                    $(this).parent().addClass('active');
                    //alert(1);
                });
            });
        }

        // skip & close buttons
        menuItems = menu.children('.content a.skip').add(menu.children('.content a.close'));
        menuItems.click( function(e) {

            var tab = menu.find('li.active');

            tab.removeClass('active');
            tab.next().find('a.tab').focus();
        });
    }
    activateMenu(menu.services);
    activateMenu(menu.mega);
    activateMenu(menu.signin);
    activateMenu(menu.sites);


    // disable dead links
    $('a[href=#]').click( function(e) {
        e.preventDefault();
    });
    learningBar = {
        bar: $('#learning-bar'),
        open: function() {
           /*if (navigator.userAgent.match(/mobile/i))
                return; */
            this.bar.data('auto-opened',true);
            this.bar.addClass('open');
            if (!isIE6) {
                this.bar.find('.content').animate({
                    height:'55px'
                },1000);
             this.bar.find('.content-scene').animate({
                    height: '75px'
                }, 1000);
            } else {
                this.bar.find('.content').height('55px');
             this.bar.find('.content-scene').height('75px');
                this.ie6fix();
            }
            this.bar.find('.content').show();
          this.bar.find('.content-scene').show();
            $('#minimize-learning-bar a').text(this.bar.attr('data-close-text'));
            this.bar.find('.content a').removeAttr('tabindex');
        },
        close: function() {
            this.bar.removeClass('open');
            if (!isIE6) {
                this.bar.find('.content').animate({
                    height:'0px'
                },500,'linear', function() {
                    $(this).hide();
                });
             this.bar.find('.content-scene').animate({
                    height: '0px'
                }, 500, 'linear', function () {
                    $(this).hide();
                });
            } else {
                this.bar.find('.content').height('0px');
             this.bar.find('.content-scene').height('0px');
                this.ie6fix();
            }

            $('#minimize-learning-bar a').text(this.bar.attr('data-open-text'));
            this.bar.find('.content a').attr('tabindex','-1');

        },
        ie6fix: function() {
            var barHeight = this.bar.height();
            this.bar.css('top', $(window).scrollTop() + ($(window).height() - barHeight -2) + "px");
        }
    };

    // Remove skip to page navigation when the page navigation does not exist
    // If the left sidebar doesn't exist, the skip to content link should point to #content, not #content-head
    // Ideally this would be handled by the application and removed from javascript
    if (!$('#side-nav').length) {
        $('#top a[href=#side-nav]').remove();
        $('#top a[href=#content-head]').attr('href','#content');
    }

    // Initialize and enable learning bar
    $('#minimize-learning-bar a').text($('#learning-bar').attr('data-open-text'));
    $('#learning-bar .content a').attr('tabindex','-1');
    $(window).scroll( function() {
        if ($(this).height() + $(this).scrollTop() >= $(document).height() - 500) {
            if (!$('#learning-bar').data('auto-opened')) {
                learningBar.open();
            }
        }
    });
    if (isIE6) {
        $(window).resize( function() {
            learningBar.ie6fix();
        });
    }

    // Minimize learning bar

    $('#minimize-learning-bar').click( function(e) {
        e.preventDefault();
        if (! $(this).parent().hasClass('open')) {
            learningBar.open();
        } else {
            learningBar.close();
        }
    });
    // IE 6
    if (isIE6) {

        // implement fixed positioning for the learning bar
        $(window).scroll( function() {
            learningBar.ie6fix();
        });
        $(document).ready( function() {
            learningBar.ie6fix();
        });
        // Fix hover of question divs
        $('#questions > div').hover( function() {
            if (!$(this).hasClass('active')) {
                $(this).addClass('hover');
            } else {
                $(this).addClass('hover-active');
            }
        }, function() {
            $(this).removeClass('hover hover-active');
        }
        );
    }

    /* Tooltips*/

    $('#help-tooltips strong').hide();
    $('#help-tooltips').hide();

    $('#close-help').live('click', function() {
        $(this).prev().prev().focus().find('img').attr('src','/ca/common/icons/icn-info.png');
        $('#context-help,#close-help').remove();
        return false;
    });
    $('#context-help').live('blur', function() {
        //$(this).closest('.tool-tip').eq(0).focus();
        $(this).prev().focus().find('img').attr('src','/ca/common/icons/icn-info.png');
        $('#context-help,#close-help').remove();
    });
    $('.tool-tip').each( function() {

        $(this).click( function(e) {
            $(this).find('img').attr('src','/ca/common/icons/icn-info-disabled.png');
            $('#context-help, #close-help').remove();

            // Save the reference to the help button, get the href, and the content of the linked <p> element
            var $button = $(this);
            var href = $button.attr('href');
            var content = $(href).html();

            // Create the help item and insert it after the the help button in DOM order
            $button.after('<div id="context-help" role="alertdialog" aria-hidden="false" aria-labelledby="help-title" aria-describedby="help-description"><h3 id="help-title">'+$('#help-tooltips strong').html()+'</h3><div id="help-description">'+content+'</div></div>');
            var $help = $('#context-help');
            $help.find('strong').eq(0).remove();

            // Create the close button and insert it after the help text in DOM order
            $help.after('<a href="#context-help" id="close-help"><img src="/rd/gfx/icn-close.png" alt="Close glossary" /></a>');
            var $close = $('#close-help');

            // Get the top and left position of the help button for positioning the close button and help text, also set the tabindex of the help text to make it focusable

            var $position = $button.position();

            $help
            .css("top",($position.top - 9) + "px")
            .css("left",($position.left + 17) + "px")
            .show();

            closeFix = 2;
            if ($.browser.msie && parseInt($.browser.version)==6 || parseInt($.browser.version)==7) closeFix = 0;

            $close
                .css("top",($position.top - closeFix) + "px")
                .css("left",($position.left + 260) + "px")
                .show();

            var help_el = document.getElementById('context-help');
            help_el.tabIndex = -1;
            help_el.focus();

            $(help_el).keydown( function(e) {
                // ESCAPE key pressed
                if(e.keyCode == 27) {
                    //$(this).prevAll('.help').eq(0).focus();
                    $(this).prev().focus();
                    $('#context-help, #close-help').remove();
                    return false;
                }
            });
            return false;

        });
        //$(this).mouseleave( hideToolTip );
    });
    // collapsable Q & A
    var questions = $('.question');
    questions.bind(vclick, function(e) {
        if (!touchmove){
            var clicked = $(e.target);
            if (clicked.parents('.content').length > 0 || clicked.is('.content'))
                return true;

            var isOpen = ($(this).hasClass('active'))? true : false;

            questions.removeClass('active');
            questions.children(".content").attr("aria-expanded","false");

            if ( ! isOpen ){
                $(this).addClass('active');
                $(this).children(".content").focus();
                $(this).children(".content").attr("aria-expanded","true");
            }

            if (!$("html").hasClass("is980")){
                $(window).scrollTop($(this).offset().top - 50);
            }
        }

        return false;
    }); 
    // disclaimer
    var disclaimer = $('.legal');
    disclaimer.click(function(e){

        var clicked = $(e.target);
        if (clicked.parents('.content').length > 0 || clicked.is('.content')) 
            return true;
        
        var isOpen = ($(this).hasClass('active'))? true : false;
        
        disclaimer.removeClass('active');
        
        if ( ! isOpen )
            $(this).addClass('active');

        return false;
    });
    // tabbed content
    var tabbedContent = $('.tabbed-content'),
    controller,
    tabs;

    tabbedContent.each( function() {

        controller = $(this).find('.tab-controller');
        tabs = controller.find('.tabs a');
        tabs.each( function() {

            $(this).bind("click", function(e) {
                e.preventDefault();
                var className = $(this).parent().attr('class');
                console.log(className);
                controller.attr('class', 'tab-controller ' +className);
                var currentMarker = $('.tabs .current-marker');
                currentMarker.insertBefore($(this));
                //$('div.content.'+className).focus();
                return false;
            });
        });
    });
    
    /*click to tab */
    $('a.open-tab').click(function(e){
    
    var target = $(e.target),
        tab = target.attr('href').substr(5);
    
    $('.tab-controller li.' +tab+ ' a').click();
    });
    
    /* HREF OPEN TAB */
    $(function selectTab(){
        var activeTab = location.href;
        var activeTabID = activeTab.substring(activeTab.lastIndexOf('#') +5);
        $('.tab-controller li.' +activeTabID+ ' a').click();
     });
    
    $(function selectDD(){
        var activeTab = location.href;
        var activeTabID = activeTab.substring(activeTab.lastIndexOf('#') +2);
        $('#q' +activeTabID+ ' a').click();
     });
    
    /*
     * OVERLAYS
     * 
     *  any anchor elements with the CLASS "open-overlay" will open an overlay new.
     *  anchor should have the overlay's content ID in the HREF attribute.
     */
    var overlayMask = $('<div id="overlay-mask"/>');
    $('body').append( overlayMask );
    
    $('a.open-overlay').click(function(e){
        e.preventDefault();
        
        var target = $(e.target),
            overlay = $(target.attr('href')),
            origin = $(this),
            closeBtn = overlay.find('a.close');

        if (target.attr('href') == '#ready-to-apply-overlay') {
            $('#ready-to-apply-overlay').data('launcher',target);
            $('#ready-to-apply-overlay').dialog('open');
            return false;
        }
    
    if (target.attr('href') == '#ready-to-apply-overlay-slf') {
            $('#ready-to-apply-overlay-slf').data('launcher',target);
            $('#ready-to-apply-overlay-slf').dialog('open');
            return false;
        }
        
        if (target.attr('href') == '#ready-to-apply-overlay-btr') {
            $('#ready-to-apply-overlay-btr').data('launcher',target);
            $('#ready-to-apply-overlay-btr').dialog('open');
            return false;
        }
        
     if (target.attr('href') == '#ready-to-apply-overlay-scene') {
            $('#ready-to-apply-overlay-scene').data('launcher',target);
            $('#ready-to-apply-overlay-scene').dialog('open');
            return false;
        }
        
     if (target.attr('href') == '#business-overlay') {
            $('#business-overlay').data('launcher',target);
            $('#business-overlay').dialog('open');
            return false;
        }
        
        if ( overlay.size() > 0 ){
            
            // document state
            $('body').addClass('overlay-open');
            
            // position elements
            overlayMask.css('height',$('body').height());
            overlay.css('left', (($('body').width() - overlay.outerWidth()) / 2) + $(window).scrollLeft() + "px")
            overlay.css('top', (($(window).height() - overlay.outerHeight()) / 2) + $(window).scrollTop() + "px")
            
            overlayMask.show(); 
            overlay.fadeIn(500);
        
            $(document).keydown( function(e) {
                if (e.which == 27) { // Esc key
                    closeOverlay(e);    
                }
            });     
            
            function closeOverlay(e){
                
                e.preventDefault();
                
                overlay.fadeOut( 500, function(){
                    
                    overlayMask.unbind('click.closeOverlay');
                    overlayMask.hide();
                });
                
                $('body').removeClass('overlay-open');
                closeBtn.unbind('click.closeOverlay');
            }
            
            overlayMask.bind('click.closeOverlay', closeOverlay);
            closeBtn.bind('click.closeOverlay', closeOverlay);
        }
    });
    
    // zebra stripe
    $('.zebra-stripe > :odd').each( function() {

        $(this).addClass('odd');
    });
    $('table.zebra-stripe tr:even').addClass('odd');

    $('a.toggleHiddenText').click( function() {
        var prevSpan = $(this).prev();
        if (prevSpan.hasClass('hidden')) {
            prevSpan.removeClass('hidden');
            $(this).text($(this).attr('data-lang-less'));
        } else {
            prevSpan.addClass('hidden');
            $(this).text($(this).attr('data-lang-more'));
        }
        return false;
    });
    return 'Initialized';

}();
if (BNS!='Initialized')
    alert('Page could not initialize.');
    
/**
 * jQuery Cookie plugin
 */
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};


var COOKIE_NAME = 'ie6';

function closeIEMsg() {
    
    $('.overlay').fadeOut(500)
    $('#overlay-mask').css('display', 'none');
    $('.overlay').css('display', 'none');
}

$(window).load(function(){
      
  if ( $.browser.msie && $.browser.version == "6.0") {

     if($.cookie(COOKIE_NAME) == null) {
            $.cookie(COOKIE_NAME, 'active', { expires: 1 }); 
            $('#overlay-mask').css('display', 'block');
            $('.overlay').css('display', 'block');

            $('#overlay-mask').css('height',$('body').height());
            
            $('#overlay-mask').after('<div id="ie6-message" class="overlay"><h2>Still using IE6?</h2><p>We noticed that you\'re still using Internet Explorer 6 as your web browser, which we no longer support. To experience Scotiabank.com at its best, please upgrade to <a href="http://windows.microsoft.com/en-CA/internet-explorer/products/ie/home">latest supported version of Internet Explorer</a>. <a href="#" class="red-btn" onclick="javascript:closeIEMsg(); return false;">Back to Scotiabank.com</a></p></div>');
            
            $('.overlay').css('top', (($(window).height() - $('.overlay').outerHeight()) / 2) + $(window).scrollTop() + 'px');
            $('.overlay').css('left', (($('body').width() - $('.overlay').outerWidth()) / 2) + $(window).scrollLeft() + 'px');
            
            $('.overlay').fadeIn(500);

    }
  }
});
//The code below is to find out language of the page to decide the targetURL for page CID116 and CID1608
    var getQuote_lang = document.documentElement.getAttribute('lang');
        if (getQuote_lang == 'en'){
            var getQuoteURL_1 ="https://hermes.manulife.com/can/affinity/travel/travel.nsf/public/scotialifetravelinsurance?open&as=scotiabank";
            var getQuoteURL_2 ="https://hermes.manulife.com/can/affinity/travel/travel.nsf/public/scotialifetravelinsurance?open&as=scotialife";            
        }
        else if (getQuote_lang == 'fr'){
            var getQuoteURL_1 ="https://hermes.manulife.com/can/affinity/travel/travel.nsf/public/scotialifetravelinsurance_fr?open&as=scotiabank";
            var getQuoteURL_2 ="https://hermes.manulife.com/can/affinity/travel/travel.nsf/public/scotialifetravelinsurance_fr?open&as=scotialife";         
            }
function chkPostalCode() {
        var provPC = document.pc.postalCode.value;
        var regexp = /^\s*[a-ceghj-npr-tvxy]\d[a-ceghj-npr-tv-z](\s)?\d[a-ceghj-npr-tv-z]\d\s*$/i;

        
        if ( provPC.match(regexp) ) {
            provPC = provPC.substr(0, 1)
            provPC = provPC.toUpperCase();
    
            
            if (provPC == "J" || provPC == "H" || provPC =="G") {
                     window.open(getQuoteURL_1,'scotia') 
            } else {
                     window.open(getQuoteURL_2,'scotia') 

                    
            }
            return true;
        } else {
            alert('Please enter a valid postal code.');
            
            return false;
        } 
        
    }
    
//SET SOL Cookie
$('#sign-in-btn').live("click", function(e) {
   $.cookie("sol", '1',  { expires: 90, path: '/' } );
});



//Add Tracking 
var s_account = "scotiabankprod,scotiabankglobal";
// Home Page Carousel
var cURL = window.location.pathname.replace('/ca/en/', '').replace(',00.html', '').replace('1,,', '').replace('0,,', '');


$(".slider li div").each(function (index, value) {
    var sIndex = parseInt(index) + 1;

    linkname = "Homepage Carousel:" + $(this).attr('data-campaign') + ':' + $(this).attr('id') + ':' + cURL + ':' + sIndex;

    $(this).attr('onClick', "var s=s_gi(\'" + s_account + "\');s.linkTrackVars='trackingServer,trackingServerSecure,prop3,eVar3,events';s.trackingServer='omniture.scotiabank.com';s.trackingServerSecure='somniture.scotiabank.com';s.linkTrackEvents='event3';s.prop3=\'" + linkname + "\';s.eVar3=\'" + linkname + "\';s.events=\'event3\';s.tl(this,\'o\',\'" + linkname + "\',null,'navigate');return false;");

    $(this).find('a.red-btn').attr('onClick', "var s=s_gi(\'" + s_account + "\');s.linkTrackVars='trackingServer,trackingServerSecure,prop3,eVar3,events';s.trackingServer='omniture.scotiabank.com';s.trackingServerSecure='somniture.scotiabank.com';s.linkTrackEvents='event3';s.prop3=\'" + linkname + "\';s.eVar3=\'" + linkname + "\';s.events=\'event3\';s.tl(this,\'o\',\'" + linkname + "\',null,'navigate');return false;");
});
//Mega Menu
$("#mega-menu li div.promo").each(function (index, value) {
    var mIndex = parseInt(index) + 1;

    linkname = "Mega Menu:" + $(this).attr('data-campaign') + ':' + $(this).attr('id') + ':' + cURL + ':' + mIndex;

    $(this).find('a').attr('onClick', "var s=s_gi(\'" + s_account + "\');s.linkTrackVars='trackingServer,trackingServerSecure,prop3,eVar3,events';s.trackingServer='omniture.scotiabank.com';s.trackingServerSecure='somniture.scotiabank.com';s.linkTrackEvents='event3';s.prop3=\'" + linkname + "\';s.eVar3=\'" + linkname + "\';s.events=\'event3\';s.tl(this,\'o\',\'" + linkname + "\',null,'navigate');return false;");
});


//Banners
$("#content-body div.banner").each(function (index, value) {

    linkname = "Banner:" + $(this).attr('data-campaign') + ':' + $(this).attr('id') + ':' + cURL;

    $(this).find('a').attr('onClick', "var s=s_gi(\'" + s_account + "\');s.linkTrackVars='trackingServer,trackingServerSecure,prop3,eVar3,events';s.trackingServer='omniture.scotiabank.com';s.trackingServerSecure='somniture.scotiabank.com';s.linkTrackEvents='event3';s.prop3=\'" + linkname + "\';s.eVar3=\'" + linkname + "\';s.events='event3';s.tl(this,\'o\',\'" + linkname + "\',null,'navigate');return false;");



});

function getParameterByName(name) {

    var match = RegExp('[?&]' + name + '=([^&]*)')
        .exec(window.location.search);

    return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;

}
var cid = getParameterByName("cid");

if (cid) {
    $.cookie("bnsCID", cid, {
        expires: 30,
        path: '/'
    });
}

var bnsCID = $.cookie("bnsCID");
if (bnsCID || cid) {
    $(".tid").each(function () {
        var value1 = $(this).attr('href');
        $(this).attr("href", value1 + '&TID=' + bnsCID);
    });

}


if (navigator.userAgent.match(/iPad/i)) {
  $('head').append("<meta name='apple-itunes-app' content='app-id=663438103,app-argument=ios-promo'/>");
} else if (navigator.userAgent.match(/iPhone/i)) {
  $('head').append("<meta name='apple-itunes-app' content='app-id=341151570'/>");
}

var MOBILE_APP_BANNER_ASSET_URI = '/ca/common/';
var MOBILE_APP_BANNER_CLOSE_TIMEOUT = 30 * 86400 * 1000; // 30 days

//$.getScript("/ca/common/js/store.min.js");
/* Copyright (c) 2010-2013 Marcus Westin */

(function(e){function o(){try{return r in e&&e[r]}catch(t){return!1}}var t={},n=e.document,r="localStorage",i="script",s;t.disabled=!1,t.set=function(e,t){},t.get=function(e){},t.remove=function(e){},t.clear=function(){},t.transact=function(e,n,r){var i=t.get(e);r==null&&(r=n,n=null),typeof i=="undefined"&&(i=n||{}),r(i),t.set(e,i)},t.getAll=function(){},t.forEach=function(){},t.serialize=function(e){return JSON.stringify(e)},t.deserialize=function(e){if(typeof e!="string")return undefined;try{return JSON.parse(e)}catch(t){return e||undefined}};if(o())s=e[r],t.set=function(e,n){return n===undefined?t.remove(e):(s.setItem(e,t.serialize(n)),n)},t.get=function(e){return t.deserialize(s.getItem(e))},t.remove=function(e){s.removeItem(e)},t.clear=function(){s.clear()},t.getAll=function(){var e={};return t.forEach(function(t,n){e[t]=n}),e},t.forEach=function(e){for(var n=0;n<s.length;n++){var r=s.key(n);e(r,t.get(r))}};else if(n.documentElement.addBehavior){var u,a;try{a=new ActiveXObject("htmlfile"),a.open(),a.write("<"+i+">document.w=window</"+i+'><iframe src="/favicon.ico"></iframe>'),a.close(),u=a.w.frames[0].document,s=u.createElement("div")}catch(f){s=n.createElement("div"),u=n.body}function l(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(s),u.appendChild(s),s.addBehavior("#default#userData"),s.load(r);var i=e.apply(t,n);return u.removeChild(s),i}}var c=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");function h(e){return e.replace(/^d/,"___$&").replace(c,"___")}t.set=l(function(e,n,i){return n=h(n),i===undefined?t.remove(n):(e.setAttribute(n,t.serialize(i)),e.save(r),i)}),t.get=l(function(e,n){return n=h(n),t.deserialize(e.getAttribute(n))}),t.remove=l(function(e,t){t=h(t),e.removeAttribute(t),e.save(r)}),t.clear=l(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(r);for(var n=0,i;i=t[n];n++)e.removeAttribute(i.name);e.save(r)}),t.getAll=function(e){var n={};return t.forEach(function(e,t){n[e]=t}),n},t.forEach=l(function(e,n){var r=e.XMLDocument.documentElement.attributes;for(var i=0,s;s=r[i];++i)n(s.name,t.deserialize(e.getAttribute(s.name)))})}try{var p="__storejs__";t.set(p,p),t.get(p)!=p&&(t.disabled=!0),t.remove(p)}catch(f){t.disabled=!0}t.enabled=!t.disabled,typeof module!="undefined"&&module.exports&&this.module!==module?module.exports=t:typeof define=="function"&&define.amd?define(t):e.store=t})(Function("return this")());

//$.getScript("/ca/common/js/app-banner-new.js");
!function(){if(navigator.userAgent.match(/Android/i)){var e=store.get("mobile-app-banner-last-closed"),a=(new Date).getTime();if(!(null!=e&&e+MOBILE_APP_BANNER_CLOSE_TIMEOUT>a)){var n=jQuery('<div id="mobile-app-banner" />'),p=jQuery('<div class="mobile-app-banner-wrapper clearfix" />'),i=jQuery('<div class="mobile-app-banner-content clearfix" />');i.click(function(){window.location=jQuery(this).find("a.red-btn").attr("href")});var r=jQuery("<img />");r.attr("src",MOBILE_APP_BANNER_ASSET_URI+"/icons/icon-scotiabank-app.png"),r.attr("alt","Scotiabank Mobile Banking App"),i.append(jQuery('<div class="mobile-app-banner-icon" />').append(r));var o=jQuery('<div class="mobile-app-banner-description" />');o.append("<h2>Scotiabank Mobile&nbsp;Banking&nbsp;App</h2>"),o.append("<p>Open and see how Scotiabank\u2019s award-winning app meets your needs for balance info on the&nbsp;go.</p>"),i.append(o);var t=jQuery('<div class="mobile-app-banner-buttons" />'),s=jQuery('<a class="red-btn"><span>View</span></a>');s.attr("href","https://play.google.com/store/apps/details?id=com.scotiabank.mobile"),s.click(function(e){e.stopPropagation()}),t.append(s);var l=jQuery('<a href="#" class="close-btn">Close</a>');l.click(function(){return n.slideUp(450),store.enabled&&store.set("mobile-app-banner-last-closed",(new Date).getTime()),!1}),t.append(l),i.append(t),p.append(i),n.append(p),jQuery("body").prepend(n)}}}();
/*
!function(){var e=store.get("mobile-app-banner-last-closed"),a=(new Date).getTime();if(!(null!=e&&e+MOBILE_APP_BANNER_CLOSE_TIMEOUT>a)){var n=jQuery('<div id="mobile-app-banner" />'),p=jQuery('<div class="mobile-app-banner-wrapper clearfix" />'),i=jQuery('<div class="mobile-app-banner-content clearfix" />');i.click(function(){window.location=jQuery(this).find("a.red-btn").attr("href")});var r=jQuery("<img />");r.attr("src",MOBILE_APP_BANNER_ASSET_URI+"/icons/icon-scotiabank-app.png"),r.attr("alt","Scotiabank Mobile Banking App"),i.append(jQuery('<div class="mobile-app-banner-icon" />').append(r));var o=jQuery('<div class="mobile-app-banner-description" />');o.append("<h2>Scotiabank Mobile&nbsp;Banking&nbsp;App</h2>"),o.append("<p>Open and see how Scotiabank\u2019s award-winning app meets your needs for balance info on the&nbsp;go.</p>"),i.append(o);var t=jQuery('<div class="mobile-app-banner-buttons" />'),s=jQuery('<a class="red-btn"><span>View</span></a>');s.attr("href","https://play.google.com/store/apps/details?id=com.scotiabank.mobile"),s.click(function(e){e.stopPropagation()}),t.append(s);var l=jQuery('<a href="#" class="close-btn">Close</a>');l.click(function(){return n.slideUp(450),store.enabled&&store.set("mobile-app-banner-last-closed",(new Date).getTime()),!1}),t.append(l),i.append(t),p.append(i),n.append(p),jQuery("body").prepend(n)}}();*/