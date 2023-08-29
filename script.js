const inputBox = document.getElementById("input-box");//Для получения введённого текста задачи
const listContainer = document.getElementById("list-container");//Для контейнера с задачами


let lastElementId = parseInt(localStorage.getItem("lastElementId")) || 0;//Уникальный id для каждой новой задачи


//Сохраняем все данные которые имеем на странице (галочка, текст, id)
function saveData() {
	const tasksData = Array.from(listContainer.querySelectorAll(".tasks")).map(taskElement => {
		const taskId = taskElement.getAttribute("data-task-id");
		const text = taskElement.querySelector("p").textContent;
		const isChecked = taskElement.querySelector(".krugalochka").classList.contains("checked");
		return { id: taskId, text: text, isChecked: isChecked };
	});
	localStorage.setItem("tasksData", JSON.stringify(tasksData));
}


//Создаём блок с задачами в котором у нас есть поле галочки, текст, редактор задачи и снять задачу
function addTask() {
	if (inputBox.value === '') {
		alert("Ты должен написать свою задачу!");
	}
	else {
		const blochok = document.createElement("div");//Сам блок 
		blochok.classList.add("tasks");
		blochok.setAttribute("data-task-id", lastElementId++);//присваемваем уникальный id каждому новому 'блочку'
		blochok.setAttribute("draggable", "true"); // Добавляем атрибут "draggable"
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
	localStorage.setItem("lastElementId", lastElementId);
	saveData();
}


//чтобы было удобно а не по клику добавлять задачи
inputBox.addEventListener('keyup', function(event) {
	if (event.key === 'Enter') {
		addTask();
	}
});


// Drag and drop
// Обработчик события начала перетаскивания
listContainer.addEventListener("dragstart", function(event) {
  event.dataTransfer.setData("text/plain", event.target.getAttribute("data-task-id"));
});

// Обработчик события перемещения над контейнером
listContainer.addEventListener("dragover", function(event) {
  event.preventDefault();
});

// Обработчик события завершения перетаскивания
listContainer.addEventListener("drop", function(event) {
	event.preventDefault();
	const taskId = event.dataTransfer.getData("text/plain");
	const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

	if (taskElement) {
		const targetTaskId = event.target.getAttribute("data-task-id");
		const targetTaskElement = document.querySelector(`[data-task-id="${targetTaskId}"]`);

		if (targetTaskElement) {
			listContainer.insertBefore(taskElement, targetTaskElement); // Вставляем элемент перед целевым элементом
		} else {
			// Возвращение элемента на исходное место
			listContainer.appendChild(taskElement); // Вставляем элемент в конец списка

			// Опционально можно добавить анимацию возврата на место
			taskElement.style.transition = "transform 0.3s";
			taskElement.style.transform = "translate(0, 0)";
			setTimeout(() => {
				taskElement.style.transition = "";
				taskElement.style.transform = "";
			}, 300);
		}

		// Обновляем сохранение данных
		saveData();
	}
});


function showTask() {
	// Получение сохраненных данных из localStorage
	const savedData = localStorage.getItem("tasksData");

	if (savedData) {
		// Если есть сохраненные данные, парсим их из JSON
		const tasksData = JSON.parse(savedData);

		// Проходим по каждому элементу в массиве tasksData
		tasksData.forEach(taskData => {
			// Создание элемента задачи (блока)
			const taskElement = document.createElement("div");
			taskElement.classList.add("tasks"); // Добавляем класс "tasks" к элементу
			taskElement.setAttribute("data-task-id", taskData.id); // Устанавливаем идентификатор задачи

			// Создание элемента для галочки
			const chekk = document.createElement("div");
			chekk.classList.add("krugalochka"); // Добавляем класс "krugalochka" к элементу
			if (taskData.isChecked) {
				chekk.classList.add("checked"); // Если задача отмечена, добавляем класс "checked" для стилизации
			}
			taskElement.appendChild(chekk);

			// Создание элемента для текста задачи
			const textik = document.createElement("p");
			textik.textContent = taskData.text; // Устанавливаем текст задачи
			if (taskData.isChecked) {
				textik.classList.add("checked"); // Если задача отмечена, добавляем класс "checked" для стилизации
			}
			taskElement.appendChild(textik);

			// Создание элемента для редактирования задачи
			const pencil = document.createElement("div");
			pencil.classList.add("editor"); // Добавляем класс "editor" к элементу
			taskElement.appendChild(pencil);

			// Создание элемента для удаления задачи
			const krest = document.createElement("span");
			krest.innerHTML = "\u00d7"; // Устанавливаем символ "×" для удаления
			taskElement.appendChild(krest);

			// Добавляем созданный элемент задачи в контейнер списка
			listContainer.appendChild(taskElement);
		});
	}
}


//для того чтобы ставить и убирать галочку, зачёкивать выполненную задачу и убирать задачу из списка при нажатии на крестик
//!нужно реализовать так, чтобы изменения приходили в силу при нажатии на галочку а не на текст
listContainer.addEventListener("click", function(e) {
	if(e.target.tagName === "P") {
		e.target.classList.toggle("checked");
		const krugalochka = e.target.parentElement.querySelector(".krugalochka");
		if (krugalochka) {
			krugalochka.classList.toggle("checked");
		}
		saveData();
	}
	else if(e.target.tagName === "SPAN"){
		e.target.parentElement.remove();
		saveData();
	}
}, false);


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
				saveData();
			}
		});
	}
}
}, false);

// Функция для перемещения элементов tasks с классом "checked"
// Функция для перемещения элементов tasks с классом "checked"
function moveChecked() {
  const tasks = document.querySelectorAll('.tasks');
  
  tasks.forEach(function(taskElement) {
    const parIsChecked = taskElement.querySelector('p.checked');
    if (parIsChecked) {
      listContainer.removeChild(taskElement);
      const checkContainer = document.getElementById('check'); // Проверьте, что элемент с id "check" действительно существует
      checkContainer.appendChild(taskElement);
    }
  });
}



// Вызываем функцию для перемещения элементов при загрузке страницы
moveChecked();

showTask();