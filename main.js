//import {js2_p4} from "./junior_sunshine_2_project_4.mjs";
import {BOOKS} from "./textbooks.mjs";

console.log(BOOKS);

function toggle(ev) {
	let data = ev.target.data;
	if (data.hasOwnProperty("contents")) {
		data.contents.forEach(function (content) {
			const evnt = new Event("change");
			content.checkbox.checked = data.checkbox.checked;
			content.checkbox.dispatchEvent(evnt);
		});
	} else if (data.hasOwnProperty("sections")) {
		data.sections.forEach(function (section) {
			const evnt = new Event("change");
			section.checkbox.checked = data.checkbox.checked;
			section.checkbox.dispatchEvent(evnt);
		});
	} else if (data.hasOwnProperty("sentences")) {
		updateSelected();
	}
}

function updateSelected() {
	let checkboxes = Array.from(document.getElementsByTagName("input"));
	let checked = checkboxes.filter(function (el) {
		if (
			el.checked &&
			el.data.hasOwnProperty("sentences")
		) {
			return el;
		}
	});
	console.log("CHECKED", checked);
	//const INSTRUCTIONS = "Select one or more of the scripts below, then tap \"Start\":"
	//let instructionsP = document.createElement("span");
	//instructionsP.innerHTML = INSTRUCTIONS;
	//while (divInstructions.firstChild) {
	//	divInstructions.removeChild(divInstructions.firstChild);
	//}
	if (checked.length > 0) {
	//	let infoP = document.createElement("span");
	//	let numberOfLines = checked.reduce(function (sum, current, index, array) {
	//		console.log(sum, current.data.length);
	//		return sum + current.data.length;
	//	}, 0)
	//	infoP.innerHTML = checked.length + " script(s) selected with a total of " + numberOfLines + " lines.";
	//	divInstructions.appendChild(infoP);
		buttonStart.disabled = false;
	} else {
		buttonStart.disabled = true;
	}
	//divInstructions.appendChild(instructionsP);
	sentences = [];
	checked.forEach(function (el) {
		let quizObjects = el.data.sentences.map(function (o) {
			o.title = el.data.title;
			return o;
		});
		sentences = sentences.concat(el.data.sentences);
	});
}

function Quiz() {
	let data = sentences[progress];
	//let spanTitle = document.createElement("span");
	//let spanProgress = document.createElement("span");
	//spanTitle.innerHTML = data["title"] + ", page " + data.page;
	//console.log(spanTitle.innerHTML);
	//spanProgress.innerHTML = "Quiz " + (progress+1) + " of " + sentences.length;
	//while (divProgress.firstChild) {
	//	divProgress.removeChild(divProgress.firstChild)
	//}
	divReference.innerHTML = data["title"] + ", page " + data.page;
	divProgress.innerHTML = "Quiz " + (progress+1) + " of " + sentences.length;
	divPrompt.innerHTML = data.japanese;
	divCorrect.innerHTML = "";
	let correctOrder = data.english.split(" ");
	let words = correctOrder.slice();
	while (divWords.firstChild) {
		divWords.removeChild(divWords.firstChild);
	}
	while (words.length > 0) {
		let word = words.splice(Math.floor(Math.random()*words.length), 1)[0];
		let button = document.createElement("button");
		button.value = word;
		button.innerHTML = word.replaceAll("_", " ");
		button.classList.add("choice");
		button.addEventListener("pointerup", function (ev) {quiz.checkGuess(ev.target);});
		divWords.appendChild(button);
	}
	
	progress = (progress + 1)%sentences.length;
	this.data = data;
	this.progress = 0;
	this.correctOrder = data.english.split(" ");
	this.guessed = [];
	this.checkGuess = function (button) {
		let correct = this.correctOrder[this.progress];
		console.log(button.value, correct);
		if (button.value === correct) {
			this.guessed.push(correct.replaceAll("_", " "));
			audioWrong.pause();
			if (this.guessed.length === this.correctOrder.length) {
				audioComplete.currentTime = 0;
				audioComplete.play();
				buttonsNext.forEach(b => b.disabled = false);
			} else {
				audioCorrect.currentTime = 0;
				audioCorrect.play();
			}
			divCorrect.innerHTML = this.guessed.join(" ");
			button.style.visibility = "hidden";
			this.progress += 1;
		} else {
			audioWrong.currentTime = 0;
			audioWrong.play();
		}
	};
	return;
}

function start() {
	if (sentences.length > 0) {
		divMenu.style.display = "none";
		divGame.style.display = "grid";
	}
	quiz = new Quiz();
	buttonsNext.forEach(b => b.disabled = true);
}

function back() {
	divMenu.style.display = "grid";
	divGame.style.display = "none";
	if (progress > 0) {
		progress -= 1;
	}
}

function next() {
	quiz = new Quiz();
}

let divMenu = document.getElementById("menu");
let divGame = document.getElementById("game");
let divBooks = document.getElementById("books");
let divG6 = document.getElementById("g6");
let divG5 = document.getElementById("g5");
let divInstructions = document.getElementById("instructions");
let buttonStart = document.getElementById("start");
let buttonBack = document.getElementById("back");
let buttonsNext = Array.from(document.getElementsByClassName("next"));
let divReference = document.getElementById("reference");
let divProgress = document.getElementById("progress");
let divPrompt = document.getElementById("prompt");
let divWords = document.getElementById("words");
let divCorrect = document.getElementById("correct");
let sentences = [];
let progress = 0;
let quiz = null;
let audioCorrect = document.createElement("audio");
let audioWrong = document.createElement("audio");
let audioComplete = document.createElement("audio");
audioCorrect.src = "block_pop.mp3";
audioWrong.src = "villager.mp3";
audioComplete.src = "level_up.mp3";
Object.values(BOOKS).forEach(function (book) {
	let book_wrapper = document.createElement("li");
	let book_checkbox = document.createElement("input");
	let book_label = document.createElement("label");
	book.checkbox = book_checkbox;
	book_wrapper.classList.add("bookWrapper");
	book_checkbox.type = "checkbox";
	book_checkbox.id = book.title;
	book_checkbox.data = book;
	book_checkbox.addEventListener("change", toggle);
	book_label.htmlFor = book.title;
	book_label.innerHTML = book.title;
	book_wrapper.appendChild(book_checkbox);
	book_wrapper.appendChild(book_label);
	divBooks.appendChild(book_wrapper);
	book.contents.forEach(function (content) {
		console.log(content)
		let contents_ul = document.createElement("ul");
		let content_wrapper = document.createElement("li");
		let content_checkbox = document.createElement("input");
		let content_label = document.createElement("label");
		content.checkbox = content_checkbox;
		content_wrapper.classList.add("contentWrapper");
		content_checkbox.type = "checkbox";
		content_checkbox.id = content.title;
		content_checkbox.data = content;
		content_checkbox.addEventListener("change", toggle);
		content_label.htmlFor = content.title;
		content_label.innerHTML = content.title;
		content_wrapper.appendChild(content_checkbox);
		content_wrapper.appendChild(content_label);
		contents_ul.appendChild(content_wrapper);
		console.log(content_wrapper);
		divBooks.appendChild(contents_ul);
		content.sections.forEach(function (section) {
			let sections_ul = document.createElement("ul");
			let section_wrapper = document.createElement("li");
			let section_checkbox = document.createElement("input");
			let section_label = document.createElement("label");
			section.checkbox = section_checkbox;
			section_checkbox.data = section;
			section_wrapper.classList.add("sectionWrapper");
			section_checkbox.type = "checkbox";
			section_checkbox.id = section.title;
			section_checkbox.addEventListener("change", toggle);
			section_label.htmlFor = section.title;
			section_label.innerHTML = [section.title, section.sentences[0].english].join(" - ");
			section_wrapper.appendChild(section_checkbox);
			section_wrapper.appendChild(section_label);
			sections_ul.appendChild(section_wrapper);
			contents_ul.appendChild(sections_ul);
		});
	});
});
updateSelected();
buttonStart.addEventListener("click", start);
buttonBack.addEventListener("click", back);
buttonsNext.forEach(function (b) {
	b.addEventListener("click", start);
});
window.addEventListener("contextmenu", function (ev) {
	ev.preventDefault();
});
window.addEventListener("keydown", function (ev) {
	if (ev.key === "ArrowRight") {
		quiz = new Quiz();
	}
});
