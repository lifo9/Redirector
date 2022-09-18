type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RedirectItem = {
  id: number
  filter: string
  redirectUrl: string
  active: boolean
}

export type RedirectItemUpdate = PartialBy<
  RedirectItem,
  'filter' | 'redirectUrl' | 'active'
>

export type RedirectList = RedirectItem[]
