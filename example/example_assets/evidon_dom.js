$(document).ready(function() {

	var g = 832,
        i = 2437,
        a = false,
        h = document,
        j = h.getElementById("_bapw-link"),
        e = (h.location.protocol == "https:"),
        f = (e ? "https" : "http") + "://",
        c = f + "c.betrad.com/pub/";
    function b(k) {
        var d = new Image();
        d.src = f + "l.betrad.com/pub/p.gif?pid=" + g + "&ocid=" + i + "&i" + k + "=1&r=" + Math.random()
    }
    if(document.getElementById("_bapw-icon") != null){

    h.getElementById("_bapw-icon").src = c + "icon1.png";
   } 
    j.onmouseover = function () {
        if (/#$/.test(j.href)) {
            j.href = "http://info.evidon.com/pub_info/" + g + "?v=1"
        }
    };
    j.onclick = function () {
        var k = window._bap_p_overrides;

        function
        d(n, q) {
            var o = h.getElementsByTagName("head")[0] || h.documentElement,
                m = a,
                l = h.createElement("script");

            function p() {
                l.onload = l.onreadystatechange = null;
                o.removeChild(l);
                q()
            }
            l.src = n;
            l.onreadystatechange = function () {
                if (!m && (this.readyState == "loaded" || this.readyState == "complete")) {
                    m = true;
                    p()
                }
            };
            l.onload = p;
            o.insertBefore(l, o.firstChild)
        }
        if (e || (k && k.hasOwnProperty(g) && k[g].new_window)) {
            b("c");
            return true
        }
        this.onclick = "return " + a;
        d(f + "ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js", function () {
            d(c + "pub2.js", function () {
                BAPW.i(j, {
                    pid: g,
                    ocid: i
                })
            })
        });
        return a
    };
    b("i")

});
