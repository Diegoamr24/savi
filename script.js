/* =========================================================
   SAVI — Gelato, Smoothies & Açaí
   JavaScript principal

   Nota: este diseño es casi 100% CSS (animaciones de
   entrada con @keyframes, hover states, el pulso del pin
   en el mapa). Este archivo agrega:
   1) Un respaldo de smooth scroll para navegadores muy antiguos.
   2) El manejo del formulario de "Book the Cart" (sección
      #events), que arma un mailto: con los datos ingresados
      — no hay backend real.
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Smooth scroll de respaldo ----------
  // (Ya cubierto por `scroll-behavior: smooth` en CSS,
  // esto es solo un respaldo para navegadores muy antiguos
  // que no soportan esa propiedad CSS)
  const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
  if (!supportsSmoothScroll) {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ---------- Formulario de eventos ("Book the Cart") ----------
  // No hay backend: al enviar, arma un mailto: con los datos
  // del form y abre el cliente de correo del usuario para que
  // revise y mande. Reemplazar EVENTS_EMAIL más abajo por el
  // correo real de contacto cuando esté listo.
  const EVENTS_EMAIL = 'events@savigelato.com'; // placeholder — reemplazar por el correo real

  const eventsForm = document.getElementById('events-form');
  if (eventsForm) {
    eventsForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = new FormData(eventsForm);
      const name = (data.get('name') || '').trim();
      const phone = (data.get('phone') || '').trim();
      const eventType = (data.get('eventType') || '').trim();
      const location = (data.get('location') || '').trim();
      const date = (data.get('date') || '').trim();
      const time = (data.get('time') || '').trim();
      const guests = (data.get('guests') || '').trim();

      const subject = `Event request — ${eventType || 'SAVI cart'} — ${name}`;

      const bodyLines = [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Type of event: ${eventType}`,
        `Location: ${location}`,
        `Date: ${date}`,
        `Time: ${time}`,
        `Estimated guests: ${guests}`
      ];
      const body = bodyLines.join('\n');

      const mailtoUrl =
        `mailto:${EVENTS_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;
    });
  }

});