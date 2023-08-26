const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

let lastElementId = 0;//С этим пока не разбирался буду думать позже понадобится для перемещения задач

//Создаём блок с задачами в котором у нас есть поле галочки, текст, редактор задачи и снять задачу
function addTask() {
	if (inputBox.value === '') {
		alert("Ты должен написать свою задачу!");
	}
	else {
		const blochok = document.createElement("div");//Сам блок 
		blochok.classList.add("tasks");
		listContainer.appendChild(blochok);
		const chekk = document.createElement("div");//Для галочки
		chekk.classList.add("krugalochka");
		blochok.appendChild(chekk);
		let textik = document.createElement("p");//Для текста
		textik.innerHTML = inputBox.value;
		blochok.appendChild(textik);
		let pencil = document.createElement ("div");//Для редактора 
		pencil.classList.add ("editor");
		blochok.appendChild(pencil);
		let krest = document.createElement("span");//Для удаления задачи
		krest.innerHTML = "\u00d7";
		blochok.appendChild(krest);
	}
	inputBox.value = "";
	saveData();
}

//это тоже пока подробно не рассматривал нужно изменить
function saveData(){
	localStorage.setItem("data", listContainer.innerHTML);
}

function showTask (){
	listContainer.innerHTML = localStorage.getItem("data");
}
showTask ();

//чтобы было удобно а не по клику добавлять задачи
inputBox.addEventListener('keyup', function(event) {
	if (event.key === 'Enter') {
			addTask();
	}
});

//для того чтобы ставить и убирать галочку, зачёкивать выполненную задачу и убирать задачу из списка при нажатии на крестик
listContainer.addEventListener("click", function(e) {
	if(e.target.tagName === "P") {
		e.target.classList.toggle("checked");
		const krugalochka = e.target.parentElement.querySelector(".krugalochka");
		if (krugalochka) {
				krugalochka.classList.toggle("checked");
		}
}
	else if(e.target.tagName === "SPAN"){
		e.target.parentElement.remove();
	}
}, false);
	saveData();

	//Меняем текст в задаче
	listContainer.addEventListener("click", function(e) {
		if(e.target.classList.contains("editor")) {//Нажимаем карандаш 
			const par = e.target.previousElementSibling;
			if (par && par.tagName === "P") {
				par.classList.toggle("invis");//Пропадает текст par
	
				const editTask = document.createElement("input");//Создаём input
				editTask.type = "text";
				editTask.classList.add("newTask");
				editTask.value = par.textContent; //Даём ему значение того что было в p
				par.parentElement.insertBefore(editTask, par.nextSibling);//Вставляем input после par то есть по сути на его же место т.к. его нет
	
				editTask.addEventListener("keyup", function(event) {
					if (event.key === "Enter") {
						par.textContent = editTask.value;
						par.classList.remove("invis");
						editTask.remove();//После нажатия ENTER данные из input попадают в par после он сам пропадает и с par снимается invis
					}
				});
			}
		}
	}, false);
	