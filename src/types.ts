type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RedirectItem = {
  id: number
  origin: string
  redirectHost: string
  active: boolean
}

export type RedirectItemUpdate = PartialBy<
  RedirectItem,
  'origin' | 'redirectHost' | 'active'
>

export type RedirectList = RedirectItem[]
