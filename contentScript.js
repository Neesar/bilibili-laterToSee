(() => {
  let biliPlayer;

  const newVideoLoaded = () => {
    const laterToSeeBtnExists =
      document.getElementsByClassName("for-later-button")[0];

    if (!laterToSeeBtnExists) {
      const laterToSeeBtn = document.createElement("div");
      laterToSeeBtn.className = "for-later-button " + "item";

      laterToSeeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="skyblue" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
      </svg>
      `;

      laterToSeeBtn.style.position = "fixed";
      laterToSeeBtn.style.top = "170px";
      laterToSeeBtn.style.left = "80px";
      laterToSeeBtn.style.cursor = "pointer";

      biliPlayer = document.getElementsByTagName("video")[0];

      const body = document.querySelector("body");
      body.append(laterToSeeBtn);
      laterToSeeBtn.addEventListener("click", addNewRecordEventHandler);
    }
  };

  const addNewRecordEventHandler = () => {
    const currentTime = biliPlayer.currentTime;
    const videoInfoEl = document.querySelector("#viewbox_report");
    const title = videoInfoEl.querySelector("h1").title;
    const urlObj = new URL(window.location.href);
    const searchParam = urlObj.search;
    const url = searchParam.split("&")[0].includes("p=")
      ? urlObj.pathname + searchParam.split("&")[0]
      : urlObj.pathname;

    const newRecord = {
      title,
      url,
      time: currentTime,
      desc: "上次看到: " + getTime(currentTime),
    };

    chrome.runtime.sendMessage({
      action: "ADD",
      newRecord,
    });
  };

  newVideoLoaded();
})();

const getTime = (t) => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().slice(11, -5);
};
