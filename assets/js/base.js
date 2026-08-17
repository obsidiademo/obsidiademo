/* Subdirectory base path — auto-detected for /akillikurs/ deployment */
const AKO_BASE = (function () {
  const path = window.location.pathname;
  if (path.includes('/akillikurs')) return '/akillikurs/';
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 1 && parts[parts.length - 1].includes('.')) parts.pop();
  return parts.length ? '/' + parts.join('/') + '/' : '/';
})();

function akoAsset(path) {
  return AKO_BASE + path.replace(/^\//, '');
}

function akoPage(page) {
  return AKO_BASE + page.replace(/^\//, '');
}
