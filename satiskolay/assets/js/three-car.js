/* SatışKolay — Procedural Three.js Car Viewer */
window.SK = window.SK || {};

SK.CarViewer = class CarViewer {
  constructor(container, options = {}) {
    this.container = typeof container === "string" ? document.querySelector(container) : container;
    if (!this.container || !window.THREE) return;
    this.options = Object.assign({ autoRotate: true, interactive: true }, options);
    this.color = options.color || 0x1a3a52;
    this._init();
  }

  _init() {
    const w = this.container.clientWidth || 400;
    const h = this.container.clientHeight || 300;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    this.camera.position.set(4.2, 1.8, 5.2);
    this.camera.lookAt(0, 0.4, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    if ("outputColorSpace" in this.renderer && THREE.SRGBColorSpace) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else if ("outputEncoding" in this.renderer && THREE.sRGBEncoding) {
      this.renderer.outputEncoding = THREE.sRGBEncoding;
    }
    this.container.innerHTML = "";
    this.container.appendChild(this.renderer.domElement);

    const amb = new THREE.AmbientLight(0xffffff, 0.85);
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(5, 8, 4);
    const fill = new THREE.DirectionalLight(0x1fa6a8, 0.35);
    fill.position.set(-4, 3, -2);
    this.scene.add(amb, key, fill);

    // ground shadow disc
    const shadowGeo = new THREE.CircleGeometry(2.4, 48);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x173042, transparent: true, opacity: 0.12 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    this.scene.add(shadow);

    this.car = this._buildCar(this.color);
    this.scene.add(this.car);

    this.isDown = false;
    this.prevX = 0;
    this.prevY = 0;
    this.rotY = 0.6;
    this.rotX = 0.15;
    this.targetZoom = 1;
    this.zoom = 1;

    if (this.options.interactive) this._bindEvents();
    this._onResize = () => this.resize();
    window.addEventListener("resize", this._onResize);
    this.animate = this.animate.bind(this);
    this.raf = requestAnimationFrame(this.animate);
  }

  _buildCar(colorHex) {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.55, roughness: 0.35 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1f24, metalness: 0.4, roughness: 0.5 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xa8d4e0, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.55 });
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x1fa6a8, metalness: 0.3, roughness: 0.4 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.55, 1.55), bodyMat);
    body.position.y = 0.55;
    body.castShadow = true;
    group.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 1.35), bodyMat);
    cabin.position.set(-0.15, 1.05, 0);
    group.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.08, 1.2), darkMat);
    roof.position.set(-0.15, 1.35, 0);
    group.add(roof);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 1.25), glassMat);
    windshield.position.set(0.68, 1.05, 0);
    windshield.rotation.z = -0.35;
    group.add(windshield);

    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 1.2), glassMat);
    rearGlass.position.set(-1.0, 1.05, 0);
    rearGlass.rotation.z = 0.3;
    group.add(rearGlass);

    // wheels
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 24);
    const rimGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
    [[1.05, 0.85], [1.05, -0.85], [-1.05, 0.85], [-1.05, -0.85]].forEach(([x, z]) => {
      const wheel = new THREE.Mesh(wheelGeo, darkMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.38, z);
      group.add(wheel);
      const rim = new THREE.Mesh(rimGeo, accentMat);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(x, 0.38, z);
      group.add(rim);
    });

    // lights
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.35), new THREE.MeshStandardMaterial({ color: 0xf7fafc, emissive: 0xddeeff, emissiveIntensity: 0.4 }));
    head.position.set(1.62, 0.6, 0.45);
    group.add(head);
    const head2 = head.clone();
    head2.position.z = -0.45;
    group.add(head2);

    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.35), new THREE.MeshStandardMaterial({ color: 0xc0392b, emissive: 0xaa2222, emissiveIntensity: 0.35 }));
    tail.position.set(-1.62, 0.6, 0.48);
    group.add(tail);
    const tail2 = tail.clone();
    tail2.position.z = -0.48;
    group.add(tail2);

    group.rotation.y = 0.6;
    this.bodyMat = bodyMat;
    return group;
  }

  _bindEvents() {
    const el = this.renderer.domElement;
    const down = (x, y) => { this.isDown = true; this.prevX = x; this.prevY = y; };
    const move = (x, y) => {
      if (!this.isDown) return;
      const dx = x - this.prevX;
      const dy = y - this.prevY;
      this.rotY += dx * 0.008;
      this.rotX = Math.max(-0.25, Math.min(0.45, this.rotX + dy * 0.005));
      this.prevX = x; this.prevY = y;
      this.options.autoRotate = false;
    };
    const up = () => { this.isDown = false; };

    el.addEventListener("mousedown", (e) => down(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    window.addEventListener("mouseup", up);
    el.addEventListener("touchstart", (e) => {
      const t = e.touches[0]; down(t.clientX, t.clientY);
    }, { passive: true });
    el.addEventListener("touchmove", (e) => {
      const t = e.touches[0]; move(t.clientX, t.clientY);
    }, { passive: true });
    el.addEventListener("touchend", up);
    el.addEventListener("wheel", (e) => {
      e.preventDefault();
      this.targetZoom = Math.max(0.7, Math.min(1.6, this.targetZoom + (e.deltaY > 0 ? -0.08 : 0.08)));
    }, { passive: false });
  }

  setColor(hex) {
    if (!this.bodyMat) return;
    this.bodyMat.color.set(hex);
  }

  setAutoRotate(v) { this.options.autoRotate = v; }

  zoomIn() { this.targetZoom = Math.min(1.6, this.targetZoom + 0.15); }
  zoomOut() { this.targetZoom = Math.max(0.7, this.targetZoom - 0.15); }

  resize() {
    if (!this.container || !this.renderer) return;
    const w = this.container.clientWidth || 400;
    const h = this.container.clientHeight || 300;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  animate() {
    this.raf = requestAnimationFrame(this.animate);
    if (this.options.autoRotate) this.rotY += 0.004;
    this.zoom += (this.targetZoom - this.zoom) * 0.08;
    if (this.car) {
      this.car.rotation.y = this.rotY;
      this.car.rotation.x = this.rotX;
      this.car.scale.setScalar(this.zoom);
    }
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this._onResize);
    if (this.renderer) {
      this.renderer.dispose();
      this.container.innerHTML = "";
    }
  }
};
