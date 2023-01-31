$(async function() {
  const input_elm = document.querySelector('.c-167wrf9-fileInputStyle');
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.runtime.sendMessage(
      { url: message },
      (response) => {
        fetch(response)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "", { type: 'image/png'});
          console.log(blob);
          const dt = new DataTransfer();
          dt.items.add(file);
          input_elm.files = dt.files;
          const event = new Event('change', { bubbles: true});
          event.simulated = true;
          input_elm.dispatchEvent(event);
          return true;
        })
        return true;
      }
    )
    return;
  });
  const { image_url } = await chrome.storage.local.get('image_url');
  if (image_url) {
    chrome.runtime.sendMessage(
      { url: image_url },
      (response) => {
        fetch(response)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "", { type: 'image/png'});
          console.log(blob);
          const dt = new DataTransfer();
          dt.items.add(file);
          input_elm.files = dt.files;
          const event = new Event('change', { bubbles: true});
          event.simulated = true;
          input_elm.dispatchEvent(event);
          chrome.storage.local.remove('image_url');
          return true;
        })
        return true;
      }
    )
  }
});