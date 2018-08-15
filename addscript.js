var script = document.createElement("script");


script.text = "'use strict';" +

"function extractHostname(url) {" +
"    var hostname;" +
"    if (url.indexOf('://') > -1) {" +
"        hostname = url.split('/')[2];" +
"    }" +
"    else {" +
"        hostname = url.split('/')[0];" +
"    }" +
"    hostname = hostname.split(':')[0];" +
"    return hostname;" +
"}" +
"function getCORS(url, success, error) {" +
"    var xhr = new XMLHttpRequest();" +
"    if (!('withCredentials' in xhr)) xhr = new XDomainRequest(); " +
"    xhr.open('GET', url);" +
"    xhr.onload = success;" +
"    xhr.onerror = error;"+
"    xhr.send();" +
"    return xhr;" +
"}" +

    "document.onVideoReady = function () {" +        

	//" console.log(extractHostname('http://mediaservicesehc.streaming.mediaservices.windows.net/areaareaererae/arara/mnifest'));" +
    "   if (typeof (ehplayer) != 'undefined') {" +
    "       ehplayer.stashedsetup = ehplayer.setup;" +
    "       ehplayer.setup = function (r, e, s, h, c, l, a, v, y) {" +
    "           var listMediaFilesUrls = [];" +
    "            listMediaFilesUrls.push({" +
    "                key:   'mediaservicesehc.streaming.mediaservices.windows.net'," +
    "                value: 'mediaservicesehc2.streaming.mediaservices.windows.net:8888'" +
    "            });" +
	"			listMediaFilesUrls.push({" +
    "                key:   'mediaservicesmc.streaming.mediaservices.windows.net'," +
    "                value: 'mediaservicesmc2.streaming.mediaservices.windows.net:8888'" +
    "            });" +
    "            var result = listMediaFilesUrls.filter(function(obj) {" +     
    "                return obj.key === extractHostname(e.videoUrl);" +     
    "            });    " +     
    "           if(result.length > 0) {" +
    "               try {" +
    "               getCORS('http://' + result[0].value, function(request) {"+
    "                    if(request.currentTarget.status === 200) {"+
    "                       var videoUrl = e.videoUrl; " +    
    "                       videoUrl = videoUrl.replace(result[0].key, result[0].value);" +
    "                       e.videoUrl = videoUrl; " +
    "                       ehplayer.stashedsetup(r, e, s, h, c, l, a, v, y);" +
    "                    }"+
    "                    else {" +
    "                       ehplayer.stashedsetup(r, e, s, h, c, l, a, v, y);" +       
    "                    }" +
    "                }, function() { " +
    "                       console.log('error'); " +
    "                       ehplayer.stashedsetup(r, e, s, h, c, l, a, v, y); });" +
    "               } catch(error) { console.log(error); }" +
    "           }" +
    "           else {" +
    "               ehplayer.stashedsetup(r, e, s, h, c, l, a, v, y);" +            
    "           }" +
    "       };" +
    "   } else {" +
    "   }" +
    "};";
    document.documentElement.appendChild(script);