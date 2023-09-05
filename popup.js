// adding a new bookmark row to the popup
const addNewRecord = (recordsElement, record) => {
  const recordTitleBox = document.createElement("div");
  const recordTitleElement = document.createElement("div");
  const recordTimeElement = document.createElement("div");
  const newRecordElement = document.createElement("div");
  const controlsElement = document.createElement("div");

  recordTitleElement.textContent =
    record.title.length > 10 ? record.title.slice(0, 18) + "..." : record.title;
  recordTitleElement.className = "bookmark-title";

  recordTimeElement.textContent = record.desc;
  recordTimeElement.className = "bookmark-time";

  // newRecordElement.id =
  //   "bookmark-" + record.time + "-" + record.url.split("/")[2];
  newRecordElement.className = "bookmark";
  newRecordElement.setAttribute("timestamp", record.time);
  newRecordElement.setAttribute("url", record.url);

  controlsElement.className = "bookmark-controls";
  recordTitleBox.className = "textbox";

  setBookmarkAttributes("delete", onDelete, controlsElement);

  recordTitleBox.appendChild(recordTitleElement);
  recordTitleBox.appendChild(recordTimeElement);

  newRecordElement.appendChild(recordTitleBox);
  newRecordElement.appendChild(controlsElement);
  recordTitleBox.addEventListener("click", onPlay);
  recordsElement.appendChild(newRecordElement);
};

const viewRecords = (currentRecords = []) => {
  const recordsElement = document.getElementById("records");
  recordsElement.innerHTML = "";

  if (currentRecords.length) {
    for (let i = 0; i < currentRecords.length; i++) {
      const record = currentRecords[i];
      addNewRecord(recordsElement, record);
    }
  } else {
    recordsElement.innerHTML = '<i class="row">当前没有任何待看记录</i>';
  }
};

const onPlay = async (e) => {
  const recordEl = e.target.parentNode.parentNode;
  const recordTime = recordEl.getAttribute("timestamp");
  const recordUrl = recordEl.getAttribute("url");

  chrome.runtime.sendMessage({
    action: "PLAY",
    url: recordUrl,
    time: recordTime,
  });
};

const onDelete = async (e) => {
  const recordElementToDelete = e.target.parentNode.parentNode;
  const recordTime = recordElementToDelete.getAttribute("timestamp");
  const recordUrl = recordElementToDelete.getAttribute("url");

  recordElementToDelete.parentNode.removeChild(recordElementToDelete);

  chrome.runtime.sendMessage({
    action: "DELETE",
    url: recordUrl,
    time: +recordTime,
  });
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  chrome.storage.local.get(["Bili-LaterToSee"], (data) => {
    const currentRecords = data["Bili-LaterToSee"]
      ? JSON.parse(data["Bili-LaterToSee"])
      : [];

    viewRecords(currentRecords);
  });
});
