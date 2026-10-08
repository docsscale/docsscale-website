#!/usr/bin/env bash
# The editing site and the preview site must never be readable or indexable by
# the public (docs/COMPLETION-PLAN.md, section 5, item 7). Asks each address as
# an anonymous visitor would and fails if it answers with content, or without
# "noindex". Read-only; needs network access.
#   bash tests/server/hidden-sites.sh
set -u
fail=0
check() {
  local url=$1 want=$2
  local headers status
  headers=$(curl -s -o /dev/null -D - --max-time 20 "$url")
  status=$(printf '%s' "$headers" | awk 'NR==1 {print $2}')
  # Hostinger's own protection sometimes refuses a request outright (403, seen
  # from GitHub's machines on 7 Oct 2026). A refusal shows nothing and gives a
  # search engine nothing to index, so it passes whatever its headers say.
  if [[ "$status" == "403" ]]; then
    echo "ok   $url  403, refused"
    return
  fi
  if [[ ! " $want " =~ " $status " ]]; then
    echo "FAIL $url answered ${status:-nothing}, expected one of: $want"
    fail=1
  elif ! printf '%s' "$headers" | grep -qi '^x-robots-tag:.*noindex'; then
    echo "FAIL $url answered $status without X-Robots-Tag: noindex"
    fail=1
  else
    echo "ok   $url  $status, noindex"
  fi
}
# preview: password like staging.
for path in / /blog/ /robots.txt; do
  check "https://preview.docsscale.com$path" "401"
done
# cms: the editing app. Its address redirects to the sign-in screen, which is
# the only page it has; anything else is "not found". (403: the address closed
# by server/cms/.htaccess, before the app is installed.)
check "https://cms.docsscale.com/" "302 307 308 403"
check "https://cms.docsscale.com/keystatic" "200 401 403"
# (308: the app first drops the trailing slash, then answers "not found".)
check "https://cms.docsscale.com/blog/" "404 308 403"
check "https://cms.docsscale.com/blog" "404 403"
# robots.txt is the one page the app answers for everyone, and it must turn
# every crawler away (cms/app/robots.ts, since 8 Oct 2026).
robots=$(curl -s -D - --max-time 20 "https://cms.docsscale.com/robots.txt")
if printf '%s' "$robots" | awk 'NR==1 {exit !($2 == "403")}'; then
  echo "ok   https://cms.docsscale.com/robots.txt  403, refused"
elif printf '%s' "$robots" | grep -qi '^x-robots-tag:.*noindex' && printf '%s' "$robots" | grep -qi '^disallow: */ *$'; then
  echo "ok   https://cms.docsscale.com/robots.txt  disallows everything, noindex"
else
  echo "FAIL https://cms.docsscale.com/robots.txt does not turn every crawler away"
  fail=1
fi
exit $fail
