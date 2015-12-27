var lyricsScript = true;

function init() {
    "use strict";
    var parentId = 'nav', childId = 'lyrics', parent = document.getElementById(parentId), child = document.createElement('div');
    
    displayPopup();
}

function removePopup() {
    parent.removeChild(child);
}

function setContent() {
    var objXml = new XMLHttpRequest();
    objXml.onreadystatechange = function () {
        if (objXml.readyState === 4) {
            if(objXml.status === 200) {
                child.innerHTML = objXml.responseText;
            } else {
                child.innerHTML = "<p style='text-align:center;color:lightcoral;margin:20px;'>Couldn't load page content.</p>";
            }
        }
    };
    objXml.open("GET", 'https://mcmanuellp.github.io/lyrics/lyrics.html', true);
    objXml.send();
}

function displayPopup() {
    child.setAttribute('id', childId);// style: position:fixed;bottom:50px;right:0;
    child.style.width = 'inherit';
    child.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    parent.appendChild(child);
    setContent();
}

function lyricsScript(url) {
    script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('charset', 'UTF-8');
    script.setAttribute('async', 'true');
    script.setAttribute('src', url);
    document.documentElement.appendChild(script);
}

function lyricsFind() {
    var titleId = 'currently-playing-title',
        artistId = 'player-artist',
        title = document.getElementById(titleId).innerHTML,
        artist = document.getElementById(artistId).innerHTML;
    document.getElementById('lyrixdisplay').setAttribute('src', 'https://www.musixmatch.com/search/' + title + ' ' + artist + '/tracks');
}

function lyricsLoad() {
    alert("loading");
    $("#invislyr").load(document.getElementById('lyrixdisplay').getAttribute('src'));
    $("#invislyr").load('http://mcmanuellp.github.io/lyrics/temp.html');
    document.getElementById('lyrics-html').style.fontSize = '0.8em';
    alert(document.getElementById('lyrics-html').innerHtml)
};

function lyricsClose() {
    document.getElementById('nav').removeChild(document.getElementById('lyrics'));
}
