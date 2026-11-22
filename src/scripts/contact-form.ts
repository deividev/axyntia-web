import { site } from '../config/site';
import {
  buildFormspreeBody,
  buildMailtoUrl,
  getSubmitMode,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from '../lib/contact';
import type { ServiceValue } from '../lib/services';

const form = document.querySelector<HTMLFormElement>('#contact-form');
const summary = document.getElementById('contact-summary');
const status = document.getElementById('contact-status');
const alt = document.getElementById('contact-alt');
const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]');

const FIELDS: ContactField[] = ['nombre', 'email', 'mensaje', 'privacidad'];
const SUBMIT_LABEL = 'Enviar mensaje';

if (form && summary && status && alt && button) {
  let sending = false;
  let shown: ContactErrors = {};

  const control = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

  const read = (): ContactValues => ({
    nombre: control('nombre').value,
    email: control('email').value,
    empresa: control('empresa').value,
    servicio: control('servicio').value as ServiceValue,
    mensaje: control('mensaje').value,
    privacidad: (control('privacidad') as HTMLInputElement).checked,
    honeypot: control('_gotcha').value,
  });

  const render = (): void => {
    for (const f of FIELDS) {
      const el = control(f);
      const p = document.getElementById(`${f}-error`);
      const msg = shown[f];
      if (p) p.textContent = msg ?? '';
      if (msg) {
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', `${f}-error`);
      } else {
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');
      }
    }
    summary.replaceChildren();
    const entries = FIELDS.filter((f) => shown[f]);
    if (entries.length > 0) {
      const title = document.createElement('p');
      title.textContent = 'Revisa estos campos:';
      const ul = document.createElement('ul');
      for (const f of entries) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${f}`;
        a.className = 'underline';
        a.textContent = shown[f] ?? '';
        li.append(a);
        ul.append(li);
      }
      summary.append(title, ul);
    }
  };

  const setStatus = (text: string): void => {
    status.textContent = text;
  };

  const setSending = (on: boolean): void => {
    sending = on;
    button.disabled = on;
    button.textContent = on ? 'Enviando…' : SUBMIT_LABEL;
  };

  // Validación al salir del campo: solo actualiza el campo que se abandona.
  for (const f of FIELDS) {
    control(f).addEventListener('blur', () => {
      const errors = validateContact(read());
      const next: ContactErrors = { ...shown };
      if (errors[f]) next[f] = errors[f];
      else delete next[f];
      shown = next;
      render();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    const values = read();
    // Honeypot relleno: no se hace nada y no se explica el motivo.
    if (values.honeypot.trim() !== '') return;

    shown = validateContact(values);
    render();
    setStatus('');
    alt.hidden = true;
    const first = FIELDS.find((f) => shown[f]);
    if (first) {
      control(first).focus();
      return;
    }

    const mode = getSubmitMode(form.dataset.endpoint ?? '');
    if (mode.kind === 'mailto') {
      const url = buildMailtoUrl(site.contactEmail, values);
      form.dispatchEvent(new CustomEvent('contactform:mailto', { detail: { url } }));
      setStatus('Se abrirá tu programa de correo con el mensaje preparado.');
      window.location.href = url;
      return;
    }

    setSending(true);
    setStatus('Enviando…');
    try {
      const res = await fetch(mode.url, {
        method: 'POST',
        body: buildFormspreeBody(values),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      shown = {};
      render();
      setStatus('Gracias, te respondemos en 24 h laborables');
    } catch {
      setStatus('No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.');
      alt.hidden = false;
    } finally {
      setSending(false);
    }
  });

  button.disabled = false;
}
