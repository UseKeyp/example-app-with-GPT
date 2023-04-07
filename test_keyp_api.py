import requests
from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session

# Define test endpoint
TEST_ENDPOINT = 'https://yourkeypurl.com/api/v1/test'

# Define OAuth2.0 client
client_id = 'your_client_id_here'
client_secret = 'your_client_secret_here'
client = BackendApplicationClient(client_id=client_id)
oauth = OAuth2Session(client=client)
token = oauth.fetch_token(token_url='https://yourkeypurl.com/oauth/token', client_id=client_id, client_secret=client_secret)

# Make test request
response = requests.get(TEST_ENDPOINT, headers={'Authorization': 'Bearer ' + token['access_token']})

# Verify response
if response.status_code == 200:
    print('Authentication successful')
else:
    print('Authentication failed')

if 'expected_data' in response.json():
    print('Response contains expected data')
else:
    print('Response does not contain expected data')
