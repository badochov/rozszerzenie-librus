// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

const defaultModifiers = {
	plus: 0.5,
	minus: 0,
};

const defaultColors = {
	bg1: "f44256",
	bg2: "f44256",
	bg3: "ffe842",
	bg4: "c0ff54",
	bg5: "54ffd4",
	bg6: "6793e0",
};

const defaultFontColors = {
	color: "#000000",
};

let color, bg1, bg2, bg3, bg4, bg5, bg6, minus, plus;
chrome.storage.sync.get(
	["color", "bg1", "bg2", "bg3", "bg4", "bg5", "bg6", "plus", "minus"],
	rec => {
		color = rec.color;
		bg1 = rec.bg1;
		bg2 = rec.bg2;
		bg3 = rec.bg3;
		bg4 = rec.bg4;
		bg5 = rec.bg5;
		bg6 = rec.bg6;
		plus = rec.plus;
		minus = rec.minus;
		main();
	}
);
function main() {
	for (const [key, value] in Object.entries(defaultFontColors)) {
		$(`#${key}`).spectrum({
			color: value,
			change: c => {
				const helper = {};
				helper[key] = c.toHexString();
				chrome.storage.sync.set(helper);
			},
			showInput: true,
			clickoutFiresChange: true,
			preferredFormat: "hex",
		});
	}
	for (const [key, value] in Object.entries(defaultColors)) {
		$(`#${key}`).spectrum({
			color: value,
			change: c => {
				const helper = {};
				helper[key] = c.toHex();
				chrome.storage.sync.set(helper);
			},
			showInput: true,
			clickoutFiresChange: true,
			preferredFormat: "hex",
		});
	}
	$("#minus")
		.val(-minus)
		.on("input", function() {
			chrome.storage.sync.set({ minus: -parseFloat($(this).val()) });
		});
	$("#plus")
		.val(plus)
		.on("input", function() {
			chrome.storage.sync.set({ plus: parseFloat($(this).val()) });
		});
}
$("#zastosuj").click(() => {
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
		chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
	});
	$("#przywroc").click(() => {
		for (const [name, val] in Object.entries(defaultModifiers)) {
			$(`#${name}`).val(val);
		}

		for (const [name, val] in Object.entries(defaultColors)) {
			$(`#${name}`).spectrum("set", val);
		}
		for (const [name, val] in Object.entries(defaultFontColors)) {
			$(`#${name}`).spectrum("set", val.replace(/#/g, ""));
		}
		chrome.storage.sync.set({ ...defaultColors, ...defaultModifiers });
		chrome.tabs.query({ active: true, currentWindow: true }, function(
			tabs
		) {
			chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
		});
	});
});
