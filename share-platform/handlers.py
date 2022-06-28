import json
import re

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
import requests

class RouteHandler(APIHandler):
   
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /share-platform/get_example endpoint!"
        }))

    @tornado.web.authenticated
    def post(self):
        input_data = self.get_json_body()
        print("input_data",input_data)
        res = requests.post(url="http://127.0.0.1:8077/data-api/share/jupyter/upload", data =json.dumps(input_data),headers={'content-type': 'application/json'})
        print("res",res.text)
        self.finish(res.text)

def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "share-platform", "get_example")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
