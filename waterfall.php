<?php
/**
 * User: fatedm
 * Date: 12-12-9
 * Time: ÉÏÎç10:45
 */
$page = 'waterfall';
$version = '1.0';
//$fbTag = '20130321';
include('./inc/hd.php');
?>
<button id="click">end</button>
<button id="start">start</button>

<div id="content">

</div>

<script type="tpl" id="tpl">
    <div class="pin ks-waterfall" data-id="{{id}}">
        <a href="#" class="image">
            <img height="{{height}}" alt="{{title}}" src="http://farm{{farm}}.static.flickr.com/{{server}}/{{id}}_{{secret}}_m.jpg" />
        </a>
        <p class="description">{{title}}</p>
    </div>
</script>
<?php
include('./inc/ft.php');
?>