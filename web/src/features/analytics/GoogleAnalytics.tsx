// GA4 with Google Consent Mode v2 ("basic" mode), rendered only when
// GA_MEASUREMENT_ID is set.
// - Nothing is requested from Google until the visitor accepts: before a choice,
//   or after "Decline", the page only keeps a local queue (window.dataLayer)
//   and the analytics script is never downloaded.
// - "Accept" (or a returning visitor who accepted before) grants analytics
//   storage, then configures GA and loads the script, so the first page view is
//   already sent with consent; events queued before that are sent with it. Advertising signals are always denied (no advertising cookies; see
//   the Privacy Policy).
// - Browsers sending Global Privacy Control count as "declined".
// - Only docsscale.com sends data: staging and local builds show the banner but
//   never load GA (tests opt in with window.dsAnalyticsTest = true).
// SPA page changes are counted by GA4's enhanced measurement (history events).
import { CONSENT_STORAGE_KEY, GA_MEASUREMENT_ID } from '@/content/analytics';
import { ConsentBanner } from './ConsentBanner';

const bootstrap = (id: string) => `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
window.dsLoadAnalytics=function(){if(window.dsAnalyticsLoaded)return;if(!/^(www\\.)?docsscale\\.com$/.test(location.hostname)&&!window.dsAnalyticsTest)return;window.dsAnalyticsLoaded=true;
gtag("consent","update",{analytics_storage:"granted"});gtag("js",new Date());gtag("config",${JSON.stringify(id)});
var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id=${id}";document.head.appendChild(s)};
var c=null;try{c=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})}catch(e){}
if(c==="granted")window.dsLoadAnalytics();`;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootstrap(GA_MEASUREMENT_ID) }} />
      <ConsentBanner />
    </>
  );
}
