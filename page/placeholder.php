<?php
/**
 * User: fatedm
 * Date: 13-1-4
 * Time: ����8:07
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
            <label class="field" for="name">������<span>*</span></label>
            <input class="text J_Placeholder" type="text" name="name" id="name" maxlength="30" placeholder="�������Ҫ��д����">
        </li>
        <li class="clearfix">
            <label class="field" for="idcard">���֤��<span>*</span></label>
            <input class="text J_Placeholder" type="text" name="idcard" id="idcard" maxlength="18" placeholder="�������Ҫ��д���֤">
        </li>
        <li class="clearfix">
            <label class="field" for="mobile">�ֻ���<span>*</span></label>
            <input class="text J_Placeholder" type="text" name="mobile" id="mobile" maxlength="11" placeholder="�������Ҫ��д�ֻ�">
        </li>
        <li class="clearfix">
            <label class="field">���ԣ�<span style="visibility:hidden;">*</span></label>
            <textarea name="guestbook" placeholder="ѡ����Ը���������������Ҫ�󣬿��Ը���������������Ҫ��" class="J_Placeholder"></textarea>
        </li>
    </ul>
</div>
<?php
    include('../inc/ft.php');
?>