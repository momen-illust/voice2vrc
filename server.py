from http.server import SimpleHTTPRequestHandler, HTTPServer
from pythonosc import udp_client
import json
import webbrowser

ip = '127.0.0.1'
port = 9090

vrcClientIp = '127.0.0.1'
vrcClientPort = 9000
client = udp_client.SimpleUDPClient(vrcClientIp, vrcClientPort)


class PostHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        content_len = int(self.headers['content-length'])
        post_body = self.rfile.read(content_len).decode('utf8')
        print(post_body)
        data = json.loads(post_body)
        self.send_response(200)
        if "path" in data and "value" in data:
            path = data["path"]
            value = data["value"]
            client.send_message(path, value)


if __name__ == '__main__':
    print(f"Staring the server at http://{ip}:{port}")
    webbrowser.open("http://localhost:9090")
    HTTPServer((ip, port), PostHandler).serve_forever()
