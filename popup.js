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
  
      // Obtener el contenedor del producto con id 'ppd'
      const productContainer = document.querySelector("#ppd");
      
      if (!productContainer) {
        console.error("No se encontró el contenedor del producto con id 'ppd'.");
        return;
      }
  
      // Crear el cuadro de información
      let infoBox = document.getElementById('infoBox');
      if (!infoBox) {
        infoBox = document.createElement('div');
        infoBox.id = 'infoBox';
        infoBox.style.fontFamily = "'Poppins', sans-serif";  // Nueva fuente elegante
        infoBox.style.width = '100%';  // Ocupa todo el ancho del contenedor
        infoBox.style.padding = '15px';  // Un poco más de padding para que el contenido respire
        infoBox.style.backgroundColor = '#f3e5f5';  // Un lila claro y suave
        infoBox.style.border = '1px solid #d1c4e9';  // Un borde lila más oscuro pero sutil
        infoBox.style.borderRadius = '10px';  // Bordes redondeados para un toque suave
        infoBox.style.marginBottom = '20px';  // Espacio entre el cuadro y el contenido
        infoBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';  // Sombra ligera para que destaque
        infoBox.style.boxSizing = 'border-box';  // Asegura que el padding no afecte el ancho total
        infoBox.style.color = '#673ab7';  // Texto en un lila más intenso para buen contraste
        productContainer.before(infoBox); // Insertar antes del contenedor del producto con id 'ppd'
      
      }
  
      infoBox.innerHTML = `
        <h2 style="font-size: 24px;">Información del Producto</h2>
        <p><strong>Título:</strong> ${productTitle}</p>
        <p><strong>Precio:</strong> ${productPrice}</p>
        <p><strong>Reseñas:</strong> ${productReviews}</p>
        <h3>Próximamente:</h3>
        <p>Trabajaremos con las ventas mensuales aquí.</p>
      `;
    } else {
      const infoBox = document.getElementById('infoBox');
      if (infoBox) {
        infoBox.remove();
      }
    }
  }
  
