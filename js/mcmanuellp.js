var tab_prefix = 'tab';
var tab_id_prefix = 't';

var content_id = 'content';

var default_page = 'tab_home';

//dynamically resizes content to window if necessary
function expandToWindow() {
    var minH = window.innerHeight;
    minH -= document.getElementById("s1").offsetHeight;
    minH -= 32;/*top and bottom margin of content block*/
    minH -= document.getElementById("s2").offsetHeight;
    document.getElementById(content_id + '_').style.minHeight = minH + "px";
}
//disables all tabs
function noTabActive() {
    var tabs = document.getElementById(tab_id_prefix + tab_prefix).children;
    for (i = 0; i < tabs.length; i++) {
        tabs[i].className = "mdl-layout__tab";
    }
}
//sets loading progressbar progress or hides it
function setLoading(progress) {
    var loading = document.getElementById('loading');
    if (progress === -1 || progress > 100) {
        loading.style.height = '0px';
        loading.MaterialProgress.setProgress(0);
    } else {
        loading.style.height = '4px';
        loading.MaterialProgress.setProgress(progress);
    }
}
//sets url hash to #id
function goTo(id) {
    window.location.hash = "#" + id;
}
//toggles drawer
function setDrawer(bool) {
    document.querySelector('.mdl-layout__drawer').classList.toggle("is-visible", bool);
    document.querySelector('.mdl-layout__obfuscator').classList.toggle("is-visible", bool);
}
//loads subpage id.html
function loadContent(id) {
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
            } else {
                document.getElementById(content_id).innerHTML = error0 + objxml.status + " " + objxml.statusText + error1;
            }
            setLoading(-1);
        }
    };
    objXml.open("GET", './pages/' + id + '.html', true);
    objXml.send();
}
//event register to load correct subpage on hashchange
window.addEventListener('hashchange', function () {
    loadContent(window.location.hash.substring(1));
});
//loads initial subpage and sets initial hash
function startContent() {
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
//bookmarklet js load function
function setLink() {
    var objXml = new XMLHttpRequest();
    objXml.onreadystatechange = function () {
        setLoading(objXml.readyState * 25);
        if (objXml.readyState === 4) {
            if (objXml.status === 200) {
                document.getElementById('bookmarklet').href = 'javascript:(function(){' + objXml.responseText +  '})();';
            } else {
                document.getElementById('bookmarklet').innerHTML = 'Couldn&#39;t load bookmarklet &#59;&#40;';
            }
            setLoading(-1);
        }
    };
    objXml.open('GET', './lyrics/js-bookmark-applet.js', true);
    objXml.send();
}
//checks webkit compatibility and displays notification
function checkChromium() {
    if (!window.chrome) {
        document.getElementById("noChrome").style.display = "block";
    }
}
//hides webkit compatibility message
function hideCMessage() {
    document.getElementById("noChrome").style.display = "none";
}
//adds swipe to open/close drawer to element
function addDrawerSwipe(element, bool) {
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
    var touchsurface1 = document.getElementById('swipeable1'),
        touchsurface2 = document.getElementById('swipeable2'),
        touchsurface3 = document.querySelector('.mdl-layout__obfuscator');
    
    startContent();
    expandToWindow();
    checkChromium();
    addDrawerSwipe(touchsurface1, true);
    addDrawerSwipe(touchsurface2, false);
    addDrawerSwipe(touchsurface3, false);
});