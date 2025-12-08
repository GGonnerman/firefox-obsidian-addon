import Browser from "webextension-polyfill";
import { saveContentMessage } from "../Schemas";

console.log('background script loaded');

function onCreated() {
    if (Browser.runtime.lastError) {
        console.log("error creating item:", Browser.runtime.lastError);
    } else {
        console.log("item created successfully");
    }
}


Browser.contextMenus.create(
    {
        id: "obsidian-selection",
        title: "Save Selection",
        contexts: ["selection"],
    },
    onCreated
);

Browser.contextMenus.create(
    {
        id: "obsidian-image",
        title: "Save Image",
        contexts: ["image"],
    },
    onCreated
);

Browser.contextMenus.onClicked.addListener((info, tab) => {
    let message: saveContentMessage;
    if (!tab?.url) return;

    switch (info.menuItemId) {
        case "obsidian-selection":
            if (!info.selectionText) return
            message = { "url": tab.url, "type": "text", "data": info.selectionText }
            break;
        case "obsidian-image":
            if (!info.srcUrl) return
            console.debug(`Clicked image`, info)
            message = {
                "url": tab.url,
                "type": "image",
                "data": info.srcUrl,
            }
            break;
        default:
            return
    }
    Browser.runtime.sendMessage(message);
});