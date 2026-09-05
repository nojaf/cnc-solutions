/**
 * Probe for the contact form: the Turnstile widget block, whether it issued
 * a token, and the gap down to the submit button.
 * Runs inside the page via scripts/compare.mjs.
 *
 * api.js is deferred, so compare's 400ms settle is occasionally too short and
 * the probe reports widget: "MISSING" with a null block. Re-run that viewport
 * before treating it as a real difference.
 */
export default () => {
  const num = (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? v : Math.round(n * 10) / 10;
  };
  const r = (el) => el.getBoundingClientRect();
  const form = document.querySelector("form");
  // On localhost both sites use Cloudflare's test key, which renders a dummy
  // widget with no iframe. The hidden response input is always there.
  const token = form.querySelector("input[name=cf-turnstile-response]");
  // Gatsby wraps the widget in .form-group, the port in a mb-4 div.
  const block = token ? token.closest("form > div") : null;
  const button = form.querySelector("button[type=submit]");
  const message = form.querySelector("textarea");
  return {
    widget: token ? "rendered" : "MISSING",
    hasToken: token ? token.value.length > 0 : false,
    block: block
      ? {
          w: num(r(block).width),
          h: num(r(block).height),
          left: num(r(block).left),
          marginBottom: num(getComputedStyle(block).marginBottom),
        }
      : null,
    messageToBlock:
      block && message ? num(r(block).top - r(message).bottom) : null,
    blockToButton:
      block && button ? num(r(button).top - r(block).bottom) : null,
    formHeight: num(r(form).height),
  };
};
