const SCRIPTS = [
	{"script": g5l0_review, "title": "Grade 3,4 Review.", "grade": 5, "lesson": 0},
	{"script": g5l1_sophia_kevin, "title": "Sophia and Kevin", "grade": 5, "lesson": 1},
	{"script": g5l1_world_kids_want, "title": "Kids Around the World Want Stuff", "grade": 5, "lesson": 1},
	{"script": g5l1_story_time_something_new, "title": "Story Time: Something New", "grade": 5, "lesson": 1},
	{"script": g5l2_birthday_special_day, "title": "Birthday, Special Day", "grade": 5, "lesson": 2},
	{"script": g6l0_review, "title": "Grade 5 Review.", "grade": 6, "lesson": 0},
	{"script": g6l1_shogi_origami_kendama, "title": "Shogi, Origami, Kendama", "grade": 6, "lesson": 1},
	{"script": g6l1_world_kids, "title": "Kids Around the World", "grade": 6, "lesson": 1},
	{"script": g6l1_story_time_happy_people_hungry_people, "title": "Story Time: Happy People, Hungry People", "grade": 6, "lesson": 1},
	{"script": g6l2_help_plan_trip, "title": "Help Plan a Trip to Japan", "grade": 6, "lesson": 2},
	{"script": g6l2_help_sophia_kevin, "title": "Help Sophia and Kevin", "grade": 6, "lesson": 2},
	{"script": g6l2_momijigari, "title": "Momijigari", "grade": 6, "lesson": 2},
	{"script": g6l4_beach_mountain, "title": "I went to the beach.", "grade": 6, "lesson": 4}
]

function updateSelected() {
	let checkboxes = Array.from(document.getElementsByTagName("input"));
	let checked = checkboxes.filter(function (el) {return el.checked;});
	const INSTRUCTIONS = "Select one or more of the scripts below, then tap \"Start\":"
	let instructionsP = document.createElement("span");
	instructionsP.innerHTML = INSTRUCTIONS;
	while (divInstructions.firstChild) {
		divInstructions.removeChild(divInstructions.firstChild);
	}
	if (checked.length > 0) {
		let infoP = document.createElement("span");
		let numberOfLines = checked.reduce(function (sum, current, index, array) {
			console.log(sum, current.data.length);
			return sum + current.data.length;
		}, 0)
		infoP.innerHTML = checked.length + " script(s) selected with a total of " + numberOfLines + " lines.";
		divInstructions.appendChild(infoP);
		buttonStart.disabled = false;
	} else {
		buttonStart.disabled = true;
	}
	divInstructions.appendChild(instructionsP);
	sentences = [];
	checked.forEach(function (el) {
		sentences = sentences.concat(el.data);
	});
}

function Quiz() {
	let data = sentences[progress];
	let spanTitle = document.createElement("span");
	let spanProgress = document.createElement("span");
	spanTitle.innerHTML = data["title"];
	spanProgress.innerHTML = (progress+1) + " of " + sentences.length;
	while (divProgress.firstChild) {
		divProgress.removeChild(divProgress.firstChild)
	}
	divProgress.appendChild(spanTitle);
	divProgress.appendChild(spanProgress);
	divPrompt.innerHTML = data.jp;
	divCorrect.innerHTML = "";
	let correctOrder = data.en.split(" ");
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
	this.correctOrder = data.en.split(" ");
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

function next() {
	quiz = new Quiz();
}

let divMenu = document.getElementById("menu");
let divGame = document.getElementById("game");
let divScripts = document.getElementById("scripts");
let divG6 = document.getElementById("g6");
let divG5 = document.getElementById("g5");
let divInstructions = document.getElementById("instructions");
let buttonStart = document.getElementById("start");
let buttonsNext = Array.from(document.getElementsByClassName("next"));
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
console.log(SCRIPTS);
SCRIPTS.forEach(function (script) {
	let wrapper = document.createElement("div");
	let checkbox = document.createElement("input");
	let label = document.createElement("label");
	wrapper.classList.add("scriptWrapper");
	checkbox.type = "checkbox";
	checkbox.id = script.title;
	checkbox.data = script.script.map(function (o) {
		o["title"] = script.title;
		return o;
	}); //add title property to each object
	checkbox.addEventListener("change", updateSelected);
	label.htmlFor = script.title;
	label.innerHTML = script.title;
	wrapper.appendChild(checkbox);
	wrapper.appendChild(label);
	if (script.grade === 6) {
		divG6.appendChild(wrapper);
	} else if (script.grade === 5) {
		divG5.appendChild(wrapper);
	}
});
updateSelected();
buttonStart.addEventListener("pointerdown", start);
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
