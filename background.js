function updateIcon(count) {
  if (count) {
    chrome.action.setIcon({ path: "/assets/ext-icon.png" });
    chrome.action.setBadgeBackgroundColor({ color: "skyblue" });
    chrome.action.setBadgeText({ text: "" + count });
  } else {
    chrome.action.setIcon({ path: "/assets/ext-icon-gray.png" });
    chrome.action.setBadgeBackgroundColor({ color: "gray" });
    chrome.action.setBadgeText({ text: "" + count });
  }
}

const fetchRecords = async () => {
  return new Promise((resolve) =>
    chrome.storage.local.get(["Bili-LaterToSee"], (obj) => {
      resolve(obj["Bili-LaterToSee"] ? JSON.parse(obj["Bili-LaterToSee"]) : []);
    })
  );
};

const init = async () => {
  const currentRecords = await fetchRecords();
  updateIcon(currentRecords.length);
};

init();

chrome.runtime.onMessage.addListener(async function (
  msg,
  sender,
  sendResponse
) {
  let currentRecords;
  if (msg.action === "ADD") {
    currentRecords = await fetchRecords();
    currentRecords = [...currentRecords, msg.newRecord];
    updateIcon(currentRecords.length);

    chrome.storage.local.set({
      "Bili-LaterToSee": JSON.stringify(currentRecords),
    });
  } else if (msg.action === "PLAY") {
    chrome.tabs.create({
      url: "https://www.bilibili.com" + msg.url,
    });
  } else if (msg.action === "DELETE") {
    currentRecords = await fetchRecords();
    currentRecords = currentRecords.filter(
      (record) => record.time !== msg.time || record.url !== msg.url
    );

    updateIcon(currentRecords.length);

    chrome.storage.local.set({
      "Bili-LaterToSee": JSON.stringify(currentRecords),
    });
  }
});
