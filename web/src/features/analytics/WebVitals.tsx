'use client';

// Real-user Core Web Vitals (LCP, INP, CLS) as GA4 events, one per metric and
// page view, sent when the page is hidden (that's when the final values are
// known). Like every other event they go through gtag: nothing leaves the
// browser before "Accept" (see GoogleAnalytics.tsx), and after "Decline" they
// stay in the local queue. Event names and parameters: docs/TRACKING.md.
import { useEffect } from 'react';
import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

function send(metric: Metric) {
  window.gtag?.('event', metric.name, {
    // GA4's event value must be an integer: milliseconds, or CLS × 1000.
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_rating: metric.rating,
    page_path: window.location.pathname,
  });
}

export function WebVitals() {
  useEffect(() => {
    onLCP(send);
    onINP(send);
    onCLS(send);
  }, []);
  return null;
}
