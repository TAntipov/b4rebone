export default class Component {
  constructor(el) {
    if (new.target === Component) {
      throw new TypeError('Cannot construct BaseComponent instances directly');
    }

    this.el = (el instanceof HTMLElement) ? el : document.querySelector(el);
    if (this.el instanceof HTMLElement) {
      this.on('rendered', (e) => {
        // console.log(`Render ${this.constructor.name}`);
      });
    }

    if (new.target === Component) {
      throw new TypeError('Cannot construct BaseComponent instances directly');
    }
  }

  on(event, callback) {
    this.el.addEventListener(event, callback);
  }

  off(event, callback) {
    this.el.removeEventListener(event, callback);
  }

  render() {
    this.trigger('rendered');
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
