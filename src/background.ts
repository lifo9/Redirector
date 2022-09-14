///<reference types="chrome"/>

chrome.webRequest.onBeforeRequest.addListener(
  (_request) => {
    return {
      redirectUrl: 'https://skladis.com'
    }
  },
  { urls: ['https://filo.dev/*'] },
  ['blocking']
)

export {} //
