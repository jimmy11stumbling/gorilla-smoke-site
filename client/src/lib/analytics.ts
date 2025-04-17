import { useAnalytics } from '../components/AnalyticsProvider';

/**
 * Track an analytics event
 * 
 * @param eventName The name of the event to track
 * @param data Optional data to include with the event
 */
export function trackAnalyticsEvent(eventName: string, data?: any) {
  try {
    // Try to use the analytics hook for components
    const analytics = useAnalytics();
    if (analytics) {
      analytics.trackEvent(eventName, data);
      return;
    }
  } catch (e) {
    // If we're not in a component, fallback to the window method
    trackEventWithWindow(eventName, data);
  }
}

/**
 * Track an event using window object for non-component contexts
 * This is used as a fallback when the useAnalytics hook is not available
 */
function trackEventWithWindow(eventName: string, data?: any) {
  if (typeof window !== 'undefined') {
    // Dispatch a custom event that our analytics provider will listen for
    const event = new CustomEvent('analytics_tracking', {
      detail: {
        eventName,
        timestamp: Date.now(),
        data
      }
    });
    window.dispatchEvent(event);
  }
}

/**
 * Track a page view event
 * 
 * @param page The page that was viewed
 */
export function trackPageView(page: string) {
  trackAnalyticsEvent('page_view', { page });
}

/**
 * Track a menu view event
 * 
 * @param category The menu category that was viewed
 */
export function trackMenuView(category: string) {
  trackAnalyticsEvent('menu_view', { category });
}

/**
 * Track a menu item view event
 * 
 * @param itemId The ID of the menu item that was viewed
 * @param itemName The name of the menu item
 */
export function trackItemView(itemId: number, itemName: string) {
  trackAnalyticsEvent('item_view', { itemId, itemName });
}

/**
 * Track when a user clicks an external link
 * 
 * @param service The service they are navigating to (e.g., 'google_maps', 'ubereats')
 * @param url The URL they are navigating to
 */
export function trackExternalLink(service: string, url: string) {
  trackAnalyticsEvent('external_link_click', { service, url });
}

/**
 * Track when a user makes a reservation
 * 
 * @param date The date of the reservation
 * @param time The time of the reservation
 * @param partySize The size of the party
 * @param locationId The ID of the location
 */
export function trackReservation(date: string, time: string, partySize: number, locationId: string) {
  trackAnalyticsEvent('reservation_made', { date, time, partySize, locationId });
}

/**
 * Track when a user starts the order process
 * 
 * @param locationId The ID of the location
 * @param orderType The type of order (pickup, delivery, etc.)
 */
export function trackOrderStart(locationId: string, orderType: 'pickup' | 'delivery') {
  trackAnalyticsEvent('order_start', { locationId, orderType });
}

/**
 * Track when a user adds an item to their cart
 * 
 * @param itemId The ID of the item
 * @param itemName The name of the item
 * @param price The price of the item
 * @param quantity The quantity added
 */
export function trackAddToCart(itemId: number, itemName: string, price: number, quantity: number) {
  trackAnalyticsEvent('add_to_cart', { itemId, itemName, price, quantity });
}

/**
 * Track when a user completes an order
 * 
 * @param orderId The ID of the order
 * @param total The total price of the order
 * @param items The items in the order
 */
export function trackOrderComplete(orderId: string, total: number, items: any[]) {
  trackAnalyticsEvent('order_complete', { orderId, total, items });
}

/**
 * Track when a user searches for something
 * 
 * @param query The search query
 * @param resultsCount The number of results
 */
export function trackSearch(query: string, resultsCount: number) {
  trackAnalyticsEvent('search', { query, resultsCount });
}

/**
 * Track when a user shares content
 * 
 * @param contentType The type of content shared (e.g., 'menu_item', 'location')
 * @param contentId The ID of the content
 * @param platform The platform it was shared to (e.g., 'facebook', 'twitter')
 */
export function trackShare(contentType: string, contentId: string, platform: string) {
  trackAnalyticsEvent('share', { contentType, contentId, platform });
}

// Add a listener to the analytics provider to log events in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('analytics_tracking', (e: any) => {
    const { eventName, data } = e.detail;
    console.log(`[Analytics] ${eventName}:`, data);
  });
}