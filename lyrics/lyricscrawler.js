function init() {
    "use strict";
    var parentId = 'nav', childId = 'lyrics', parent = document.getElementById(parentId), child = document.createElement('div');
    
    function removePopup() {
        parent.removeChild(child);
    }
    
    function setContent() {
        var objXml = new XMLHttpRequest();
        objXml.onreadystatechange = function () {
            if (objXml.readyState === 4 && (objXml.status === 200 || objXml.status === 0) && objXml.response !== "") {
                child.innerHTML = objXml.responseText;
            }
            if (objXml.readyState === 4 && (objXml.status === 200 || objXml.status === 0) && objXml.response === "") {
                child.innerHTML = "<p style='text-align:center;color:lightcoral;margin:20px;'>Couldn't load page content.</p>";
            }
        };
        objXml.open("GET", 'https://mcmanuellp.github.io/lyrics/lyrics.html', true);
        objXml.send();
    }
    
    function displayPopup() {
        child.setAttribute('id', childId);// style: position:fixed;bottom:50px;right:0;
        child.setAttribute('style', 'width:inherit;height:384px;background-color:rgba(255, 255, 255, 1);');
        parent.appendChild(child);
        setContent();
    }
    
    displayPopup();
}