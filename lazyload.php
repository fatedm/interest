<?php
/**
 * User: fatedm
 * Date: 12-12-23
 * Time: ÏÂÎç10:05
 */
?>
<?php
$page = 'imgload';
$title = 'lazyload';
$fbPub = '20121224';
$version = '1.0';
$fbTag = '20121224';

include('./inc/hd.php');
?>
<div id="content">
    <img data-ks-lazyload="http://farm1.static.flickr.com/147/427718118_8090890d97_m.jpg">
    <textarea class="ks-lazyload">
        <div>I'm in textarea!</div>
    </textarea>
</div>
<?php
include('./inc/ft.php');
?>