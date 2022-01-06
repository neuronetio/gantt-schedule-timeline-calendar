/**
 * Just ad blocker detector (ad blockers can slow down dom significantly)
 */
async function detectAdBlock() {
  let adBlockEnabled = false;
  const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  try {
    await fetch(new Request(googleAdUrl)).catch((_) => (adBlockEnabled = true));
  } catch (e) {
    adBlockEnabled = true;
  }
  return adBlockEnabled;
}
export default detectAdBlock;
