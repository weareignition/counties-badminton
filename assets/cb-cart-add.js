import { CartLinesUpdateEvent } from '@shopify/events';
import { fetchConfig } from '@theme/utilities';

/**
 * Adds items to the cart the way Horizon's product form does: it dispatches a CartLinesUpdateEvent from `source`
 * and resolves it with the new cart, so the cart count, cart drawer and anything else listening update.
 *
 * @param {HTMLElement} source - The element the event is dispatched from.
 * @param {{ id: string | number, quantity?: number, properties?: Record<string, string> }[]} items - Cart lines to add.
 * @param {{ productId?: string, sourceName?: string }} [options]
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function cbAddToCart(source, items, options = {}) {
  const lines = items.map((item) => ({ merchandiseId: String(item.id), quantity: item.quantity || 1 }));
  const sectionIds = [...document.querySelectorAll('cart-items-component')]
    .map((element) => (element instanceof HTMLElement ? element.dataset.sectionId : ''))
    .filter(Boolean);

  const payload = {
    items: items.map((item) => ({ id: item.id, quantity: item.quantity || 1, properties: item.properties || {} })),
  };
  if (sectionIds.length) payload.sections = sectionIds.join(',');

  const deferred = CartLinesUpdateEvent.createPromise();
  source.dispatchEvent(new CartLinesUpdateEvent({ action: 'add', context: 'product', lines, promise: deferred.promise }));

  try {
    const response = await fetch(Theme.routes.cart_add_url, fetchConfig('json', { body: JSON.stringify(payload) }));
    const result = await response.json();
    const cart = await fetchCart();
    const detail = {
      items: cart.items,
      source: options.sourceName || 'cb-cart-add',
      sourceId: source.id,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      productId: options.productId,
    };

    if (result.status) {
      deferred.resolve({ cart: CartLinesUpdateEvent.createCartFromAjaxResponse(cart), detail: { ...detail, didError: true } });
      return { ok: false, message: result.description || result.message };
    }

    deferred.resolve({
      cart: CartLinesUpdateEvent.createCartFromAjaxResponse(cart),
      detail: { ...detail, sections: result.sections, didError: false },
    });
    return { ok: true };
  } catch (error) {
    console.error(error);
    deferred.reject(error);
    return { ok: false };
  }
}

/** The current cart, through Horizon's cart items component when the page has one. */
async function fetchCart() {
  const items = document.querySelector('cart-items-component');
  if (items) {
    await customElements.whenDefined('cart-items-component');
    if (typeof items.fetchCartData === 'function') return items.fetchCartData();
  }
  const response = await fetch(`${Theme.routes.cart_url}.json`, { headers: { Accept: 'application/json' } });
  return response.json();
}
