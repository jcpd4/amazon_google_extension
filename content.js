chrome.storage.local.get(['isExtensionActive'], function (result) {
    if (result.isExtensionActive) {
      toggleAmazonInfoBox(true);
    }
  });
  