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
# preview: password like staging. cms: closed (403) until the editing app is
# installed, then a redirect to its sign-in (302/307) or 401.
for path in / /blog/ /robots.txt; do
  check "https://preview.docsscale.com$path" "401"
  check "https://cms.docsscale.com$path" "401 403 302 307"
done
exit $fail
