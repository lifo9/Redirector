///<reference types="chrome"/>

chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(null, (storage) => {
    const redirectHandler = (_request: any) => {
      return {
        redirectUrl: storage.redirectTo
      }
    }

    chrome.webRequest.onBeforeRequest.removeListener(redirectHandler)
    chrome.webRequest.onBeforeRequest.addListener(
      redirectHandler,
      { urls: storage.filters },
      ['blocking']
    )
  })
})
export {} //
