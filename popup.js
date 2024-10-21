document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggleExtension');

  // Cargar el estado actual
  chrome.storage.local.get(['isExtensionActive'], function (result) {
    if (result.isExtensionActive) {
      toggleButton.textContent = 'Desactivar';
    } else {
      toggleButton.textContent = 'Activar';
    }
  });

  // Manejar clic en el botón de activar/desactivar
  toggleButton.addEventListener('click', function () {
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
          <canvas id="salesChart" width="300" height="150"></canvas>
      `;

      // Crear el gráfico usando canvas
      const canvas = document.getElementById('salesChart');
      if (canvas.getContext) {
          const ctx = canvas.getContext('2d');
          // Datos ficticios de ventas
          const salesData = [12, 19, 3, 5, 2, 3, 15];
          const labels = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

          // Dibujar el gráfico
          ctx.fillStyle = '#673ab7';
          for (let i = 0; i < salesData.length; i++) {
              const barHeight = salesData[i] * 5; // Escalado para el tamaño del canvas
              ctx.fillRect(40 * i + 10, 150 - barHeight, 30, barHeight);
              ctx.fillStyle = '#000';
              ctx.fillText(labels[i], 40 * i + 10, 150 - barHeight - 10);
              ctx.fillStyle = '#673ab7';
          }
      }
  } else {
      const infoBox = document.getElementById('infoBox');
      if (infoBox) {
          infoBox.remove();
      }
  }
}
