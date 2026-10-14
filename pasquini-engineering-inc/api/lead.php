<?php
/**
 * Lead endpoint for the site chat qualifier.
 * POST JSON: {project, location, timeline, name, phone, page, website(honeypot)}
 * 1. Forwards the lead to the GoHighLevel inbound webhook (if GHL_WEBHOOK_URL is set)
 * 2. Emails the lead to LEAD_EMAIL_TO
 * Returns {"ok":true} on success.
 */
const LEAD_EMAIL_TO   = 'padmin@pasquiniengineering.com';
const LEAD_EMAIL_FROM = 'website@pasquiniengineering.com'; // must be a mailbox/domain on this Hostinger account
const GHL_WEBHOOK_URL = ''; // GoHighLevel → Automation → Workflow → Inbound Webhook trigger → paste URL here

header('Content-Type: application/json');
header('X-Robots-Tag: noindex');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) $in = $_POST;
if (!empty($in['website'])) { echo '{"ok":true}'; exit; } // honeypot: silently accept bots

$clean = function ($v, $max = 200) { return trim(mb_substr(strip_tags((string)$v), 0, $max)); };
$lead = [
  'project'  => $clean($in['project'] ?? ''),
  'location' => $clean($in['location'] ?? ''),
  'timeline' => $clean($in['timeline'] ?? ''),
  'name'     => $clean($in['name'] ?? '', 120),
  'phone'    => preg_replace('/[^0-9+()\-\s.]/', '', $clean($in['phone'] ?? '', 40)),
  'page'     => $clean($in['page'] ?? '', 300),
  'source'   => 'Website chat',
  'submitted_at' => gmdate('c'),
];
if ($lead['name'] === '' || strlen(preg_replace('/\D/', '', $lead['phone'])) < 7) {
  http_response_code(422); echo '{"ok":false,"error":"name and phone required"}'; exit;
}

$sent = false;

if (GHL_WEBHOOK_URL !== '') {
  $ch = curl_init(GHL_WEBHOOK_URL);
  curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($lead), CURLOPT_HTTPHEADER => ['Content-Type: application/json'], CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10]);
  curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($code >= 200 && $code < 300) $sent = true;
}

$body = "New website lead\n\n";
foreach ($lead as $k => $v) $body .= str_pad(ucfirst(str_replace('_', ' ', $k)) . ':', 16) . $v . "\n";
$headers = 'From: Pasquini Website <' . LEAD_EMAIL_FROM . ">\r\nContent-Type: text/plain; charset=UTF-8";
if (mail(LEAD_EMAIL_TO, 'New lead: ' . $lead['project'] . ' - ' . $lead['name'], $body, $headers)) $sent = true;

if (!$sent) { http_response_code(502); echo '{"ok":false}'; exit; }
echo '{"ok":true}';
