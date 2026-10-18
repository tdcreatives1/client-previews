<?php
// Central Coast Scan — quote form handler (Hostinger PHP mail).
// 1) Set $TO to the inbox that should receive requests.
// 2) $FROM must be an address on YOUR domain (create it in hPanel > Emails) or mail may be rejected/spam-filtered.
$TO   = 'hello@centralcoastscan.com';
$FROM = 'no-reply@centralcoastscan.com';
$SITE = 'Central Coast Scan';

header('X-Robots-Tag: noindex');
$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
function out($ok, $msg, $json) {
  if ($json) { http_response_code($ok ? 200 : 400); header('Content-Type: application/json'); echo json_encode(['ok' => $ok, 'error' => $ok ? null : $msg]); exit; }
  header('Location: ' . ($ok ? '/#quote-sent' : '/?error=1#quote'), true, 303); exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: /#quote', true, 303); exit; }
if (!empty($_POST['website'])) out(true, '', $wantsJson); // honeypot: silently accept bots

function f($k, $max = 500) { $v = isset($_POST[$k]) ? trim((string)$_POST[$k]) : ''; $v = str_replace(["\r", "\n"], ' ', $v); return mb_substr($v, 0, $max); }
$name = f('name', 120); $email = f('email', 160); $phone = f('phone', 40);
$size = f('size', 60); $address = f('address', 200); $role = f('role', 40); $timeline = f('timeline', 20);
$notes = isset($_POST['notes']) ? mb_substr(trim((string)$_POST['notes']), 0, 4000) : '';

if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) out(false, 'Please enter your name, a valid email and a phone number.', $wantsJson);

// basic rate limit: 1 submission per 30s per session
session_start();
if (isset($_SESSION['ccs_last']) && time() - $_SESSION['ccs_last'] < 30) out(false, 'Please wait a moment before sending another request.', $wantsJson);
$_SESSION['ccs_last'] = time();

$subject = "New quote request: $name ($role" . ($timeline === 'Expedite' ? ', EXPEDITE' : '') . ")";
$body = "New quote request from the website\n\n"
  . "Name:      $name\nEmail:     $email\nPhone:     $phone\nRole:      $role\nTimeline:  $timeline\n"
  . "Size:      $size\nAddress:   $address\n\nNotes:\n$notes\n\n"
  . "Submitted: " . date('Y-m-d H:i T') . "\nIP: " . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";
$headers = "From: $SITE <$FROM>\r\nReply-To: $name <$email>\r\nContent-Type: text/plain; charset=UTF-8\r\nX-Mailer: PHP/" . phpversion();

$sent = @mail($TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers, '-f' . $FROM);
out($sent, 'The request could not be sent right now.', $wantsJson);
