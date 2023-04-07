from oauthlib.oauth2 import BackendApplicationClient
from requests_oauthlib import OAuth2Session

client_id = 'your_client_id_here'
client_secret = 'your_client_secret_here'

client = BackendApplicationClient(client_id=client_id)
oauth = OAuth2Session(client=client)
token = oauth.fetch_token(token_url='https://yourkeypurl.com/oauth/token', client_id=client_id, client_secret=client_secret)
headers = {'Authorization': 'Bearer ' + token['access_token']}

# Now you can use the headers object to make authenticated requests to the Keyp API