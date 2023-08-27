	const inputBox = document.getElementById("input-box");
	const listContainer = document.getElementById("list-container");

	let lastElementId = 0;//работает даёт каждому 'блочку' айдишник

	//это тоже пока подробно не рассматривал нужно изменить
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
		saveData();
	}
	//ну посмотрим что такое этот ваш "DnD"

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
			const newTaskId = lastElementId++; // Генерируем новый ID для перемещаемого элемента
			taskElement.setAttribute("data-task-id", newTaskId);

			const targetTaskId = event.target.getAttribute("data-task-id");
			const targetTaskElement = document.querySelector(`[data-task-id="${targetTaskId}"]`);

			if (targetTaskElement) {
				listContainer.insertBefore(taskElement, targetTaskElement); // Вставляем элемент перед целевым элементом
			} else {
				listContainer.appendChild(taskElement); // Вставляем элемент в конец, если целевого элемента нет
			}

			saveData();
		}
	});


	function showTask() {
    const savedData = localStorage.getItem("tasksData");
    if (savedData) {
        const tasksData = JSON.parse(savedData);
        tasksData.forEach(taskData => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("tasks");
            taskElement.setAttribute("data-task-id", taskData.id);
            taskElement.setAttribute("draggable", "true");

            const chekk = document.createElement("div");
            chekk.classList.add("krugalochka");
            if (taskData.isChecked) {
                chekk.classList.add("checked");
            }
            taskElement.appendChild(chekk);

            const textik = document.createElement("p");
            textik.textContent = taskData.text;
            if (taskData.isChecked) {
                textik.classList.add("checked");
            }
            taskElement.appendChild(textik);

            const pencil = document.createElement("div");
            pencil.classList.add("editor");
            taskElement.appendChild(pencil);

            const krest = document.createElement("span");
            krest.innerHTML = "\u00d7";
            taskElement.appendChild(krest);

            listContainer.appendChild(taskElement);
        }); 
    }
}


	//чтобы было удобно а не по клику добавлять задачи
	inputBox.addEventListener('keyup', function(event) {
		if (event.key === 'Enter') {
				addTask();
		}
	});

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

	showTask()