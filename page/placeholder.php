<?php
/**
 * User: fatedm
 * Date: 13-1-4
 * Time: 下午8:07
 */
$page = 'placeholder';
$title = 'placeholder';
$fbPub = '20130104';
$version = '1.0';
$fbTag = '20130104';

include('../inc/hd.php');
?>
<div id="content">
    <ul class="order-form" id="order-form">
        <li class="clearfix">
            <label class="field" for="name">姓名：<span>*</span></label>
            <input class="text J_Placeholder" type="text" name="name" id="name" maxlength="30" placeholder="这里必须要填写姓名">
        </li>
        <li class="clearfix">
            <label class="field" for="idcard">身份证：<span>*</span></label>
            <input class="text J_Placeholder" type="text" name="idcard" id="idcard" maxlength="18" placeholder="这里必须要填写身份证">
        </li>
        <li class="clearfix">
            <label class="field" for="mobile">手机：<span>*</span></label>
            <input class="text J_Placeholder" type="text" name="mobile" id="mobile" maxlength="11" placeholder="这里必须要填写手机">
        </li>
        <li class="clearfix">
            <label class="field">留言：<span style="visibility:hidden;">*</span></label>
            <textarea name="guestbook" placeholder="选填，可以告诉卖家您的特殊要求，可以告诉卖家您的特殊要求" class="J_Placeholder"></textarea>
        </li>
    </ul>
</div>
<?php
    include('../inc/ft.php');
?>