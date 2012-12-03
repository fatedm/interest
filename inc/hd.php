<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="GBK">
		<title><?php echo $title; ?></title>
         <base target="_blank">
		<link href="./assets/common/global.css" rel="stylesheet">
		<link href="./assets/<?php echo $page ?>/<?php echo $version ?>/page/style.css" rel="stylesheet">
		<script src="http://a.tbcdn.cn/s/kissy/1.2.0/kissy-min.js" charset="utf-8"></script>
        <script src="./assets/common/package-config.js"></script>
        <script type="text/javascript">
            FB.config({
                name: <?php echo "'".$page."'"; ?>,
                path: './assets/',
                version: <?php echo "'".$version."'"; ?>,
                charset: 'gbk',
                pub: <?php echo "'".$fbPub."'"; ?>,
                tag: <?php echo "'".$fbTag."'"; ?>
            });
        </script>
	</head>
	<body>
   
		
		
		
		

