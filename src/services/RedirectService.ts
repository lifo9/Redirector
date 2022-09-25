import type { RedirectList } from '@/types'

export async function getRedirects(): Promise<RedirectList> {
  // return JSON.parse((window as any).localStorage.getItem('redirects')) || []
  const redirects = (await readLocalStorage('redirects')) as string
  return redirects ? JSON.parse(redirects) : []
}

export async function saveRedirects(redirects: RedirectList) {
  // ;(window as any).localStorage.setItem('redirects', JSON.stringify(redirects))
  await chrome.storage.local.set({ redirects: JSON.stringify(redirects) })
}

export async function removeUnusedPermissions(newOrigins: string[]) {
  if (!newOrigins) {
    newOrigins = []
  }

  await new Promise<void>((resolve) => {
    // eslint-disable-next-line no-undef
    chrome.permissions.getAll(async (permissions) => {
      await new Promise<void>((resolve) => {
        let deleted = 0
        const rulesToDelete =
          permissions.origins?.filter(
            (origin) => !newOrigins.includes(origin)
          ) || []
        if (rulesToDelete.length === 0) {
          resolve()
        }

        rulesToDelete.forEach((origin) => {
          // eslint-disable-next-line no-undef
          chrome.permissions.remove(
            {
              origins: [origin]
            },
            () => {
              deleted++
              if (deleted === rulesToDelete.length) {
                resolve()
              }
            }
          )
        })
      })
      resolve()
    })
  })
}

export async function importRules(redirects: string) {
  saveRedirects(JSON.parse(redirects))
}

export function downloadRules(
  content: string,
  fileName: string,
  contentType: string = 'text/plain'
) {
  const a = document.createElement('a')
  const file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

const readLocalStorage = async (key: string) => {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      if (result[key] === undefined) {
        resolve(undefined)
      } else {
        resolve(result[key])
      }
    })
  })
}
