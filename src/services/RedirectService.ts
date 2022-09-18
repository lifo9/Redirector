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

export async function deleteRule(id: number) {
  const redirects = await getRedirects()
  const deleteOrigin = redirects.find((redirect) => redirect.id === id)?.filter

  if (deleteOrigin) {
    chrome.permissions.remove({
      origins: [deleteOrigin]
    })
  }
  await saveRedirects(redirects.filter((redirect) => redirect.id !== id))
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
