import axios from "axios"

const API_URL = "https://www.googleapis.com/calendar/v3/users/me/"
const button = document.querySelector("button");
const calendarList = document.getElementById("calendars");


// Retrieve oauth token and handle callback
const launchAuth = () => {
  let authUrl = "https://accounts.google.com/o/oauth2/auth?";

  const manifest = chrome.runtime.getManifest();
  const clientId = encodeURIComponent(manifest.oauth2.client_id);
  const redirectUrl = "https://" + chrome.runtime.id + ".chromiumapp.org";
  const scopes = manifest.oauth2.scopes.join(" ");

  const auth_params = {
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: "token",
    scope: scopes,
  };

  const params = new URLSearchParams(Object.entries(auth_params));
  params.toString();
  authUrl += params;

  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    async (responseUrl) => {
      let token = responseUrl.split("=")[1].split("&")[0];
      const calendars = await retrieveCals(token)
      const container = document.createElement("div")

      for(let cal of calendars) {
        const calElem = document.createElement("div")
        calElem.innerText = cal.summary
        container.appendChild(calElem)
      }

      calendarList.innerHTML = container.innerHTML
    }
  );
};

// return array of calendars
const retrieveCals = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const response = await axios.get(API_URL + 'calendarList', config)

  return response.data.items
};

button.addEventListener("click", launchAuth);
