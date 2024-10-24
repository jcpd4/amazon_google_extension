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
            <canvas id="salesChart" style="margin: 10px; width: 100%; height: 300px;"></canvas>
            <h3>Últimas Reseñas</h3>
            <div id="latestReviews"></div>
        `;
  
        // Crear el gráfico usando canvas
        const canvas = document.getElementById('salesChart');
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');

            // Ajustar el tamaño del canvas al ancho del contenedor
            canvas.width = canvas.parentElement.clientWidth; // Ajuste dinámico del ancho
            canvas.height = 300; // Mantener la altura fija

            // Datos ficticios de ventas para 30 días
            const salesData = [
                12, 19, 3, 5, 2, 3, 15, 10, 8, 22, 17, 6, 9, 23, 11, 5, 13, 18, 20, 9,
                7, 25, 12, 14, 8, 19, 16, 10, 12, 22
            ]; // Ventas para 30 días
            const days = Array.from({ length: 30 }, (_, i) => i + 1); // Días del 1 al 30

            // Ajustar márgenes
            const margin = 50;
            const chartWidth = canvas.width - margin * 2;
            const chartHeight = canvas.height - margin * 2;
            let tooltipVisible = false; // Declarar aquí para que sea accesible

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

            // Evento para detectar el mouse y mostrar tooltip
            canvas.addEventListener('mousemove', function(event) {
                const rect = canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;
                let hovered = false;
                
                // Ampliar el radio de detección para el tooltip
                const detectionRadius = 10; // Aumentar el radio de detección a 10 px
                
                // Verificar si el mouse está sobre un punto
                for (let i = 0; i < salesData.length; i++) {
                    const x = margin + (chartWidth / (days.length - 1)) * i;
                    const y = chartHeight + margin - salesData[i] * 10;
                    const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
                    
                    // Si el mouse está dentro del área de detección del punto
                    if (distance < detectionRadius) {
                        hovered = true;
                        if (!tooltipVisible) {
                            tooltipVisible = true;
                            canvas.style.cursor = 'pointer';
                            // Limpiar la zona donde se mostrará el tooltip
                            ctx.clearRect(x + 10, y - 40, 70, 40);
                            ctx.fillStyle = '#fff';
                            ctx.fillRect(x + 10, y - 30, 60, 30); // fondo del tooltip
                            ctx.fillStyle = '#000';
                            ctx.font = '12px Arial';
                            ctx.fillText(`${salesData[i]} ventas`, x + 15, y - 10); // texto del tooltip
                        }
                    }
                }
                
                // Si el mouse no está sobre ningún punto, ocultar el tooltip
                if (!hovered && tooltipVisible) {
                    tooltipVisible = false;
                    canvas.style.cursor = 'default';
                    drawChart(); // Redibujar el gráfico para eliminar el tooltip
                }
            });


            // Dibujar el gráfico inicialmente
            drawChart();
        }

        // Mostrar las reseñas en formato de tabla (mismo código de reseñas)
        // Aquí iría el código de las reseñas que ya has implementado
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
              // Añadir el botón "Descargar CSV"
              const downloadButton = document.createElement('button');
              downloadButton.textContent = 'Descargar CSV';
              downloadButton.id = 'downloadCsvButton';
              downloadButton.style.marginTop = '10px';
              downloadButton.style.padding = '10px 20px';
              downloadButton.style.backgroundColor = '#673ab7';
              downloadButton.style.color = '#fff';
              downloadButton.style.border = 'none';
              downloadButton.style.borderRadius = '5px';
              downloadButton.style.cursor = 'pointer';
              latestReviews.prepend(downloadButton);

              downloadButton.addEventListener('click', function () {
                  const reviews = Array.from(document.querySelectorAll('.review')).slice(0, 15);
                  if (reviews.length === 0) {
                      alert('No hay reseñas disponibles para descargar.');
                      return;
                  }

                  let csvContent = 'Fecha,Valoración,Título,Descripción,Fotos\n';

                  reviews.forEach(review => {
                      const date = review.querySelector('.review-date')?.innerText.trim() || 'Fecha no disponible';
                      const rating = review.querySelector('.review-rating')?.innerText.trim().slice(0, 3) || 'Valoración no disponible';
                      const title = review.querySelector('.review-title-content span')?.innerText.trim() || 'Título no disponible';
                      const description = review.querySelector('.review-text')?.innerText.trim() || 'Descripción no disponible';
                      const photos = Array.from(review.querySelectorAll('.review-photo')).map(photo => photo.src).join(' ') || 'Sin fotos';

                      csvContent += `"${date}","${rating}","${title}","${description}","${photos}"\n`;
                  });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reseñas.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

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
