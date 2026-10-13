<?php
/**
 * Copy to mail-config.php ON THE SERVER and fill in. mail-config.php is git-ignored and
 * refused to the web by .htaccess. Port 465 = implicit TLS (see smtpSend in mailer.php).
 */
return array(
    'host' => 'smtp.example.com',
    'port' => 465,
    'user' => 'info@euraviafoods.com',
    'password' => 'CHANGE-ME',
    'from' => 'info@euraviafoods.com',
    'to' => 'info@euraviafoods.com',
);
