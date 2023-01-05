chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.clear()
})

console.log("initialised")