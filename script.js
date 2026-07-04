/* =========================================================
   SAVI — Gelato, Smoothies & Açaí
   JavaScript principal

   Nota: este diseño es casi 100% CSS (animaciones de
   entrada con @keyframes, hover states, el pulso del pin
   en el mapa). Este archivo agrega:
   1) Un respaldo de smooth scroll para navegadores muy antiguos.
   2) El manejo del formulario de "Book the Cart" (sección
      #events), que envía los datos a Formspree via fetch,
      sin recargar la página.
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
  // Envía los datos directo a Formspree via fetch (AJAX), sin
  // recargar ni redirigir la página. Muestra un mensaje de
  // confirmación o error en #events-feedback.
  const eventsForm = document.getElementById('events-form');
  const eventsFeedback = document.getElementById('events-feedback');

  if (eventsForm) {
    eventsForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = new FormData(eventsForm);
      const name = (data.get('name') || '').trim();
      const eventType = (data.get('eventType') || '').trim();

      // Subject dinámico para que el correo llegue identificado
      data.append('_subject', `Event request — ${eventType || 'SAVI cart'} — ${name}`);

      const submitBtn = eventsForm.querySelector('.events-submit');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(eventsForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          eventsFeedback.classList.remove('success', 'error');
          if (response.ok) {
            eventsForm.reset();
            eventsFeedback.textContent = '¡Gracias! We\'ll be in touch shortly to plan your day. ✨';
            eventsFeedback.classList.add('success');
          } else {
            eventsFeedback.textContent = 'Something went wrong. Please try again or reach us on Instagram.';
            eventsFeedback.classList.add('error');
          }
        })
        .catch(function () {
          eventsFeedback.classList.remove('success', 'error');
          eventsFeedback.textContent = 'Something went wrong. Please try again or reach us on Instagram.';
          eventsFeedback.classList.add('error');
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        });
    });
  }

});