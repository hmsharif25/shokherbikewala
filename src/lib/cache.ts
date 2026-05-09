const APP_VERSION_KEY = 'sbw_app_version'
const STORE_KEY = 'sbw_store'

export function initCacheManagement() {
  const currentVersion = import.meta.env.VITE_APP_VERSION || __APP_VERSION__
  const storedVersion = localStorage.getItem(APP_VERSION_KEY)

  if (storedVersion && storedVersion !== currentVersion) {
    localStorage.removeItem(STORE_KEY)

    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name))
      })
    }
  }

  localStorage.setItem(APP_VERSION_KEY, currentVersion)
}

declare const __APP_VERSION__: string
