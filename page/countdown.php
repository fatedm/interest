<?php
$page = 'countdown';
$title = '����ʱ';
$fbPub = '20121218';
$version = '1.0';
$fbTag = '20121218';

include('../inc/hd.php');
?>
<div id="content">
<div id="test">
    <div class="ks-rundiv">
        <b class="ks-d">0</b>��
        <b class="ks-h">0</b>:
        <b class="ks-m">0</b>:
        <b class="ks-s">0</b>:
        <b class="ks-i">0</b>

    </div>
    <div class="ks-enddiv">�ҳ����ˣ�</div>
</div>

<div id="autorender" class="J_TWidget" data-widget-type="countdown" data-widget-config="{'endTime':'10000','interval':100}">
    <div class="ks-countdown-run">
        <b class="ks-d">0</b>��
        <b class="ks-h">0</b>:
        <b class="ks-m">0</b>:
        <b class="ks-s">0</b>:
        <b class="ks-i">0</b>

    </div>
    <div class="ks-countdown-end">�ҳ����ˣ�</div>
</div>
<div id="buy" data-seckill-config='{"timeRemain":10000,"status":1}'>
    <button class="cantbuy" disabled="disabled">������ʼ</button>
    <div class="ks-seckill"></div>
</div>

</div>
<?php
include('../inc/ft.php');
?>