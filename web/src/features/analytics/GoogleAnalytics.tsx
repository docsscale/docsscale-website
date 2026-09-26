// GA4 with Google Consent Mode v2, rendered only when GA_MEASUREMENT_ID is set.
// - Before any choice: analytics storage denied, so GA sets no cookies and sends
//   only cookieless pings. Advertising storage is always denied (the site uses
//   no advertising cookies; see the Privacy Policy).
// - A returning visitor's saved choice is applied here, before GA starts, so
//   their first page view already respects it.
// - Browsers sending Global Privacy Control count as "declined".
// SPA page changes are counted by GA4's enhanced measurement (history events).
import { CONSENT_STORAGE_KEY, GA_MEASUREMENT_ID } from '@/content/analytics';
import { ConsentBanner } from './ConsentBanner';

const bootstrap = (id: string) => `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
var c=null;try{c=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})}catch(e){}
if(navigator.globalPrivacyControl&&c!=="granted")c="denied";
gtag("consent","default",{analytics_storage:c==="granted"?"granted":"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",wait_for_update:500});
gtag("js",new Date());gtag("config",${JSON.stringify(id)});`;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootstrap(GA_MEASUREMENT_ID) }} />
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <ConsentBanner />
    </>
  );
}
