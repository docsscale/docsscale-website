# Drop folder for new images

Put each file in its folder with the file name shown. Tell your developer when
they're in. They are then optimised (AVIF/WebP at several sizes), placed and
shown to you as before/after. This folder is not published and not committed;
the optimised versions are.

**General rules**
- Screenshots: **PNG**. Photos: **JPG, quality 90+**. sRGB colour. No text or
  logos added on top.
- Sizes below are the minimum. Bigger is fine; the site makes the smaller
  versions itself.
- Every slot is cropped differently on phones, tablets and desktops. Keep the
  important part in the **centre**, with space around it.
- **Privacy:** screenshots must not show real patient names, phone numbers,
  emails or appointment details. Use demo contacts, or blur them before
  exporting. This matters legally for healthcare, not just visually.
- No AI-generated or AI-edited images (brand rule).

| Folder | File name(s) | What | Minimum size | Shape |
|---|---|---|---|---|
| `funnel-hero/` | `hero.png` | Click-to-Chair System overview: funnels + CRM dashboard + automations, e.g. a clean collage of real screenshots | **2400 × 1500** | 16:10 landscape, shown exactly |
| `funnel-gallery/` | `new-patient.png`, `service-promo.png`, `booking.png`, `application.png`, `reactivation.png`, `review.png` | Top of each funnel's landing page, in that order: Get New Patients · Fill Your Best Service Line · Kill the Phone Tag · Only Talk to the Right Patients · Win Back Dormant Patients · Build Your Google Reputation | **1800 × 1200** | 3:2 landscape. Cards show the **top strip** (about 1.8:1); the enlarged view shows the whole image. Capture a 1440-px-wide browser window and crop the top to 3:2. |
| `home-hero/` | `hero.jpg` | Homepage photo box (currently "Clinic photo: real team, real rooms"). A real photo of your team at work, or a dashboard on a screen | **1200 × 2000** | Tall portrait on desktop (about 0.55:1), nearly square on phones: keep the subject in the middle third |
| `home-ad-creative/` | `ad.jpg` or `ad.png` | Homepage "Ad preview" card photo. **Filled 6 Oct 2026 with a stock photo** (see "Sources and licences" below). A real ad you ran for a clinic (with the clinic's permission) can replace it later | **1600 × 1000** | Landscape, about 1.3–1.7:1: centre the key message |
| Paid ads page hero photo (`web/public/images/services/paid-ads-hero*`) | `paid-ads-hero/pexels-cedric-fauntleroy-4266931.jpg` (6000 × 4000; the site uses a centred 4500 × 3000 crop), added 10 Oct 2026 | Pexels, photo by Cedric Fauntleroy, https://www.pexels.com/photo/4266931/ (the owner chose it, 10 Oct 2026) | Pexels licence: free for commercial use, no permission needed | No |
| `about-founder/` | `founder.jpg` | About page founder photo (Abdul Samad), real, in the office | **1200 × 1600** | Portrait 3:4, face in the upper third |
| `team/` | `abdul-samad.jpg`, `ahmed-mustafa.jpg`, `mohsin.jpg`, `omar.jpg`, `owais.jpg`, `ali.jpg` | Team cards: head and shoulders, same background and lighting for everyone if possible | **1000 × 1000** | Square, face centred slightly above the middle |

The thank-you page reuses the funnel hero image unless you want a separate one
(same size and shape: add `funnel-hero/thank-you.png`).

## Sources and licences

Every image that isn't our own work is recorded here: where it came from and
what the licence allows. Check this before reusing an image anywhere else.

| Image on the site | Original file | Source | Licence | Credit required? |
|---|---|---|---|---|
| Homepage "Ad preview" card (`web/public/images/home/ad-example*`) | `home-ad-creative/ad.jpg`, from `dentist-matching-colour-tooth-enamel-with-whitening-chart.jpg` (6336 × 4224), added 6 Oct 2026 | Freepik | Freepik Premium licence (the owner's subscription; confirmed by the owner, 6 Oct 2026) | No |

The photo is shown as a sample ad: the card is labelled "Ad preview" and the alt
text calls it an example ad photo. It is not presented as our team or a client.

The paid ads hero photo shows a clinician and a patient with a tablet; the alt
text describes the scene. It is not presented as our team or a client.

