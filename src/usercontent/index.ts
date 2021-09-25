let hasCalled = false;
function remoteRender(event: MessageEvent): void {
    const data = event.data;

    // If we're handling secondary calls, start from scratch
    if (hasCalled) {
        document.body.replaceWith(document.createElement("BODY"));
    }
    hasCalled = true;

    const img = document.createElement("span"); // we'll mask it as an image
    img.id = "img";

    const a = document.createElement("a");
    a.id = "a";
    a.rel = "noreferrer noopener";
    a.download = data.download;
    // @ts-ignore
    a.style = data.style;
    a.style.fontFamily = "Arial, Helvetica, Sans-Serif";
    a.href = window.URL.createObjectURL(data.blob);
    a.appendChild(img);
    a.appendChild(document.createTextNode(data.textContent));

    // Apply image style after so we can steal the anchor's colour.
    // Style copied from a rendered version of mx_MFileBody_download_icon
    // @ts-ignore
    img.style = data.imgStyle ?? "";
    img.style.width = "12px";
    img.style.height = "12px";
    img.style.webkitMaskSize = "12px";
    img.style.webkitMaskPosition = "center";
    img.style.webkitMaskRepeat = "no-repeat";
    img.style.display = "inline-block";
    img.style.webkitMaskImage = `url('${data.imgSrc}')`;
    img.style.backgroundColor = `${a.style.color}`;

    const body = document.body;
    // Don't display scrollbars if the link takes more than one line to display.
    body.style .margin = "0px";
    body.style.overflow = "hidden";
    body.appendChild(a);

    if (event.data.auto) {
        a.click(); // try to trigger download automatically
    }
}

window.onmessage = function(e: MessageEvent): void {
    if (e.origin === window.location.origin) {
        if (e.data.blob) remoteRender(e);
    }
};
