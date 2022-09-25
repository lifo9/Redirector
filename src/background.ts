///<reference types="chrome"/>

import { getRedirects } from '@/services/RedirectService'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
let handlers: any[] = []

chrome.storage.onChanged.addListener(async () => {
  const activeRedirects = (await getRedirects()).filter(
    (rule) => rule.active === true
  )

  handlers.forEach((handler) =>
    chrome.webRequest.onBeforeRequest.removeListener(handler)
  )
  handlers = []

  activeRedirects.forEach((rule) => {
    const handler = (request: any) => {
      if (request.type !== 'main_frame' || request.method !== 'GET') {
        return
      }

      const url = new URL(request.url)
      url.host = rule.redirectHost

      return {
        redirectUrl: url.href
      }
    }
    handlers.push(handler)

    chrome.webRequest.onBeforeRequest.addListener(
      handler,
      { urls: [rule.origin] },
      ['blocking']
    )
  })
})
export {} //
