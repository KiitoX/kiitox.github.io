if (typeof window.lyricsScript === 'undefined') {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'UTF-8');
    script.setAttribute('async', 'true');
    script.setAttribute('src', 'https://mcmanuellp.github.io/lyrics/lyricscrawler.js');
    document.documentElement.appendChild(script);
    script.onload = script.onreadystatechange = function () {
        var rs = script.readyState;
        if (!rs || rs === 'loaded' || rs === 'complete') {
            script.onload = script.onreadystatechange = null;
            lyricsScript('https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js');
            lyricsScript('https://raw.githubusercontent.com/padolsey-archive/jquery.fn/master/cross-domain-ajax/jquery.xdomainajax.js');
            /*lyricsScript('js/jquery.ajax-cross-origin.min.js');*/
            lyricsScript('lyricsjquery.js')
            init();
        }
    };
} else {
    init();
}
