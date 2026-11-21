<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function fail(int $status): never { http_response_code($status); echo '{"ok":false}'; exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405);
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = parse_url($_SERVER['HTTP_ORIGIN']);
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if (!$origin || ($origin['scheme'] ?? '') !== 'https' || ($origin['host'] ?? '') !== $host) fail(403);
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 8192) fail(413);
$input = json_decode(file_get_contents('php://input'), true);
$text = is_array($input) ? ($input['text'] ?? null) : null;
if (!is_string($text) || trim($text) === '' || strlen($text) > 4000) fail(400);
$configFile = __DIR__ . '/contact-config.php';
// На Timeweb Cloud секреты передаются только при запуске контейнера.
$config = is_file($configFile) ? require $configFile : [
    'token' => getenv('TELEGRAM_BOT_TOKEN'),
    'chat_id' => getenv('TELEGRAM_CHAT_ID'),
];
if (!is_array($config) || empty($config['token']) || empty($config['chat_id'])) fail(503);
// Ограничиваем частоту отправки с одного IP. Данные заявки здесь не сохраняются.
$rateFile = sys_get_temp_dir() . '/site-contact-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rate = fopen($rateFile, 'c+');
if (!$rate || !flock($rate, LOCK_EX)) fail(503);
$last = (int)stream_get_contents($rate);
if (time() - $last < 30) { flock($rate, LOCK_UN); fclose($rate); fail(429); }
ftruncate($rate, 0); rewind($rate); fwrite($rate, (string)time()); fflush($rate); flock($rate, LOCK_UN); fclose($rate);
if (!function_exists('curl_init')) fail(503);
$curl = curl_init('https://api.telegram.org/bot' . $config['token'] . '/sendMessage');
curl_setopt_array($curl, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
    CURLOPT_POSTFIELDS => http_build_query(['chat_id' => $config['chat_id'], 'text' => $text])]);
$result = curl_exec($curl);
$status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);
$data = $result === false ? null : json_decode($result, true);
if ($status !== 200 || !is_array($data) || empty($data['ok'])) fail(502);
echo '{"ok":true}';
