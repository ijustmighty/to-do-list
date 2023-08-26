const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
	if (inputBox.value === '') {
		alert("Ты должен написать свою задачу!");
	}
	else {
		let blochok = document.createElement("div");
		blochok.classList.add("tasks");
		listContainer.appendChild(blochok);
		const chekk = document.createElement("div");
		chekk.classList.add("krugalochka");
		blochok.appendChild(chekk);
		let textik = document.createElement("p");
		textik.innerHTML = inputBox.value;
		blochok.appendChild(textik);
		let pencil = document.createElement ("div");
		pencil.classList.add ("editor");
		blochok.appendChild(pencil);
		let krest = document.createElement("span");
		krest.innerHTML = "\u00d7";
		blochok.appendChild(krest);
	}
	inputBox.value = "";
	saveData();
}

function saveData(){
	localStorage.setItem("data", listContainer.innerHTML);
}

function showTask (){
	listContainer.innerHTML = localStorage.getItem("data");
}
showTask ();

inputBox.addEventListener('keyup', function(event) {
	if (event.key === 'Enter') {
			addTask();
	}
});

listContainer.addEventListener("click", function(e) {
	if(e.target.tagName === "P") {
		e.target.classList.toggle("checked");
		chekk.classList.toggle("checked");
	}
	else if(e.target.tagName === "SPAN"){
		e.target.parentElement.remove();
	}
}, false);
	saveData();

