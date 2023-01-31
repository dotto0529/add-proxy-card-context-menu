chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  let reader = new FileReader()
  reader.onload = function() {
    sendResponse(reader.result)
  }

  fetch(message.url, {
    'method': 'GET'
  })
  .then((response) => {
    if (response && response.ok) {
      return response.blob()
    }
  })
  .then((blob) => {
    reader.readAsDataURL(blob)
    return true
  })

  return true;
});

const updateContextMenus = async () => {
  await chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
      id: "add-card",
      title: "画像をプロキシカード印刷に追加",
      contexts: ["image"]
  });
};

chrome.runtime.onInstalled.addListener(updateContextMenus);
chrome.runtime.onStartup.addListener(updateContextMenus);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "add-card":
      let isExist = false;
      chrome.tabs.query({ currentWindow: true })
      .then(async tabs => {
        tabs.forEach(tab => {
          if ('https://proxy-card.imasanari.dev/' === tab.url) {
            chrome.tabs.sendMessage(tab.id, info.srcUrl);
            isExist = true;
            return;
          }
        });
        if (!isExist) {
          chrome.storage.local.set({'image_url': info.srcUrl});
          const tab = await chrome.tabs.create({ url: 'https://proxy-card.imasanari.dev/' });
          //chrome.tabs.sendMessage(tab.id, info.srcUrl);
          return;
        }
      });
      break;
  }
});