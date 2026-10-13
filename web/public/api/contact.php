<?php
/**
 * The contact form's mailer. Receives the message posted by
 * components/forms/ContactForm.tsx and mails it to the client, the subject the visitor
 * chose in the mail subject so it can be routed at a glance. The sending itself is in
 * mailer.php.
 */

require __DIR__ . '/mailer.php';

$smtp = startForm();

$fields = [
    'Subject' => field('sujet'),
    'First name' => field('prenom'),
    'Last name' => field('nom'),
    'Email' => field('email'),
    'Country' => field('pays'),
];
$message = multiline('message');
requireFields($fields + ['Message' => $message], $fields['Email']);
$fields['Company'] = field('societe');
$fields['Phone'] = field('telephone', 40);
$fields['Site language'] = field('langue', 5);

checkRate('contact');

$name = $fields['First name'] . ' ' . $fields['Last name'];
sendAndReply(
    $smtp,
    'contact',
    'euraviafoods.com – Contact – ' . $fields['Subject'] . " – $name",
    $name,
    $fields['Email'],
    htmlBody('New message received through the euraviafoods.com contact form.', $fields, $message)
);
