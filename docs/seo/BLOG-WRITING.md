# How we write blog posts

The standing guide for every blog draft, whoever writes it (owner, 12 Oct
2026). The checks in `cms/lib/seo/post-lint.ts` enforce the parts a program can
judge; they appear on the SEO dashboard under Content inventory, "Before you
publish". The rest is judgement. CLAUDE.md's brand and content-quality rules
always apply on top of this.

The voice is taken from the owner's published post,
[Google Business Profile for dentists](../../content/posts/google-business-profile-for-dentists/index.mdoc).
Read it before writing.

## The voice

- **A practice owner talking to another practice owner.** "We" for DocsScale,
  "you" for the reader. Plain words a dentist or chiropractor uses, not
  marketing terms.
- **Short sentences, mixed with longer ones.** "They already trust you. They do
  not need an ad." A paragraph is two to four sentences.
- **Concrete over general.** "Call your own number at 5:30 pm and tap your own
  booking link" beats "audit your patient journey".
- **Honest about limits.** Say what does not help, what takes time, and what
  the numbers came from ("from the whole system, not from the profile alone").
- **No filler.** No warm-up paragraph, no "in today's world", no summing up
  what was just said. The checker lists the phrases it refuses; don't work
  around it with synonyms.
- **No long dashes.** Use a comma, a colon or a full stop.

## The shape of a post

1. **Answer first.** The opening paragraph (60 words or fewer) answers the
   search phrase directly. The detail follows.
2. **Headings a reader can scan,** in the order they would act, each one a
   step or a question. The focus keyword goes in the title, the main heading,
   the description and the opening paragraphs, once each, naturally.
3. **One real DocsScale example,** from our results pages or a case study the
   owner confirmed, with the numbers exactly as published. Fill in "Only
   DocsScale could say" with what it is.
4. **Every figure has a source linked in the same section:** our results page
   for our own numbers, the original study for anyone else's. No figure we
   cannot show.
5. **Two or three key takeaways** and **two or three questions** people really
   ask (the FAQ fields), each answered in two or three plain sentences.
6. **At least two links to our own pages** in the text, where they help the
   reader (the service or industry page the post supports, the results page).

## Before handing a draft to the owner

- Every check under "Before you publish" passes, or the reason it can't is in
  the pull request.
- The focus keyword is not already another page's (the checker says which).
  If it is, improve that page instead of writing a second one.
- Read it aloud once. Anything you would not say to a practice owner across a
  desk comes out.
- No images made or edited by AI; real photos only, with source and licence
  recorded, and never a patient without written permission.
