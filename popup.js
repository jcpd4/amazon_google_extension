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
          <button id="seeMoreReviews" style="margin-top: 15px; padding: 10px 20px; background-color: #673ab7; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Ver más reseñas</button>
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
                  points.push({ x, y, data: `Día ${days[i]} - Ventas: ${salesData[i]}` });
              }
          }

          // Dibujar el gráfico inicialmente
          const points = [];
          drawChart();

          // Evento para mostrar información cuando el mouse pasa sobre un punto
          canvas.addEventListener('mousemove', function (event) {
              const rect = canvas.getBoundingClientRect();
              const mouseX = event.clientX - rect.left;
              const mouseY = event.clientY - rect.top;

              // Redibujar el gráfico completo
              drawChart();

              // Mostrar tooltip si el mouse está cerca de un punto
              for (let point of points) {
                  if (Math.abs(mouseX - point.x) < 10 && Math.abs(mouseY - point.y) < 10) {
                      // Dibujar tooltip con estilo mejorado
                      const tooltipWidth = 140;
                      const tooltipHeight = 30;
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                      ctx.strokeStyle = '#673ab7';
                      ctx.lineWidth = 1;
                      ctx.fillRect(point.x + 10, point.y - tooltipHeight - 10, tooltipWidth, tooltipHeight);
                      ctx.strokeRect(point.x + 10, point.y - tooltipHeight - 10, tooltipWidth, tooltipHeight);

                      // Dibujar contenido del tooltip
                      ctx.fillStyle = '#673ab7';
                      ctx.font = 'bold 12px Poppins';
                      ctx.fillText(point.data, point.x + 15, point.y - tooltipHeight / 2);
                  }
              }
          });
      }

      // Mostrar las últimas 5 reseñas
      const latestReviewsContainer = document.getElementById('latestReviews');
      if (latestReviewsContainer) {
          const reviews = document.querySelectorAll('.review'); // Modificar según el selector real de las reseñas
          if (reviews.length === 0) {
              latestReviewsContainer.innerHTML = '<p>No hay reseñas disponibles.</p>';
          } else {
              let latestReviews = '';
              reviews.forEach((review, index) => {
                  if (index < 5) {
                      const date = review.querySelector('.review-date')?.innerText.trim() || 'Fecha no disponible';
                      const rating = review.querySelector('.review-rating')?.innerText.trim() || 'Valoración no disponible';
                      const title = review.querySelector('.review-title')?.innerText.trim() || 'Título no disponible';
                      const description = review.querySelector('.review-text')?.innerText.trim() || 'Descripción no disponible';
                      latestReviews += `
                          <div style="margin-bottom: 10px;">
                              <p><strong>Fecha:</strong> ${date}</p>
                              <p><strong>Valoración:</strong> ${rating}</p>
                              <p><strong>Título:</strong> ${title}</p>
                              <p><strong>Descripción:</strong> ${description}</p>
                          </div>
                      `;
                  }
              });
              latestReviewsContainer.innerHTML = latestReviews;
          }
      }

      // Manejar clic en el botón "Ver más reseñas"
      document.getElementById('seeMoreReviews')?.addEventListener('click', function () {
          const tabReviewsButton = document.getElementById('tabReviews');
          if (tabReviewsButton) {
              tabReviewsButton.click();
          }
      });
  } else {
      const infoBox = document.getElementById('infoBox');
      if (infoBox) {
          infoBox.remove();
      }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggleExtension');
  const tabInfoButton = document.getElementById('tabInfo');
  const tabReviewsButton = document.getElementById('tabReviews');
  const infoContainer = document.getElementById('infoContainer');
  const reviewsContainer = document.getElementById('reviewsContainer');

  // Verificar si los elementos existen antes de acceder a sus propiedades
  if (infoContainer && reviewsContainer) {
      // Mostrar la pestaña de información inicialmente
      infoContainer.style.display = 'block';
      reviewsContainer.style.display = 'none';

      // Manejar clic en el botón de pestaña Info
      tabInfoButton?.addEventListener('click', function () {
          infoContainer.style.display = 'block';
          reviewsContainer.style.display = 'none';
      });

      // Manejar clic en el botón de pestaña Reseñas
      tabReviewsButton?.addEventListener('click', function () {
          infoContainer.style.display = 'none';
          reviewsContainer.style.display = 'block';
          fetchReviews();
      });
  }

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

  function fetchReviews() {
      const reviewsContainer = document.getElementById('reviewsContainer');
      if (reviewsContainer) {
          reviewsContainer.innerHTML = '<h2 style="font-size: 24px;">Reseñas del Producto</h2>';

          const reviews = document.querySelectorAll('.review'); // Modificar según el selector real de las reseñas
          if (reviews.length === 0) {
              reviewsContainer.innerHTML += '<p>No hay reseñas disponibles.</p>';
          } else {
              let table = '<table style="width: 100%; border-collapse: collapse;"><tr><th>Fecha</th><th>Valoración</th><th>Título</th><th>Descripción</th><th>Fotos</th></tr>';
              reviews.forEach(review => {
                  const date = review.querySelector('.review-date')?.innerText.trim() || 'Fecha no disponible';
                  const rating = review.querySelector('.review-rating')?.innerText.trim() || 'Valoración no disponible';
                  const title = review.querySelector('.review-title')?.innerText.trim() || 'Título no disponible';
                  const description = review.querySelector('.review-text')?.innerText.trim() || 'Descripción no disponible';
                  const photos = Array.from(review.querySelectorAll('.review-photo')).map(photo => photo.src).join(', ') || 'Sin fotos';

                  table += `<tr><td>${date}</td><td>${rating}</td><td>${title}</td><td>${description}</td><td>${photos}</td></tr>`;
              });
              table += '</table>';
              reviewsContainer.innerHTML += table;
              
              // Añadir botón para descargar reseñas como Excel
              const downloadButton = document.createElement('button');
              downloadButton.textContent = 'Descargar Reseñas en Excel';
              downloadButton.style.marginTop = '15px';
              downloadButton.style.padding = '10px 20px';
              downloadButton.style.backgroundColor = '#673ab7';
              downloadButton.style.color = '#fff';
              downloadButton.style.border = 'none';
              downloadButton.style.borderRadius = '5px';
              downloadButton.style.cursor = 'pointer';
              reviewsContainer.appendChild(downloadButton);

              downloadButton.addEventListener('click', function () {
                  let csvContent = "data:text/csv;charset=utf-8,Fecha,Valoración,Título,Descripción,Fotos\n";
                  reviews.forEach(review => {
                      const date = review.querySelector('.review-date')?.innerText.trim() || 'Fecha no disponible';
                      const rating = review.querySelector('.review-rating')?.innerText.trim() || 'Valoración no disponible';
                      const title = review.querySelector('.review-title')?.innerText.trim() || 'Título no disponible';
                      const description = review.querySelector('.review-text')?.innerText.trim() || 'Descripción no disponible';
                      const photos = Array.from(review.querySelectorAll('.review-photo')).map(photo => photo.src).join(', ') || 'Sin fotos';

                      csvContent += `${date},${rating},${title},${description},${photos}\n`;
                  });
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement('a');
                  link.setAttribute('href', encodedUri);
                  link.setAttribute('download', 'reseñas_producto.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
              });
          }
      }
  }
});
