// Spam trap: a "website" field that people never see or fill in, but form-filling
// bots do. The lead handler quietly drops any submission where it has a value
// (server/public_html/_server/lead-handler.php). Positioned off screen rather
// than display:none, which some bots detect; skipped by keyboard and screen readers.
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', left: -10000, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}
    >
      <label>
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/** The honeypot's value from a submitted form ('' for people). */
export function honeypotValue(form: HTMLFormElement): string {
  const input = form.elements.namedItem('website');
  return input instanceof HTMLInputElement ? input.value : '';
}
