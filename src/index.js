import axios from "axios";

const API_URL = "https://www.googleapis.com/calendar/v3/";
const selectCalBtn = document.getElementById("select-cal");
const addClassesBtn = document.getElementById("add-classes");
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

      chrome.runtime.sendMessage({ token });

      const calendars = await retrieveCals(token);
      const container = document.createElement("div");

      for (let cal of calendars) {
        const calElem = document.createElement("div");
        calElem.innerText = cal.summary;
        container.appendChild(calElem);
      }

      calendarList.innerHTML = container.innerHTML;

      const response = addEvent(token)
      chrome.runtime.sendMessage({ response });
    }
  );
};

// return array of calendars
const retrieveCals = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "users/me/calendarList", config);

  return response.data.items;
};

// HTTP request to add event to calendar
const addEvent = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }

  const data = {
    summary: "test event",
    start: {
      dateTime: '2023-01-06T09:00:00-07:00',
      timeZone: 'America/Vancouver'
    },
    end: {
      dateTime: '2023-01-06T17:00:00-07:00',
      timeZone: 'America/Vancouver'
    },
    location: "sample location",
    recurrence: [
      "RRULE:FREQ=WEEKLY;UNTIL=20230613T170000Z"
    ]
  }

  const response = await axios.post(API_URL + "calendars/" + "hqocj30m9ad5ppiu5mr3g68vmo@group.calendar.google.com" + "/events", data, config)

  return response.data
};

const addClasses = async () => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  chrome.tabs.sendMessage(tab.id, {
    type: "RETRIEVE_CLASSES"
  })
}

selectCalBtn.addEventListener("click", launchAuth);
addClassesBtn.addEventListener("click", addClasses)