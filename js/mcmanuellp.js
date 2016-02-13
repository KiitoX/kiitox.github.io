var content_id = 'content';

var tab_prefix = 'tab';
var tab_id_prefix = 't';

var default_page = 'tab_home';

var exec_img_id = 'exec_img';

//sets loading progressbar progress or hides it
function setLoading(progress) {
    "use strict";
    var loading = document.getElementById('loading');
    if (loading.MaterialProgress !== undefined) {
        if (progress === -1 || progress > 100) {
            loading.style.height = '0px';
            loading.MaterialProgress.setProgress(0);
        } else {
            loading.style.height = '4px';
            loading.MaterialProgress.setProgress(progress);
        }
    } else {
        loading.style.height = '0px';
    }
}
//sets url hash to #id
function goTo(id) {
    "use strict";
    window.location.hash = "#" + id;
}
//disables all tabs
function noTabActive() {
    "use strict";
    var tabs = document.getElementById(tab_id_prefix + tab_prefix).children,
        i = 0;
    for (i = 0; i < tabs.length; i++) {
        tabs[i].className = "mdl-layout__tab";
    }
}
//loads subpage id.html
function loadContent(id) {
    "use strict";
    var loading = document.getElementById("_loading").innerHTML,
        error0  = "<p style='text-align:center;color:lightcoral;margin:20px;'>Couldn't load page content.<br>ERROR: ",
        error1  = "</p>",
        objXml = new XMLHttpRequest();
    setDrawer(false);
    document.getElementById(content_id).innerHTML = loading;
    setLoading(0);
    objXml.onreadystatechange = function () {
        setLoading(objXml.readyState * 25);
        if (objXml.readyState === 4) {
            if (objXml.status === 200) {
                document.getElementById(content_id).innerHTML = objXml.responseText;
                componentHandler.upgradeDom();
            } else if (objXml !== undefined) {
                document.getElementById(content_id).innerHTML = error0 + objXml.status + " : " + (objXml.statusText.length > 0 ? objXml.statusText : 'Unknown Error') + error1;
            } else {
                document.getElementById(content_id).innerHTML = error0 + '-1 : Unknown Error' + error1;
            }
            setLoading(-1);
        }
    };
    objXml.open("GET", './pages/' + id + '.html', true);
    objXml.send();
}
//execute function and remove debug img
function execAndClean() {
    for (var i = 0; i < arguments.length; i++) {
        arguments[i]();
    }
    console.log('finished executing loaded page script functions');
    var img = document.getElementById(exec_img_id);
    img.parentNode.removeChild(img);
}
//loads initial subpage and sets initial hash
function startContent() {
    "use strict";
    var pg = window.location.hash.substring(1);
    if (pg === null || pg.length < 3) {
        pg = default_page;
    }
    if (pg.substr(0, 3) === tab_prefix) {
        try {
            document.getElementById("t" + pg).classList.add("is-active");
        } catch (ex) {}
    }
    goTo(pg);
    loadContent(pg);
}
//event register to load correct subpage on hashchange
window.addEventListener('hashchange', function () {
    "use strict";
    loadContent(window.location.hash.substring(1));
});
//dynamically resizes content to window if necessary
function expandToWindow() {
    "use strict";
    var minH = window.innerHeight,
        minW = window.innerWidth;
    minH -= document.getElementById("s1").offsetHeight;
    minH -= 32;/*top and bottom margin of content block*/
    minH -= document.getElementById("s2").offsetHeight;
    document.getElementById(content_id + '_').style.minHeight = minH + "px";
    document.getElementById(content_id + '_').style.marginBottom = document.getElementById("s2").offsetHeight + 8 + "px";
    document.getElementById("s2").style.width = minW - 32 + "px";
}
//toggles drawer
function setDrawer(bool) {
    "use strict";
    document.querySelector('.mdl-layout__drawer').classList.toggle("is-visible", bool);
    document.querySelector('.mdl-layout__obfuscator').classList.toggle("is-visible", bool);
}
//bookmarklet js load function
function setLink() {
    "use strict";
    var objXml = new XMLHttpRequest();
    objXml.onreadystatechange = function () {
        if (objXml.readyState === 4) {
            if (objXml.status === 200) {
                document.getElementById('bookmarklet').href = 'javascript:(function(){' + objXml.responseText +  '})();';
            } else {
                document.getElementById('bookmarklet').innerHTML = 'Couldn&#39;t load bookmarklet &#59;&#40;';
            }
        }
    };
    objXml.open('GET', './lyrics/js-bookmark-applet.js', true);
    objXml.send();
}
//checks webkit compatibility and displays notification
function checkChromium() {
    "use strict";
    if (!window.chrome) {
        document.getElementById("noChrome").style.display = "block";
    }
}
//hides webkit compatibility message
function hideCMessage() {
    "use strict";
    document.getElementById("noChrome").style.display = "none";
}
//adds swipe to open/close drawer to element
function addDrawerSwipe(element, bool) {
    "use strict";
    var startX,
        startY,
        dist,
        threshold = 100, //required min distance to be considered swipe
        restraint = 80, // mav vertical distance
        allowedTime = 200, // max time allowed to travel that distance
        elapsedTime,
        startTime;
    
    function handleswipe(isrightswipe) {
        if (isrightswipe) {
            setDrawer(bool);
        }
    }
    
    element.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0];
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
    }, false);
    
    element.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0],
            swiperightBol = false;
        dist = touchobj.pageX - startX;
        elapsedTime = new Date().getTime() - startTime;
        if (bool) {
            swiperightBol = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= restraint);
        } else {
            swiperightBol = (elapsedTime <= allowedTime && dist <= -threshold && Math.abs(touchobj.pageY - startY) <= restraint);
        }
        handleswipe(swiperightBol);
        if (swiperightBol) {
            e.preventDefault();
        }
    }, false);
}
//init all things to do on load
window.addEventListener('load', function () {
    "use strict";
    var touchsurface1 = document.getElementById('swipeable1'),
        touchsurface2 = document.getElementById('swipeable2'),
        touchsurface3 = document.querySelector('.mdl-layout__obfuscator');
    
    expandToWindow();
    checkChromium();
    addDrawerSwipe(touchsurface1, true);
    addDrawerSwipe(touchsurface2, false);
    addDrawerSwipe(touchsurface3, false);
});
//lib function to save text
function download(text, name, type) {
    "use strict";
    var a = document.createElement("a"),
        file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}
//assemble full static webpage
function assemble() {
    "use strict";
    var pageHtml = '',
        fileName = document.location.hash.substr(1) + '.html',
        url = 'https://mcmanuellp.github.io/',
        elements0, elements1, elements2, elements1save = [], elements2Save = [],
        i = 0;
    document.querySelector('.mdl-layout__header-row > .mdl-navigation > .mdl-navigation__link').style.display = 'none';
    document.getElementById('no_assemble').innerHTML = '';
    elements0 = document.getElementById('ttab').children;
    for (i = 0; i < elements0.length; i++) {
        elements0[i].setAttribute('href', url + elements0[i].getAttribute('id').substr(1));
        elements0[i].setAttribute('onclick', '');
    }
    elements1 = document.querySelector('.mdl-layout__drawer > .mdl-navigation').children;
    for (i = 0; i < elements1.length; i++) {
        if (elements1[i].tagName !== 'HR') {
            elements1save[i] = elements1[i].getAttribute('href').substr(1);
            elements1[i].setAttribute('href', url + elements1[i].getAttribute('href').substr(1));
            elements1[i].setAttribute('onclick', '');
        }
    }
    elements2 = document.querySelectorAll('[data-upgraded]');
    for (i = 0; i < elements2.length; i++) {
        elements2Save[i] = elements2[i].getAttribute('data-upgraded');
        elements2[i].removeAttribute('data-upgraded');
    }
    pageHtml = '<!doctype html>\n' + document.documentElement.outerHTML;
    download(pageHtml, fileName, 'text/plain');
    document.querySelector('.mdl-layout__header-row > .mdl-navigation > .mdl-navigation__link').style.display = 'block';
    for (i = 0; i < elements0.length; i++) {
        elements0[i].setAttribute('href', '#home');
        elements0[i].setAttribute('onclick', 'goTo("' + elements0[i].getAttribute('id').substr(1) + '");');
    }
    for (i = 0; i < elements1.length; i++) {
        if (elements1[i].tagName !== 'HR') {
            elements1[i].setAttribute('href', '#' + elements1save[i]);
            elements1[i].setAttribute('onclick', 'noTabActive();goTo("' + elements1save[i] + '");');
        }
    }
    for (i = 0; i < elements2.length; i++) {
        elements2[i].setAttribute('data-upgraded', elements2Save[i]);
    }
}
