///<reference types="chrome"/>

import { getRedirects } from '@/services/RedirectService'

// eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
let handlers: any[] = []

const loadRules = async () => {
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
      url.host =
        rule.newHost && rule.newHost.length > 0 ? rule.newHost : url.host

      if (
        rule.pathRegex &&
        rule.pathRegex.length > 0 &&
        rule.pathValue &&
        rule.pathValue.length > 0
      ) {
        // e.g.: "^\/(j)\/(\d+)\/?$" => /^\/(j)\/(\d+)\/?$/
        const match = new RegExp(rule.pathRegex)
        if (match.exec(url.pathname)) {
          // url.pathname can be e.g.: "/j/123456"
          // rule.pathValue can be e.g.: "/wc/$2/join" => /wc/123456/join
          url.pathname = url.pathname.replace(match, rule.pathValue)
        } else {
          return
        }
      }

      return {
        redirectUrl: url.href
      }
    }
    handlers.push(handler)

    chrome.webRequest.onBeforeRequest.addListener(
      handler,
      { urls: [`*://${rule.origin}/*`] },
      ['blocking']
    )
  })
}

chrome.storage.onChanged.addListener(loadRules)
loadRules()
export {} //
