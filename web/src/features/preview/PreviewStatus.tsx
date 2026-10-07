// Only on the preview site (preview.docsscale.com), never on the live site: a
// small bar that says when this preview was built, and reloads the page by
// itself when a newer one arrives (after a save in the editing screen). The
// deploy uploads version.txt last, so a change there means the new preview is
// complete.
const SCRIPT = `
(function () {
  var bar = document.getElementById('preview-status');
  var seen = null;
  function check() {
    fetch('/version.txt', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.text() : null; })
      .then(function (text) {
        if (!text) return;
        var built = (text.match(/\\((.+)\\)/) || [])[1];
        if (seen === null) {
          seen = text;
          if (built) bar.textContent = 'Preview · built ' + new Date(built).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · updates by itself after you save';
        } else if (text !== seen) {
          bar.textContent = 'Preview · new version, reloading…';
          location.reload();
        }
      })
      .catch(function () {});
  }
  check();
  setInterval(check, 10000);
})();
`;

export function PreviewStatus() {
  if (process.env.CONTENT_PREVIEW !== '1') return null;
  return (
    <>
      <div
        id="preview-status"
        style={{
          position: 'fixed',
          left: 12,
          bottom: 12,
          zIndex: 1000,
          background: '#1A1A1A',
          color: '#FAF9F6',
          font: '600 12px/1.3 system-ui, sans-serif',
          padding: '8px 12px',
          borderRadius: 999,
          opacity: 0.92,
        }}
      >
        Preview
      </div>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </>
  );
}
