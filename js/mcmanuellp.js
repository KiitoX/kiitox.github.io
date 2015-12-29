var content_id = 'content';

//dynamically resizes content to window if necessary
function expandToWindow() {
    "use strict";
    var minH = window.innerHeight;
    minH -= document.getElementById("s1").offsetHeight;
    minH -= 32;/*top and bottom margin of content block*/
    minH -= document.getElementById("s2").offsetHeight;
    document.getElementById(content_id + '_').style.minHeight = minH + "px";
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
        buttonsSave, scriptSave, contentSave,
        elements0, elements0save,
        elements1, elements1save,
        i = 0;
    buttonsSave = document.querySelector('.mdl-layout__header-row > .mdl-navigation').innerHTML;
    document.querySelector('.mdl-layout__header-row > .mdl-navigation').innerHTML = '';
    scriptSave = document.getElementById('no_assemble').innerHTML;
    document.getElementById('no_assemble').innerHTML = '';
    contentSave = document.getElementById(content_id + '_').innerHTML;
    document.getElementById(content_id + '_').innerHTML = '<div style="width:100%;height:100%;" id="content"></div>';
    elements0 = document.getElementById('ttab').children;
    elements0save = document.getElementById('ttab').innerHTML;
    for (i = 0; i < elements0.length; i++) {
        elements0[i].setAttribute('href', url + elements0[i].getAttribute('id').substr(1));
        elements0[i].removeAttribute('onclick');
    }
    elements1 = document.querySelector('.mdl-layout__drawer > .mdl-navigation').children;
    elements1save = document.querySelector('.mdl-layout__drawer > .mdl-navigation').innerHTML;
    for (i = 0; i < elements1.length; i++) {
        if (elements1[i].tagName !== 'HR') {
            elements1[i].setAttribute('href', url + elements1[i].getAttribute('href').substr(1));
            elements1[i].removeAttribute('onclick');
        }
    }
    pageHtml = '<!doctype html>\n' + document.documentElement.outerHTML;
    download(pageHtml, fileName, 'text/plain');
    document.querySelector('.mdl-layout__header-row > .mdl-navigation').innerHTML = buttonsSave;
    document.getElementById('no_assemble').innerHTML = scriptSave;
    document.getElementById(content_id + '_').innerHTML = contentSave;
    document.getElementById('ttab').innerHTML = elements0save;
    document.querySelector('.mdl-layout__drawer > .mdl-navigation').innerHTML = elements1save;
}