<?php
/**
 * What the form scripts share: contact.php and quote.php. Each receives its form, checks
 * it, and mails it to the client's mailbox (ported from moreco.ma, where it runs in
 * production).
 *
 * Why scripts on our own server: third-party form services failed on moreco.ma (EmailJS
 * capped requests at 50 KB, FormSubmit's activation answered 500). The scripts sign in to
 * the client's mailbox over SMTP and send from it, as a mail client would, so the message
 * passes SPF/DKIM and does not land in spam. PHP's own mail() would send from the web
 * server, which is not in the domain's SPF record.
 *
 * The SMTP settings and password live in mail-config.php next to this file: kept out of
 * git and refused to the web by api/.htaccess. Copy mail-config.example.php to create it.
 *
 * Written for PHP 5.6 and up: no scalar type hints, no ?? and no arrow functions.
 */

// A PHP warning printed into the answer would break the JSON the form reads.
ini_set('display_errors', '0');
// PHP 5.6 warns on date() when the server sets no timezone.
date_default_timezone_set('Europe/Amsterdam');

/** Answers the form and stops. */
function reply($status, $success, $error = '')
{
    http_response_code($status);
    echo json_encode($error === '' ? array('success' => $success) : array('success' => $success, 'error' => $error));
    exit;
}

/**
 * The checks every form passes before its fields are read. Returns the SMTP settings.
 * A robot caught by the honeypot is told the message went through, so it has no reason
 * to try again.
 */
function startForm()
{
    header('Content-Type: application/json; charset=utf-8');
    header('X-Robots-Tag: noindex');

    if ((isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '') !== 'POST') reply(405, false, 'method');

    // Only the site's own pages post here.
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    if ($origin !== '' && !preg_match('#^https://(www\.)?euraviafoods\.com$#', $origin)) reply(403, false, 'origin');

    $config = __DIR__ . '/mail-config.php';
    if (!is_file($config)) reply(500, false, 'config');
    $smtp = require $config;

    // The honeypot: a person never sees this field, so a filled one is a robot.
    if (trim(post('_gotcha')) !== '') reply(200, true);

    return $smtp;
}

/* ---------------------------------------------------------------- the fields */

/**
 * A posted value as a string, empty when absent. Always valid UTF-8: text that is not is
 * read as Windows-1252, since some mail hosts accept a mail carrying broken UTF-8 and then
 * silently never delivers it (seen on moreco.ma, 2026-10-09).
 */
function post($name)
{
    $value = isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
    if (preg_match('//u', $value)) return $value;
    return function_exists('mb_convert_encoding') ? mb_convert_encoding($value, 'UTF-8', 'Windows-1252') : utf8_encode($value);
}

/** mb_substr where the extension is installed, a UTF-8 regex where it is not. */
function cut($text, $max)
{
    if (function_exists('mb_substr')) return mb_substr($text, 0, $max, 'UTF-8');
    return preg_match('/^.{0,' . $max . '}/su', $text, $m) ? $m[0] : substr($text, 0, $max);
}

/** One line of text from the form: trimmed, no line breaks, capped. */
function field($name, $max = 200)
{
    $value = preg_replace('/[\r\n\t]+/', ' ', trim(post($name)));
    return cut((string)$value, $max);
}

/** A text that keeps its line breaks (a message, the quote basket), capped. */
function multiline($name, $max = 5000)
{
    return cut(trim(str_replace("\r\n", "\n", post($name))), $max);
}

/** Refuses the form unless every field is filled and the e-mail address is one. */
function requireFields(array $fields, $email)
{
    foreach ($fields as $value) {
        if ($value === '') reply(400, false, 'required');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply(400, false, 'email');
}

/* ------------------------------------------------------------ rate limiting */

/** Where one visitor's recent sends of one form are counted. */
function rateFile($form)
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
    return sys_get_temp_dir() . '/euravia-' . $form . '-' . md5($ip) . '.json';
}

/** This visitor's sends of the form within the last hour. */
function recentSends($form)
{
    $file = rateFile($form);
    $recent = is_file($file) ? json_decode((string)file_get_contents($file), true) : array();
    if (!is_array($recent)) $recent = array();
    $hourAgo = time() - 3600;
    return array_values(array_filter($recent, function ($t) use ($hourAgo) { return is_int($t) && $t > $hourAgo; }));
}

/**
 * Five sends an hour from one address is more than any visitor needs, and stops the
 * scripts being used to flood the mailbox.
 */
function checkRate($form)
{
    if (count(recentSends($form)) >= 5) reply(429, false, 'rate');
}

function recordSend($form)
{
    $recent = recentSends($form);
    $recent[] = time();
    @file_put_contents(rateFile($form), json_encode($recent));
}

/* -------------------------------------------------------------- the message */

/** The mail's body: a sentence, the fields as a table, then the visitor's message. */
function htmlBody($intro, array $fields, $message)
{
    $rows = '';
    foreach ($fields as $title => $value) {
        $rows .= '<tr><th align="left" valign="top" style="padding:4px 12px 4px 0">' . htmlspecialchars($title)
            . '</th><td style="padding:4px 0">' . nl2br(htmlspecialchars($value)) . "</td></tr>\n";
    }
    return "<html><body style=\"font-family:Arial,sans-serif;font-size:14px\">\n"
        . '<p>' . htmlspecialchars($intro) . "</p>\n"
        . "<table>\n$rows</table>\n"
        . ($message !== '' ? '<p><strong>Message</strong></p><p>' . nl2br(htmlspecialchars($message)) . '</p>' : '')
        . "\n</body></html>";
}

/**
 * A header value outside ASCII, as RFC 2047 wants it: encoded words of at most 75
 * characters, one per folded line. A single longer one (any subject with a full name in
 * it) is shown undecoded by some mail clients.
 */
function encodeHeader($text)
{
    $words = array();
    $chunk = '';
    foreach (preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY) as $char) {
        // 45 bytes of UTF-8 make 60 of base64, 72 with the =?UTF-8?B? ?= around them.
        if (strlen($chunk . $char) > 45) {
            $words[] = '=?UTF-8?B?' . base64_encode($chunk) . '?=';
            $chunk = '';
        }
        $chunk .= $char;
    }
    $words[] = '=?UTF-8?B?' . base64_encode($chunk) . '?=';
    return implode("\r\n ", $words);
}

/** Random hex, from the best source this PHP has. */
function randomHex($bytes)
{
    if (function_exists('random_bytes')) return bin2hex(random_bytes($bytes));
    return bin2hex(openssl_random_pseudo_bytes($bytes));
}

/**
 * Mails the message to the client's mailbox, replying to the visitor, and answers the form.
 * $attachment, when given, is array(file name, PDF bytes).
 */
function sendAndReply(array $smtp, $form, $subject, $replyName, $replyEmail, $html, $attachment = null)
{
    $boundary = 'euravia-' . randomHex(12);
    $from = $smtp['from'];
    $to = $smtp['to'];
    $lines = [
        'Date: ' . date('r'),
        'From: ' . encodeHeader('Site euraviafoods.com') . " <$from>",
        "To: <$to>",
        'Reply-To: ' . encodeHeader($replyName) . " <$replyEmail>",
        'Subject: ' . encodeHeader($subject),
        'Message-ID: <' . randomHex(16) . '@euraviafoods.com>',
        'MIME-Version: 1.0',
        "Content-Type: multipart/mixed; boundary=\"$boundary\"",
        '',
        "--$boundary",
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        '',
        rtrim(chunk_split(base64_encode($html), 76, "\r\n")),
    ];
    if ($attachment !== null) {
        list($name, $bytes) = $attachment;
        $lines[] = "--$boundary";
        $lines[] = "Content-Type: application/pdf; name=\"$name\"";
        $lines[] = 'Content-Transfer-Encoding: base64';
        $lines[] = "Content-Disposition: attachment; filename=\"$name\"";
        $lines[] = '';
        $lines[] = rtrim(chunk_split(base64_encode($bytes), 76, "\r\n"));
    }
    $lines[] = "--$boundary--";
    $lines[] = '';

    try {
        smtpSend($smtp, $from, $to, implode("\r\n", $lines));
    } catch (Exception $e) {
        error_log("$form.php: " . $e->getMessage());
        reply(502, false, 'send');
    }
    recordSend($form);
    reply(200, true);
}

/**
 * Hands the message to the SMTP server over implicit TLS (port 465), signed in as the
 * mailbox. Throws on any answer other than the expected one.
 */
function smtpSend(array $smtp, $from, $to, $mail)
{
    $socket = stream_socket_client(
        'ssl://' . $smtp['host'] . ':' . $smtp['port'], $errno, $errstr, 20,
        STREAM_CLIENT_CONNECT, stream_context_create(array('ssl' => array('verify_peer' => true, 'peer_name' => $smtp['host'])))
    );
    if (!$socket) throw new RuntimeException("connect: $errstr");
    stream_set_timeout($socket, 30);

    $expect = function ($code) use ($socket) {
        $answer = '';
        while (($line = fgets($socket, 1024)) !== false) {
            $answer .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break; // last line of the reply
        }
        if (strncmp($answer, $code, 3) !== 0) throw new RuntimeException("expected $code, got: " . trim($answer));
    };
    $say = function ($line, $code) use ($socket, $expect) {
        fwrite($socket, $line . "\r\n");
        $expect($code);
    };

    $expect('220');
    $say('EHLO euraviafoods.com', '250');
    $say('AUTH LOGIN', '334');
    $say(base64_encode($smtp['user']), '334');
    $say(base64_encode($smtp['password']), '235');
    $say("MAIL FROM:<$from>", '250');
    $say("RCPT TO:<$to>", '250');
    $say('DATA', '354');
    // A line starting with a dot would end the message early: double it.
    $say(preg_replace('/^\./m', '..', $mail) . "\r\n.", '250');
    fwrite($socket, "QUIT\r\n");
    fclose($socket);
}
