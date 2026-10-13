<?php
/**
 * The quote request's mailer. Receives the basket and buyer details posted by
 * components/Quote/QuoteForm.tsx and mails them to the client. The sending itself is in
 * mailer.php.
 */

require __DIR__ . '/mailer.php';

$smtp = startForm();

$fields = [
    'First name' => field('prenom'),
    'Last name' => field('nom'),
    'Company' => field('societe'),
    'Email' => field('email'),
    'Phone' => field('telephone', 40),
    'Country' => field('pays'),
    // One "quantity unit × product (id)" per line, written by the form from the basket.
    'Products' => multiline('produits', 10000),
];
requireFields($fields, $fields['Email']);
$fields['Delivery destination'] = field('destination');
$fields['Desired period'] = field('periode');
$message = multiline('message');
$fields['Site language'] = field('langue', 5);

checkRate('quote');

$name = $fields['First name'] . ' ' . $fields['Last name'];
sendAndReply(
    $smtp,
    'quote',
    "euraviafoods.com – Quote request – $name (" . $fields['Company'] . ')',
    $name,
    $fields['Email'],
    htmlBody('New quote request received through euraviafoods.com.', $fields, $message)
);
