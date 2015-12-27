function addScript(srcUrl) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'UTF-8');
    script.setAttribute('async', 'true');
    script.setAttribute('src', srcUrl);
    document.documentElement.appendChild(script);
    return script;
}

if (typeof window.lyricsScript === 'undefined') {
    addScript('https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js');
    //addScript('js/jquery.ajax-cross-origin.min.js');
    addScript('https://raw.githubusercontent.com/padolsey-archive/jquery.fn/master/cross-domain-ajax/jquery.xdomainajax.js');
    var script = addScript('https://mcmanuellp.github.io/lyrics/lyricscrawler.js');
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
