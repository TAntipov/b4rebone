export default class BaseComponent {
  constructor(el) {
    this.el = (el instanceof HTMLElement) ? el : document.querySelector(el);
    if (new.target === BaseComponent) {
      throw new TypeError('Cannot construct BaseComponent instances directly');
    }
  }

  on(event, callback) {
    this.el.addEventListener(event, callback);
  }

  off(event, callback) {
    this.el.removeEventListener(event, callback);
  }

  trigger(event, data) {
    let e;
    if (window.CustomEvent) {
      e = new CustomEvent(event, { detail: data });
    } else {
      e = document.createEvent('CustomEvent');
      e.initCustomEvent(event, true, true, data);
    }
    this.el.dispatchEvent(e);
  }

  hide() {
    this.el.style.display = 'none';
  }

  show() {
    this.el.style.display = 'block';
  }
}
