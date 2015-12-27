if (typeof window.lyricsScript === 'undefined') {
    var script = '',
        scriptUrls = ['https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js',
                    /*'js/jquery.ajax-cross-origin.min.js'),*/
                      'https://raw.githubusercontent.com/padolsey-archive/jquery.fn/master/cross-domain-ajax/jquery.xdomainajax.js',
                      'https://mcmanuellp.github.io/lyrics/lyricscrawler.js'];/*has to be last...*/
    for (i = 0; i < scriptUrls.length; i++) {
        script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('charset', 'UTF-8');
        script.setAttribute('async', 'true');
        script.setAttribute('src', scriptUrls[i]);
        document.documentElement.appendChild(script);
    }
    script.onload = script.onreadystatechange = function () {
        var rs = script.readyState;
        if (!rs || rs === 'loaded' || rs === 'complete') {
            script.onload = script.onreadystatechange = null;
            init();
        }
    };
} else {
    init();
}
