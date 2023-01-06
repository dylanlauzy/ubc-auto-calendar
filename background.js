chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.clear()
})

chrome.runtime.onMessage.addListener((msg) => {
  console.log(msg)
})

console.log("initialised")