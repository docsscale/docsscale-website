// GA4 with Google Consent Mode v2 ("basic" mode), rendered only when
// GA_MEASUREMENT_ID is set.
// - Nothing is requested from Google until the visitor accepts: before a choice,
//   or after "Decline", the page only keeps a local queue (window.dataLayer)
//   and the analytics script is never downloaded.
// - "Accept" (or a returning visitor who accepted before) grants analytics
//   storage, then configures GA and loads the script, so the first page view is
//   already sent with consent; events queued before that are sent with it.
//   Advertising signals are always denied (no advertising cookies; see the
//   Privacy Policy).
// - Browsers sending Global Privacy Control count as "declined".
// - Only docsscale.com sends data: staging and local builds show the banner but
//   never load GA (tests opt in with window.dsAnalyticsTest = true).
// - Team browsers (marked once with ?team=on, see content/analytics.ts) send
//   traffic_type=internal, which GA4's Internal Traffic data filter excludes.
// - Microsoft Clarity loads with GA (same consent) on docsscale.com only, not for
//   team browsers; forms are masked (data-clarity-mask).
// SPA page changes are counted by GA4's enhanced measurement (history events).
import {
  CLARITY_PROJECT_ID,
  CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
  TEAM_MESSAGES,
  TEAM_STORAGE_KEY,
} from '@/content/analytics';
import { ConsentBanner } from './ConsentBanner';
import { WebVitals } from './WebVitals';

// Microsoft Clarity, inside dsLoadAnalytics (so only after consent): the real
// site only (never tests or staging) and never for team-marked browsers.
const clarity = (id: string) =>
  id
    ? `if(/^(www\\.)?docsscale\\.com$/.test(location.hostname)&&!team){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script",${JSON.stringify(id)});window.clarity("consent")}`
    : '';

const bootstrap = (id: string) => `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
(function(){try{var u=new URL(location.href),t=u.searchParams.get("team");if(t!=="on"&&t!=="off")return;
if(t==="on")localStorage.setItem(${JSON.stringify(TEAM_STORAGE_KEY)},"1");else localStorage.removeItem(${JSON.stringify(TEAM_STORAGE_KEY)});
u.searchParams.delete("team");history.replaceState(null,"",u.pathname+u.search+u.hash);
alert(t==="on"?${JSON.stringify(TEAM_MESSAGES.on)}:${JSON.stringify(TEAM_MESSAGES.off)})}catch(e){}})();
var team=false;try{team=localStorage.getItem(${JSON.stringify(TEAM_STORAGE_KEY)})==="1"}catch(e){}
gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
window.dsLoadAnalytics=function(){if(window.dsAnalyticsLoaded)return;if(!/^(www\\.)?docsscale\\.com$/.test(location.hostname)&&!window.dsAnalyticsTest)return;window.dsAnalyticsLoaded=true;
gtag("consent","update",{analytics_storage:"granted"});gtag("js",new Date());gtag("config",${JSON.stringify(id)},team?{traffic_type:"internal"}:{});
var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id=${id}";document.head.appendChild(s);
${clarity(CLARITY_PROJECT_ID)}};
var c=null;try{c=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)})}catch(e){}
if(c==="granted")window.dsLoadAnalytics();`;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootstrap(GA_MEASUREMENT_ID) }} />
      <ConsentBanner />
      <WebVitals />
    </>
  );
}
