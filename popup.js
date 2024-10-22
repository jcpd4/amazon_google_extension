// Definir la función toggleAmazonInfoBox fuera del ámbito de DOMContentLoaded para evitar errores de referencia
function toggleAmazonInfoBox(isActive) {
  if (isActive) {
      const productTitle = document.querySelector("#productTitle")?.innerText.trim() || "Título no disponible";
      const productPrice = document.querySelector(".a-price .a-offscreen")?.innerText.trim() || "Precio no disponible";
      const productReviews = document.querySelector("#acrCustomerReviewText")?.innerText.trim() || "Reseñas no disponibles";

      const productContainer = document.querySelector("#ppd");

      if (!productContainer) {
          console.error("No se encontró el contenedor del producto con id 'ppd'.");
          return;
      }

      let infoBox = document.getElementById('infoBox');
      if (!infoBox) {
          infoBox = document.createElement('div');
          infoBox.id = 'infoBox';
          infoBox.style.fontFamily = "'Poppins', sans-serif";
          infoBox.style.width = '100%';
          infoBox.style.padding = '15px';
          infoBox.style.backgroundColor = '#f3e5f5';
          infoBox.style.border = '1px solid #d1c4e9';
          infoBox.style.borderRadius = '10px';
          infoBox.style.marginBottom = '20px';
          infoBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          infoBox.style.boxSizing = 'border-box';
          infoBox.style.color = '#673ab7';
          productContainer.before(infoBox);
      }

      infoBox.innerHTML = `
          <h2 style="font-size: 24px;">Información del Producto</h2>
          <p><strong>Título:</strong> ${productTitle}</p>
          <p><strong>Precio:</strong> ${productPrice}</p>
          <p><strong>Reseñas:</strong> ${productReviews}</p>
          <h3>Gráfico de Ventas</h3>
          <canvas id="salesChart" width="800" height="300" style="margin: 10px;"></canvas>
          <h3>Últimas Reseñas</h3>
          <div id="latestReviews"></div>
      `;

      // Crear el gráfico usando canvas
      const canvas = document.getElementById('salesChart');
      if (canvas && canvas.getContext) {
          const ctx = canvas.getContext('2d');
          // Datos ficticios de ventas
          const salesData = [12, 19, 3, 5, 2, 3, 15];
          const days = [1, 2, 3, 4, 5, 6, 7];

          // Ajustar márgenes
          const margin = 50;
          const chartWidth = canvas.width - margin * 2;
          const chartHeight = canvas.height - margin * 2;

          function drawChart() {
              // Limpiar el canvas
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              // Dibujar ejes X e Y
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 1;
              // Eje X
              ctx.beginPath();
              ctx.moveTo(margin, chartHeight + margin);
              ctx.lineTo(chartWidth + margin, chartHeight + margin);
              ctx.stroke();
              // Eje Y
              ctx.beginPath();
              ctx.moveTo(margin, margin);
              ctx.lineTo(margin, chartHeight + margin);
              ctx.stroke();

              // Dibujar etiquetas en los ejes
              ctx.fillStyle = '#000';
              ctx.font = '12px Arial';
              // Etiquetas del eje X (días)
              for (let i = 0; i < days.length; i++) {
                  const x = margin + (chartWidth / (days.length - 1)) * i;
                  ctx.fillText(`Día ${days[i]}`, x - 10, chartHeight + margin + 20);
              }
              // Etiquetas del eje Y (ventas)
              for (let i = 0; i <= 4; i++) {
                  const y = chartHeight + margin - (i * chartHeight / 4);
                  ctx.fillText(`${i * 5}`, margin - 30, y + 5);
              }

              // Dibujar líneas intermedias en el eje Y
              ctx.strokeStyle = '#ccc';
              ctx.lineWidth = 0.5;
              for (let i = 1; i <= 4; i++) {
                  const y = chartHeight + margin - (i * chartHeight / 4);
                  ctx.beginPath();
                  ctx.moveTo(margin, y);
                  ctx.lineTo(chartWidth + margin, y);
                  ctx.stroke();
              }

              // Dibujar el gráfico de puntos conectados por líneas
              ctx.beginPath();
              ctx.moveTo(margin, chartHeight + margin - salesData[0] * 10);
              for (let i = 1; i < salesData.length; i++) {
                  const x = margin + (chartWidth / (days.length - 1)) * i;
                  const y = chartHeight + margin - salesData[i] * 10;
                  ctx.lineTo(x, y);
              }
              ctx.strokeStyle = '#673ab7';
              ctx.lineWidth = 2;
              ctx.stroke();

              // Dibujar puntos
              ctx.fillStyle = '#673ab7';
              for (let i = 0; i < salesData.length; i++) {
                  const x = margin + (chartWidth / (days.length - 1)) * i;
                  const y = chartHeight + margin - salesData[i] * 10;
                  ctx.beginPath();
                  ctx.arc(x, y, 5, 0, 2 * Math.PI);
                  ctx.fill();
              }
          }

          // Dibujar el gráfico inicialmente
          drawChart();
      }

      // Mostrar las reseñas en formato de tabla
      const latestReviews = document.getElementById('latestReviews');
      if (latestReviews) {
          const reviews = Array.from(document.querySelectorAll('.review')).slice(0, 15); // Modificar según el selector real de las reseñas y limitar a 15
          if (reviews.length === 0) {
              latestReviews.innerHTML = '<p>No hay reseñas disponibles.</p>';
          } else {
              let table = '<table style="width: 100%; border-collapse: collapse; border: 1px solid #673ab7; margin-top: 15px;">';
              table += '<thead><tr style="background-color: #673ab7; color: #fff;">';
              table += '<th style="padding: 10px; border: 1px solid #673ab7;">Fecha</th>';
              table += '<th style="padding: 10px; border: 1px solid #673ab7;">Valoración</th>';
              table += '<th style="padding: 10px; border: 1px solid #673ab7;">Título</th>';
              table += '<th style="padding: 10px; border: 1px solid #673ab7;">Descripción</th>';
              table += '<th style="padding: 10px; border: 1px solid #673ab7;">Fotos</th>';
              table += '</tr></thead><tbody>';

              reviews.slice(0, 5).forEach(review => {
                  const date = review.querySelector('.review-date')?.innerText.trim() || 'Fecha no disponible';
                  const rating = review.querySelector('.review-rating')?.innerText.trim() || 'Valoración no disponible';
                  const title = review.querySelector('.review-title-content span')?.innerText.trim() || 'Título no disponible';
                  const description = review.querySelector('.review-text')?.innerText.trim() || 'Descripción no disponible';
                  const photos = Array.from(review.querySelectorAll('.review-photo')).map(photo => `<img src="${photo.src}" alt="foto de reseña" style="width: 50px; height: 50px;">`).join(' ') || 'Sin fotos';

                  table += `<tr>`;
                  table += `<td style="padding: 10px; border: 1px solid #673ab7;">${date}</td>`;
                  table += `<td style="padding: 10px; border: 1px solid #673ab7;">${rating}</td>`;
                  table += `<td style="padding: 10px; border: 1px solid #673ab7;">${title}</td>`;
                  table += `<td style="padding: 10px; border: 1px solid #673ab7;">${description}</td>`;
                  table += `<td style="padding: 10px; border: 1px solid #673ab7;">${photos}</td>`;
                  table += `</tr>`;
              });
              table += '</tbody></table>';

              // Añadir controles de navegación
              latestReviews.innerHTML = `
                  <div style="overflow: auto; max-height: 400px;">
                      ${table}
                  </div>
                  <button id="prevReviews" style="margin-top: 10px; padding: 10px 20px; background-color: #673ab7; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Anterior</button>
                  <button id="nextReviews" style="margin-top: 10px; padding: 10px 20px; background-color: #673ab7; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Siguiente</button>
              `;

              let currentPage = 0;

              function renderReviews(page) {
                  const start = page * 5;
                  const end = start + 5;
                  const currentReviews = reviews.slice(start, end);

                  let rows = '';
                  currentReviews.forEach(review => {
                      const date = review.querySelector('.review-date')?.innerText.trim() || 'Fecha no disponible';
                      const rating = review.querySelector('.review-rating')?.innerText.trim().slice(0,3) || 'Valoración no disponible';
                      const title = review.querySelector('.review-title-content span + span')?.innerText.trim() || 'Título no disponible';
                      const description = review.querySelector('.review-text')?.innerText.trim() || 'Descripción no disponible';
                      const photos = Array.from(review.querySelectorAll('.review-photo')).map(photo => `<img src="${photo.src}" alt="foto de reseña" style="width: 50px; height: 50px;">`).join(' ') || 'Sin fotos';

                      rows += `<tr>`;
                      rows += `<td style="padding: 10px; border: 1px solid #673ab7;">${date}</td>`;
                      rows += `<td style="padding: 10px; border: 1px solid #673ab7;">${rating}</td>`;
                      rows += `<td style="padding: 10px; border: 1px solid #673ab7;">${title}</td>`;
                      rows += `<td style="padding: 10px; border: 1px solid #673ab7;">${description}</td>`;
                      rows += `<td style="padding: 10px; border: 1px solid #673ab7;">${photos}</td>`;
                      rows += `</tr>`;
                  });
                  latestReviews.querySelector('tbody').innerHTML = rows;
              }

              document.getElementById('prevReviews').addEventListener('click', function () {
                  if (currentPage > 0) {
                      currentPage--;
                      renderReviews(currentPage);
                  }
              });

              document.getElementById('nextReviews').addEventListener('click', function () {
                  if ((currentPage + 1) * 5 < reviews.length) {
                      currentPage++;
                      renderReviews(currentPage);
                  }
              });

              // Renderizar la primera página de reseñas
              renderReviews(currentPage);
          }
      }
  } else {
      const infoBox = document.getElementById('infoBox');
      if (infoBox) {
          infoBox.remove();
      }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggleExtension');
  
  // Cargar el estado actual
  chrome.storage.local.get(['isExtensionActive'], function (result) {
      if (result.isExtensionActive) {
          toggleButton.textContent = 'Desactivar';
          toggleAmazonInfoBox(true); // Asegurarse de mostrar el infoBox si la extensión ya está activa
      } else {
          toggleButton.textContent = 'Activar';
      }
  });

  // Manejar clic en el botón de activar/desactivar
  toggleButton?.addEventListener('click', function () {
      chrome.storage.local.get(['isExtensionActive'], function (result) {
          const newState = !result.isExtensionActive;
          chrome.storage.local.set({ isExtensionActive: newState }, function () {
              toggleButton.textContent = newState ? 'Desactivar' : 'Activar';

              // Enviar mensaje al content script para activar o desactivar la funcionalidad
              chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                  chrome.scripting.executeScript({
                      target: { tabId: tabs[0].id },
                      func: toggleAmazonInfoBox,
                      args: [newState]
                  });
              });
          });
      });
  });
});
