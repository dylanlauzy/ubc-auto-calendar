const button = document.querySelector('button')
const responseElem = document.querySelector('p')

const launchAuth = () => {
  button.textContent="hello"

  let authUrl = "https://accounts.google.com/o/oauth2/auth?";

  const manifest = chrome.runtime.getManifest();
  const clientId = encodeURIComponent(manifest.oauth2.client_id);
  const redirectUrl = "https://" + chrome.runtime.id + ".chromiumapp.org";
  const scopes = manifest.oauth2.scopes.join(" ");

  const auth_params = {
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: "id_token",
    scope: scopes,
  };

  const url = new URLSearchParams(Object.entries(auth_params));
  url.toString();
  authUrl += url;

  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    (responseUrl) => {
      let token = responseUrl.split("=")[1]
      responseElem.textContent = token

      // chrome.identity.removeCachedAuthToken({
      //   token: token,
      // }, () => {})
      
      responseElem.textContent = responseUrl
      console.log(responseUrl)
    }
  );
};

button.addEventListener('click', launchAuth)