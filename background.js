chrome.runtime.onInstalled.addListener(() => {
  chrome.identity.clearAllCachedAuthTokens()
})

chrome.runtime.onMessage.addListener((obj) => {
  console.log(obj)
})

console.log("initialised")