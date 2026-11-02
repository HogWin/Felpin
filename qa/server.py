"""
Local Mock Server for Automated QA Testing of The Fallen Kingdom
Serves static game client files from AntiGravity/ and mocks /api endpoints
so tests run completely offline and self-contained with 0 network errors.
"""
import http.server
import socketserver
import os
import threading
import json

class MockGameHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/api/health'):
            self._send_json({"status": "ok", "mode": "mock_qa", "database": "healthy"})
        elif self.path.startswith('/api/auth/config'):
            self._send_json({"authAvailable": True, "provider": "mock_neon"})
        elif self.path.startswith('/api/leaderboard'):
            self._send_json({
                "leaderboard": [
                    {"player_name": "Campeão Valória", "score": 15000, "time_survived": 600, "hero_class": "knight", "kills": 850},
                    {"player_name": "Arqueira Sombria", "score": 12400, "time_survived": 580, "hero_class": "ranger", "kills": 720}
                ]
            })
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/leaderboard') or self.path.startswith('/api/cloud-save'):
            self._send_json({"success": True, "saved": True})
        elif self.path.startswith('/api/auth/login') or self.path.startswith('/api/auth/register'):
            self._send_json({"success": True, "user": {"id": "mock-guest", "username": "Guerreiro QA"}})
        else:
            self._send_json({"status": "mock_ok"})

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

class GameTestServer:
    def __init__(self, directory=None, port=8888):
        self.port = port
        self.directory = directory or os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'AntiGravity'))
        self.httpd = None
        self.thread = None

    def start(self):
        handler = lambda *args, **kwargs: MockGameHTTPHandler(*args, directory=self.directory, **kwargs)
        socketserver.TCPServer.allow_reuse_address = True
        self.httpd = socketserver.TCPServer(('127.0.0.1', self.port), handler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        print(f"[QA Server] Serving '{self.directory}' with Mock API at http://127.0.0.1:{self.port}")

    def stop(self):
        if self.httpd:
            self.httpd.shutdown()
            self.httpd.server_close()
            print("[QA Server] Stopped.")

if __name__ == '__main__':
    server = GameTestServer(port=8888)
    server.start()
    try:
        import time
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        server.stop()
