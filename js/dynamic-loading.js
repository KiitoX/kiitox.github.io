//sets loading progressbar progress or hides it
function setLoading(progress) {
    var loading = document.getElementById(loading_id);
    if (loading.MaterialProgress !== undefined) {
        if (progress < 0 || progress > 100) {
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
function go_to(id) {
    window.location.hash = "#" + id;
}
//disables all tabs
function noTabActive() {
    var tabs = document.getElementById(tab_id_prefix + tab_prefix).children,
        i = 0;
    for (i = 0; i < tabs.length; i++) {
        tabs[i].className = "mdl-layout__tab";
    }
}
//loads subpage id.html
function loadContent(id) {
    var loading = document.getElementById(loading_temp_id).innerHTML,
        error0  = "<p style='text-align:center;color:lightcoral;margin:20px;'>Couldn't load page content.<br>ERROR: ",
        error1  = "</p>",
        objXml = new XMLHttpRequest();
    resize_elements = [];
    setDrawer(false);
    document.getElementById(content_id).innerHTML = loading;
    setLoading(0);
    objXml.onreadystatechange = function () {
        setLoading(objXml.readyState * 25);
        if (objXml.readyState === 4) {
            if (objXml.status === 200) {
                document.getElementById(content_id).innerHTML = objXml.responseText;
                componentHandler.upgradeDom();
                expandToWindow();
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
//loads initial subpage and sets initial hash
function startContent() {
    var pg = window.location.hash.substring(1);
    if (pg === null || pg.length < 3) {
        pg = default_page;
    }
    if (pg.substr(0, 3) === tab_prefix) {
        try {
            document.getElementById(tab_id_prefix + pg).classList.add("is-active");
        } catch (ex) {}
    }
    go_to(pg);
    loadContent(pg);
}
//execute function and remove debug img
function execAndClean() {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] === undefined) {
            console.error('undefined function...')
        } else if (arguments[i].constructor === Array) {
            arguments[i][0](arguments[i].slice(1));
        } else {
            arguments[i]();
        }
    }
    console.info('Finished executing loaded page scripts');
    var img = document.getElementById(exec_img_id);
    img.parentNode.removeChild(img);
}
