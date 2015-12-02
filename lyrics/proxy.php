<?php
// Set your return content type
header('Content-type: text/html');

// Website url to open
$url = 'https://www.musixmatch.com/lyrics/One-Direction/Home';

// Get that website's content
$handle = fopen($url, "r");

// If there is something, read and return
if ($handle) {
    while (!feof($handle)) {
        $buffer = fgets($handle, 4096);
        echo $buffer;
    }
    fclose($handle);
}
?>