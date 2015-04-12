var parent_cid = $(document.body).attr("id");
var currentBrowser = $('html').attr("id");

console.log('testing testing');

if ( parent_cid === "cid2" || parent_cid === "cid6" || parent_cid === "cid7" || parent_cid === "cid8" || parent_cid === "cid9" || parent_cid === "cid10" || parent_cid === "cid12" ||parent_cid === "cid301" ||  parent_cid === "cid1070" || parent_cid === "cid1026" || parent_cid === "cid7595" || parent_cid === "cid7764" || parent_cid === "ID234"  || parent_cid === "cid3939" || parent_cid === "cid234"  || parent_cid === "cid3937"  || parent_cid === "cid587" || parent_cid === "cid575"  || parent_cid === "cid1181" || parent_cid === "cid610"  || parent_cid === "cid1159" || parent_cid === "cid580"|| parent_cid === "cid543"|| parent_cid === "cid4635"  || parent_cid === "cid564" || parent_cid === "cid1236"  || parent_cid === "cid3" || parent_cid === "cid1140" || parent_cid === "cid710"  || parent_cid === "cid8160"
|| parent_cid === "cid8238"
|| parent_cid === "cid8237"
|| parent_cid === "cid8239"
|| parent_cid === "cid8241"
|| parent_cid === "cid8288"
|| parent_cid === "cid8289"
|| parent_cid === "cid8291") {
    //personal banking
    
    if (currentBrowser === "ie7" || currentBrowser === "ie8" || currentBrowser === "ie9" || !(/Mobile Safari|Android|webOS|iPhone|iPad|iPod|BlackBerry|BB10|IEMobile|Opera Mini/i.test(navigator.userAgent) )) {
        var scriptc = document.createElement('script');
        scriptc.type = 'text/javascript';
        scriptc.src = '/assets/global.js';
        scriptc.id = 'rawr';
        $('body')[0].appendChild(scriptc);


    } else {
        //responsive
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '/assets/global.responsive.js';
        script.id = 'rawra';
        $('body')[0].appendChild(script);

    }

} else {
    //rest of site	
    var scriptc = document.createElement('script');
    scriptc.type = 'text/javascript';
    scriptc.src = '/assets/global.js';
    scriptc.id = 'rawr';
    $('body')[0].appendChild(scriptc);

}