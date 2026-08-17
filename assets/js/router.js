/* Akıllı Okul — Router */
const Router = {
  routes: {},
  currentParams: {},
  register(path, handler) { this.routes[path] = handler; },
  navigate(hash) { window.location.hash = hash; },
  parse() {
    const hash = window.location.hash.slice(1) || '/';
    const [hashPath, queryStr] = hash.split('?');
    const params = {};
    if (queryStr) queryStr.split('&').forEach(p => {
      const [k, v] = p.split('=');
      try { params[k] = decodeURIComponent(v || ''); } catch { params[k] = v || ''; }
    });
    this.currentParams = params;
    const segments = (hashPath || '/').split('/').filter(Boolean);
    const path = segments.length ? '/' + segments.join('/') : '/';
    return { path, segments, params };
  },
  match(route, segments) {
    const rParts = route.split('/').filter(Boolean);
    if (rParts.length !== segments.length) return null;
    const params = {};
    for (let i = 0; i < rParts.length; i++) {
      if (rParts[i].startsWith(':')) params[rParts[i].slice(1)] = segments[i];
      else if (rParts[i] !== segments[i]) return null;
    }
    return params;
  },
  resolve() {
    const { segments, params, path: parsedPath } = this.parse();
    const path = parsedPath || (segments.length ? '/' + segments.join('/') : '/');
    if (this.routes[path]) return { handler: this.routes[path], params: { ...params, ...this.currentParams } };
    for (const route of Object.keys(this.routes)) {
      if (route.includes(':')) {
        const m = this.match(route, segments);
        if (m) return { handler: this.routes[route], params: { ...m, ...params, ...this.currentParams } };
      }
    }
    return { handler: Views.notFound, params };
  },
  render() {
    const { handler, params } = this.resolve();
    const app = document.getElementById('app');
    if (!app) return;
    try {
      const html = handler(params);
      app.innerHTML = html || Views.notFound();
    } catch (e) {
      console.error(e);
      try { app.innerHTML = Views.error('Sayfa yüklenirken bir hata oluştu.'); }
      catch { app.innerHTML = '<div class="error-page"><h1>Bir sorun oluştu</h1><a href="#/" class="btn btn-primary">Ana Sayfa</a></div>'; }
      return;
    }
    try { App.afterRender(params); } catch (e) { console.error(e); }
    window.scrollTo(0, 0);
  },
  init() {
    window.addEventListener('hashchange', () => this.render());
    if (!window.location.hash) window.location.hash = '/';
    else this.render();
  }
};
