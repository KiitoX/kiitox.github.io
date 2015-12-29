var tab_prefix = 'tab';
var tab_id_prefix = 't';

var default_page = 'tab_home';

//sets url hash to #id
function goTo(id) {
    "use strict";
    window.location.hash = "#" + id;
}
//sets loading progressbar progress or hides it
function setLoading(progress) {
    "use strict";
    var loading = document.getElementById('loading');
    if (progress === -1 || progress > 100) {
        loading.style.height = '0px';
        loading.MaterialProgress.setProgress(0);
    } else {
        loading.style.height = '4px';
        loading.MaterialProgress.setProgress(progress);
    }
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
            } else {
                document.getElementById(content_id).innerHTML = error0 + objxml.status + " " + objxml.statusText + error1;
            }
            setLoading(-1);
        }
    };
    objXml.open("GET", './pages/' + id + '.html', true);
    objXml.send();
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
//init all things to do on load
window.addEventListener('load', function () {
    startContent();
});