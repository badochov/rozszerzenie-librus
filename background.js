"use strict";

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    bg1: "f44256",
    bg2: "f46842",
    bg3: "ffe842",
    bg4: "c0ff54",
    bg5: "54ffd4",
    bg6: "6793e0",
    color: "black",
    minus: 0,
    plus: 0.5,
  });
});
