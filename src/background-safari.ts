///<reference types="chrome"/>

import { getRedirects } from '@/services/RedirectService'

type Tranformation = {
  host?: string
}

async function loadRules() {
  const activeRedirects = (await getRedirects()).filter(
    (rule) => rule.active === true
  )

  await new Promise<void>((resolve) => {
    chrome.declarativeNetRequest.getDynamicRules(async (rules) => {
      await new Promise<void>((resolve) => {
        chrome.declarativeNetRequest.updateDynamicRules(
          {
            removeRuleIds: rules.map((rule) => rule.id)
          },
          () => resolve()
        )
      })
      resolve()
    })
  })

  activeRedirects.forEach((rule) => {
    const transformation: Tranformation = {}
    if (rule.newHost && rule.newHost.length > 0) {
      transformation.host = rule.newHost
    } else {
      return
    }

    const ruleDeclaration: any = {
      id: rule.id,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: { transform: { ...transformation } }
      },
      condition: {
        urlFilter: rule.origin,
        resourceTypes: ['main_frame']
      }
    }

    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [ruleDeclaration]
    })
  })
}

loadRules()
chrome.storage.onChanged.addListener(loadRules)
export {} //
