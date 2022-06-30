import requests

api_url = 'http://127.0.0.1:8081/hub/api'

r = requests.get(api_url + '/users',
    headers={
        'Authorization': f'token 22bc8f195d574cd594a12689998a5ce1',
    }
)

r.raise_for_status()
users = r.json()