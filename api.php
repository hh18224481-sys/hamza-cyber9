<?php
// Optional shared backend for PHP-enabled hosting. Keep storage outside public assets when possible.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
session_start();
$storeDir = __DIR__ . '/data';
if (!is_dir($storeDir) && !@mkdir($storeDir, 0750, true) && !is_dir($storeDir)) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'storage_unavailable']); exit; }
if (!is_file($storeDir . '/.htaccess')) @file_put_contents($storeDir . '/.htaccess', "Require all denied\nDeny from all\n");
if (!is_file($storeDir . '/index.html')) @file_put_contents($storeDir . '/index.html', '');
$visitsFile = $storeDir . '/visits.json';
$messagesFile = $storeDir . '/messages.json';
function read_json_file($path, $fallback) { if (!is_file($path)) return $fallback; $raw = @file_get_contents($path); $decoded = json_decode($raw ?: '', true); return is_array($decoded) ? $decoded : $fallback; }
function write_json_file($path, $data) { $fp = @fopen($path, 'c+'); if (!$fp) return false; if (!flock($fp, LOCK_EX)) { fclose($fp); return false; } ftruncate($fp, 0); rewind($fp); $ok = fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) !== false; fflush($fp); flock($fp, LOCK_UN); fclose($fp); return $ok; }
$action = $_GET['action'] ?? '';
if ($action === 'visit' && $_SERVER['REQUEST_METHOD'] === 'GET') {
  $data = read_json_file($visitsFile, ['count'=>0]);
  if (empty($_SESSION['hamza_counted'])) { $data['count'] = max(0, (int)($data['count'] ?? 0)) + 1; $_SESSION['hamza_counted'] = true; if (!write_json_file($visitsFile, $data)) { http_response_code(500); echo json_encode(['ok'=>false]); exit; } }
  echo json_encode(['ok'=>true,'count'=>(int)($data['count'] ?? 0)]); exit;
}
if ($action === 'message' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $body = json_decode(file_get_contents('php://input') ?: '', true);
  $name = trim((string)($body['name'] ?? '')); $message = trim((string)($body['message'] ?? ''));
  if ($name === '' || $message === '' || strlen($name) > 40 || strlen($message) > 500) { http_response_code(422); echo json_encode(['ok'=>false,'error'=>'invalid_input']); exit; }
  $messages = read_json_file($messagesFile, []);
  $messages[] = ['name'=>strip_tags($name),'message'=>strip_tags($message),'date'=>date('c')];
  if (count($messages) > 300) $messages = array_slice($messages, -300);
  if (!write_json_file($messagesFile, $messages)) { http_response_code(500); echo json_encode(['ok'=>false]); exit; }
  echo json_encode(['ok'=>true]); exit;
}
if ($action === 'messages' && $_SERVER['REQUEST_METHOD'] === 'GET') {
  $messages = read_json_file($messagesFile, []);
  echo json_encode(['ok'=>true,'messages'=>array_slice($messages, -30)]); exit;
}
http_response_code(404); echo json_encode(['ok'=>false,'error'=>'not_found']);
