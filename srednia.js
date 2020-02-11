/*TODO
kolor zależnie od średniej

*/

let minus,
	plus,
	srednia = 0,
	sr = 0,
	wagi = 0,
	wr = 0,
	bg = [],
	color,
	r = [],
	g = [],
	b = [];
//chrome.runtime.onMessage.addListener(()=>{avg();});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.msg === "something_completed") {
		//  To do something
		console.log(request.data.subject);
		console.log(request.data.content);
	}
});
function avg() {
	chrome.storage.sync.get(
		["bg1", "bg2", "bg3", "bg4", "bg5", "bg6", "minus", "color", "plus"],
		res => {
			bg[1] = res.bg1;
			bg[2] = res.bg2;
			bg[3] = res.bg3;
			bg[4] = res.bg4;
			bg[5] = res.bg5;
			bg[6] = res.bg6;
			for (let i = 1; i < 7; i++) {
				r[i] = parseInt("0x" + bg[i].substr(0, 2));
				g[i] = parseInt("0x" + bg[i].substr(2, 2));
				b[i] = parseInt("0x" + bg[i].substr(4, 2));
			}
			color = res.color;
			minus = res.minus;
			plus = res.plus;
			$(".container-background>.decorated.stretch>tbody>tr").each(
				parseRows
			);
		}
	);
}
function makeColor(p) {
	let pom = parseInt(p);
	console.log(pom, p);
	rp = r[pom] + (r[Math.min(pom + 1, 6)] - r[pom]) * (p - pom);
	gp = g[pom] + (g[Math.min(pom + 1, 6)] - g[pom]) * (p - pom);
	bp = b[pom] + (b[Math.min(pom + 1, 6)] - b[pom]) * (p - pom);
	console.log("rgb(" + rp + "," + gp + "," + bp + ")");
	return "rgb(" + rp + "," + gp + "," + bp + ")";
}
avg();
function parseRows() {
	$(this)
		.find("td:eq(3),td:eq(7)")
		.addClass("center");
	if ($(this).attr("name") == undefined) {
		$(this)
			.find("td:eq(2)")
			.each(parseCell);
		if (wagi != 0 && srednia != 0)
			$(this)
				.find("td:eq(3)")
				.html(
					"<span style='padding:2px;background:" +
						makeColor((srednia / wagi).toFixed(2)) +
						";color:" +
						color +
						"'>" +
						(srednia / wagi).toFixed(2) +
						"</span>"
				);
		sr += srednia;
		wr += wagi;
		srednia = 0;
		wagi = 0;

		$(this)
			.find("td:eq(6)")
			.each(parseCell);
		if (wagi != 0 && srednia != 0)
			$(this)
				.find("td:eq(7)")
				.html(
					"<span style='padding:2px;background:" +
						makeColor((srednia / wagi).toFixed(2)) +
						";color:" +
						color +
						"'>" +
						(srednia / wagi).toFixed(2) +
						"</span>"
				);
		sr += srednia;
		wr += wagi;
		srednia = 0;
		wagi = 0;

		if (wr != 0 && sr != 0)
			$(this)
				.find("td:eq(9)")
				.html(
					"<span style='padding:2px;background:" +
						makeColor((sr / wr).toFixed(2)) +
						";color:" +
						color +
						"'>" +
						(sr / wr).toFixed(2) +
						"</span>"
				);
		wr = 0;
		sr = 0;
	}
}
function parseCell() {
	if ($(this).val() != "Brak ocen")
		$(this)
			.children()
			.each(parseGrade);
}
function parseGrade() {
	let grade = $(this).children(),
		title = grade.attr("title"),
		waga;
	if (grade.length == 1) {
		if (title.includes("tak") && isGrade(grade.text())) {
			waga = parseInt(title.split("Waga:")[1].split("<br>")[0]);
			srednia += getGrade(grade.text()) * waga;
			wagi += waga;
		}
	} else {
		countAverage(grade);
	}
}
function countAverage(grades) {
	let avg = 0,
		waga,
		n = 0,
		title,
		pom = grades;
	for (let i = 0; i < grades.length; i++) {
		let gr = grades.slice(i, i + 1).children();
		title = gr.attr("title");
		if (title.includes("tak") && isGrade(gr.text())) {
			waga = parseInt(title.split("Waga:")[1].split("<br>")[0]);
			avg += getGrade(gr.text());
			n++;
		}
		grades = pom;
	}
	if (n != 0) {
		wagi += waga;
		srednia += (avg / n) * waga;
	}
}
function isGrade(grade) {
	if (
		!isNaN(parseInt(grade)) &&
		parseInt(grade) > 0 &&
		parseInt(grade) < 7 &&
		grade.length > 0 &&
		grade.length < 3
	)
		return true;
	return false;
}
function getGrade(grade) {
	if (grade.length == 1) {
		return parseInt(grade);
	} else {
		return (
			(grade[1] == "-" ? minus : grade[1] == "+" ? plus : 0) +
			parseInt(grade)
		);
	}
}
