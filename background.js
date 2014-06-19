
/*
 *
 * 
 *   
 */


$(document).ready(function () {
    
    //  BigInteger.
    $.get(chrome.extension.getURL('js/external/BigInteger.min.js'),
        function (data) {
            //  Подключаем стили.
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.innerHTML = data;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    );
    
    //  MD5
    $.get(chrome.extension.getURL('js/external/md5.min.js'),
        function (data) {
            //  Подключаем стили.
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.innerHTML = data;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    );
    
    //  Inject script.
    $.get(chrome.extension.getURL('js/inject.js'),
        function (data) {
            //  Подключаем стили.
            var preloaderUrl = chrome.extension.getURL("css/inject.css");
            var link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", preloaderUrl);
            document.getElementsByTagName("head")[0].appendChild(link);
            //  js.
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.innerHTML = data;
            document.getElementsByTagName("head")[0].appendChild(script);
            document.getElementsByTagName("body")[0].setAttribute("onLoad", "onPageLoad();");
            document.getElementsByTagName("body")[0].setAttribute("onhashchange", "onhashchange();");
        }
    );

    
});


