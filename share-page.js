const shareButton = document.querySelector(".share-button");
const shareDialog = document.querySelector("#share-dialog");
const shareClose = document.querySelector(".share-close");
const shareStatus = document.querySelector(".share-status");
const sharePreviewTitle = document.querySelector("[data-share-preview-title]");
const sharePreviewDescription = document.querySelector(
  "[data-share-preview-description]",
);
const wechatGuide = document.querySelector("[data-wechat-guide]");
const wechatGuideTitle = document.querySelector("[data-wechat-guide-title]");
const wechatGuideCopy = document.querySelector("[data-wechat-guide-copy]");

const defaultStatus = "分享后将显示标题、简介和品牌卡片。";

const getShareData = () => ({
  title:
    document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute("content") || document.title,
  text:
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content") || "驻留在家庭算力中的记忆生命体",
  url:
    document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
    window.location.href.split("#")[0],
});

const setStatus = (message) => {
  if (shareStatus) shareStatus.textContent = message;
};

const isNativeDialog = () =>
  typeof HTMLDialogElement !== "undefined" &&
  shareDialog instanceof HTMLDialogElement;

const copyUrl = async (url) => {
  if (!navigator.clipboard?.writeText) throw new Error("copy unavailable");
  await navigator.clipboard.writeText(url);
};

const closeShareDialog = () => {
  if (isNativeDialog() && shareDialog.open) {
    shareDialog.close();
  } else {
    shareDialog?.removeAttribute("open");
  }
  shareButton?.setAttribute("aria-expanded", "false");
};

const openShareDialog = () => {
  const data = getShareData();
  if (sharePreviewTitle) sharePreviewTitle.textContent = data.title;
  if (sharePreviewDescription) sharePreviewDescription.textContent = data.text;
  setStatus(defaultStatus);

  if (isNativeDialog()) {
    if (!shareDialog.open) shareDialog.showModal();
  } else {
    shareDialog?.setAttribute("open", "");
  }
  shareButton?.setAttribute("aria-expanded", "true");
};

const showWechatGuide = (action) => {
  closeShareDialog();
  if (!wechatGuide) return;
  if (wechatGuideTitle) wechatGuideTitle.textContent = "点击右上角 ···";
  if (wechatGuideCopy) {
    wechatGuideCopy.textContent =
      action === "moments" ? "选择“分享到朋友圈”" : "选择“发送给朋友”";
  }
  wechatGuide.hidden = false;
  document.body.classList.add("share-guide-open");
};

const shareThroughSystem = async (data, action) => {
  if (typeof navigator.share === "function") {
    setStatus(
      action === "system"
        ? "请在系统面板中选择分享方式。"
        : "请在系统面板中选择微信。",
    );
    await navigator.share(data);
    closeShareDialog();
    return;
  }

  await copyUrl(data.url);
  setStatus(
    action === "system"
      ? "链接已复制，可以粘贴到任意应用。"
      : "链接已复制，请粘贴到微信发送。",
  );
};

if (shareButton instanceof HTMLButtonElement && shareDialog) {
  shareButton.addEventListener("click", openShareDialog);
  shareClose?.addEventListener("click", closeShareDialog);
  shareDialog.addEventListener("click", (event) => {
    if (event.target === shareDialog) closeShareDialog();
  });
  shareDialog.addEventListener("close", () => {
    shareButton.setAttribute("aria-expanded", "false");
  });

  document.querySelectorAll("[data-share-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.getAttribute("data-share-action") || "system";
      const data = getShareData();
      const isWechat = /MicroMessenger/i.test(navigator.userAgent);

      try {
        if (action === "copy") {
          await copyUrl(data.url);
          setStatus("链接已复制，发给家人就可以打开。");
          return;
        }
        if (isWechat && (action === "wechat" || action === "moments")) {
          showWechatGuide(action);
          return;
        }
        await shareThroughSystem(data, action);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        setStatus("暂时无法调用分享，请长按地址栏复制链接。");
      }
    });
  });
}

wechatGuide?.addEventListener("click", () => {
  wechatGuide.hidden = true;
  document.body.classList.remove("share-guide-open");
});
