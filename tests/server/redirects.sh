#!/usr/bin/env bash
# Checks the v1.2 industry-page redirects on a live host (Apache applies
# .htaccess; the local test server doesn't). Every old URL must answer with one
# 301 straight to its /industries/ page, keeping the query string, and the new
# page must return 200.
#   bash tests/server/redirects.sh https://docsscale.com
#   bash tests/server/redirects.sh https://staging.docsscale.com user:password
set -uo pipefail
BASE="${1:-https://docsscale.com}"; AUTH=(); [[ -n "${2:-}" ]] && AUTH=(-u "$2")
HOST="${BASE#https://}"; HOST="${HOST#www.}"
pass=0; fail=0
check() { # url expected-location
  local out code loc
  out=$(curl -s ${AUTH[@]+"${AUTH[@]}"} -o /dev/null -w '%{http_code} %{redirect_url}' "$1")
  code=${out%% *}; loc=${out#* }
  if [[ "$code" == 301 && "$loc" == "$2" ]]; then
    final=$(curl -s ${AUTH[@]+"${AUTH[@]}"} -o /dev/null -w '%{http_code}' "$loc")
    if [[ "$final" == 200 ]]; then pass=$((pass+1)); return; fi
    echo "FAIL $1 → $loc returned $final"; fail=$((fail+1)); return
  fi
  echo "FAIL $1: got $code → [$loc], want 301 → [$2]"; fail=$((fail+1))
}
for slug in dental chiropractic physical-therapy med-spa; do
  check "$BASE/services/$slug/" "https://$HOST/industries/$slug/"
  check "$BASE/services/$slug" "https://$HOST/industries/$slug/"
  check "$BASE/services/$slug/?utm_source=test&x=1" "https://$HOST/industries/$slug/?utm_source=test&x=1"
  # the old pages' own files (still on the server: deploys don't delete)
  check "$BASE/services/$slug/index.html" "https://$HOST/industries/$slug/"
  check "$BASE/services/$slug/index.txt" "https://$HOST/industries/$slug/"
  check "$BASE/services/$slug/__next._full.txt" "https://$HOST/industries/$slug/"
done
# www + old URL: still one hop (production only)
if [[ "$HOST" == docsscale.com ]]; then
  check "https://www.docsscale.com/services/dental/" "https://docsscale.com/industries/dental/"
fi
# untouched URLs: 200 (on www: the usual 301 to the bare domain)
want=200; [[ "$BASE" == https://www.* ]] && want=301
for path in /services/ /services/index.txt /industries/ /; do
  code=$(curl -s ${AUTH[@]+"${AUTH[@]}"} -o /dev/null -w '%{http_code}' "$BASE$path")
  if [[ "$code" == "$want" ]]; then pass=$((pass+1)); else echo "FAIL $path: $code, want $want"; fail=$((fail+1)); fi
done
echo "redirects: $pass passed, $fail failed"
[[ $fail -eq 0 ]]
