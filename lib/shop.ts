import type { Product } from '@/components/app-context'

// Which marketplace "Shop now" sends people to. Swap this to build real
// affiliate deep links once you have an Amazon Associates / Flipkart
// Affiliate (or similar) account — see the two builder functions below.
export type Marketplace = 'amazon' | 'flipkart'

const DEFAULT_MARKETPLACE: Marketplace = 'amazon'

function query(product: Product) {
  return `${product.brand} ${product.name}`.trim()
}

/**
 * Builds a marketplace search URL for a product.
 *
 * These are plain search links, not affiliate links. To monetize (per the
 * "AI rating -> shop -> affiliate commission" model), replace the query
 * params below with your actual tagged affiliate links once you have:
 *   - Amazon: an Associates tag -> append `&tag=yourtag-20`
 *   - Flipkart: an Affiliate ID -> use their deep-link API/format
 * Until then, this at least gets the user to a real, buyable product page
 * instead of a dead "Shop now" button.
 */
export function buildShopUrl(
  product: Product,
  marketplace: Marketplace = DEFAULT_MARKETPLACE,
): string {
  const q = encodeURIComponent(query(product))
  if (marketplace === 'flipkart') {
    return `https://www.flipkart.com/search?q=${q}`
  }
  return `https://www.amazon.com/s?k=${q}`
}

/**
 * Opens the shop link. Uses the native in-app browser via @capacitor/browser
 * when running inside the Capacitor iOS shell (so the user never leaves the
 * app), and falls back to a normal new-tab open in a regular web browser
 * (e.g. during `next dev`).
 */
export async function openShopLink(
  product: Product,
  marketplace: Marketplace = DEFAULT_MARKETPLACE,
) {
  const url = buildShopUrl(product, marketplace)
  try {
    // Dynamic import so the web build doesn't require the native plugin to
    // be installed to compile — it's only needed at runtime on-device.
    const { Browser } = await import('@capacitor/browser')
    await Browser.open({ url })
  } catch {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }
}