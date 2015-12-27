function lyricsLoad() {
    alert("loading");
    $("#invislyr").load(document.getElementById('lyrixdisplay').getAttribute('src'));
    $("#invislyr").load('http://mcmanuellp.github.io/lyrics/temp.html');
    document.getElementById('lyrics-html').style.fontSize = '0.8em';
    alert(document.getElementById('lyrics-html').innerHtml)
};
