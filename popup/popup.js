const button = document.querySelector("button");
const responseElem = document.querySelector("p");

const launchAuth = () => {
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
      let token = responseUrl.split("=")[1];
      responseElem.textContent = token;

      //details about the event
      let event = {
        summary: "Test Event",
        description: "testing...",
        start: {
          dateTime: "2023-01-05T09:00:00-07:00",
          timeZone: "America/Los_Angeles",
        },
        end: {
          dateTime: "2015-05-28T09:00:00-07:00",
          timeZone: "America/Los_Angeles",
        },
      };

      let fetch_options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      };

      fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        fetch_options
      )
        .then((response) => response.json()) // Transform the data into json
        .then(function (data) {
          console.log(data); //contains the response of the created event
        });

      responseElem.textContent = responseUrl;
      console.log(responseUrl);
    }
  );
};

button.addEventListener("click", launchAuth);
