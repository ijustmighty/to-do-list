const inputBox = document.getElementById("input-box");//Для получения введённого текста задачи
const listContainer = document.getElementById("list-container");//Для контейнера с задачами
let tasksData = [];


// let lastElementId = parseInt(localStorage.getItem("lastElementId")) || 0;//Уникальный id для каждой новой задачи


//Сохраняем все данные которые имеем на странице (галочка, текст, id)
function saveData() {
	const tasksData = Array.from(listContainer.querySelectorAll(".tasks")).map(taskElement => {
		const taskId = taskElement.getAttribute("data-task-id");
		const text = taskElement.querySelector("p").textContent;
		const isChecked = taskElement.querySelector(".circle").classList.contains("checked");
		return { id: taskId, text: text, isChecked: isChecked };
	});
	localStorage.setItem("tasksData", JSON.stringify(tasksData));
}

function addTask() {
  if (inputBox.value === '') {
    alert("Ты должен написать свою задачу!");
  } else {
    const taskId = tasksData.length; // Уникальный id на основе длины массива
    const task = {
      id: taskId,
      text: inputBox.value,
      isChecked: false // По умолчанию задача не отмечена
    };
    tasksData.push(task); // Добавляем информацию о задаче в массив

    // Остальной код создания задачи (HTML элемента) оставляем без изменений
    const block = document.createElement("div");//Сам блок 
    block.classList.add("tasks");
    block.setAttribute("data-task-id", taskId);// Присваиваем уникальный id каждому новому 'блочку'
    block.setAttribute("draggable", "true"); // Добавляем атрибут "draggable"
    listContainer.appendChild(block);
    const chekk = document.createElement("div");//Для галочки
    chekk.classList.add("circle");
    block.appendChild(chekk);
    let text = document.createElement("p");//Для текста
    text.innerHTML = inputBox.value;
    block.appendChild(text);
    let pencil = document.createElement ("div");//Для редактора 
    pencil.classList.add ("editor");
    block.appendChild(pencil);
    let cross = document.createElement("span");//Для удаления задачи
    cross.innerHTML = "\u00d7";
    block.appendChild(cross);
    
    inputBox.value = '';
    
    // Сохраняем массив tasksData после добавления новой задачи
    saveData();
  }
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
    tasksData = JSON.parse(savedData);

    // Проходим по каждому элементу в массиве tasksData
    tasksData.forEach(taskData => {
// Создание элемента задачи (блока)
			const taskElement = document.createElement("div");
			taskElement.classList.add("tasks"); // Добавляем класс "tasks" к элементу
			taskElement.setAttribute("data-task-id", taskData.id); // Устанавливаем идентификатор задачи

			// Создание элемента для галочки
			const chekk = document.createElement("div");
			chekk.classList.add("circle"); // Добавляем класс "circle" к элементу
			if (taskData.isChecked) {
				chekk.classList.add("checked"); // Если задача отмечена, добавляем класс "checked" для стилизации
			}
			taskElement.appendChild(chekk);

			// Создание элемента для текста задачи
			const text = document.createElement("p");
			text.textContent = taskData.text; // Устанавливаем текст задачи
			if (taskData.isChecked) {
				text.classList.add("checked"); // Если задача отмечена, добавляем класс "checked" для стилизации
			}
			taskElement.appendChild(text);

			// Создание элемента для редактирования задачи
			const pencil = document.createElement("div");
			pencil.classList.add("editor"); // Добавляем класс "editor" к элементу
			taskElement.appendChild(pencil);

			// Создание элемента для удаления задачи
			const cross = document.createElement("span");
			cross.innerHTML = "\u00d7"; // Устанавливаем символ "×" для удаления
			taskElement.appendChild(cross);

			// Добавляем созданный элемент задачи в контейнер списка
			listContainer.appendChild(taskElement);
    });
  }
}


//для того чтобы ставить и убирать галочку, зачёкивать выполненную задачу и убирать задачу из списка при нажатии на крестик
listContainer.addEventListener("click", function(e) {
  if (e.target.classList.contains("circle")) {
    e.target.classList.toggle("checked");
    const text = e.target.nextElementSibling;
    if (text && text.tagName === "P") {
      text.classList.toggle("checked");
    }
    saveData();
  } else if (e.target.tagName === "SPAN") {
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
		par.previousElementSibling.classList.toggle("invis");
		const editTask = document.createElement("input");//Создаём input
		editTask.type = "text";
		editTask.classList.add("newTask");
		editTask.value = par.textContent; //Даём ему значение того что было в p
		par.parentElement.insertBefore(editTask, par.nextSibling);//Вставляем input после par то есть по сути на его же место т.к. его нет

		editTask.focus();

		editTask.addEventListener("keyup", function(event) {
			if (event.key === "Enter") {
				let newValue = editTask.value.trim();
				if (newValue === "") {
					while (newValue === "") {
						// Если input пустой, показываем alert и затем повторно вызываем prompt
						alert("Не оставляйте поле пустым!");
						newValue = prompt("Внесите изменения или оставьте как есть:", par.textContent);
							}
					}
					
					par.textContent = newValue;
					par.classList.remove("invis");
					par.previousElementSibling.classList.remove("invis");
					editTask.remove();
					saveData();
			}
	});
}
}
}, false);





// Функция для перемещения элементов tasks с классом "checked"
// Функция для перемещения элементов tasks с классом "checked"
function moveChecked() {
  const checkedTasks = tasksData.filter(task => task.isChecked);

  checkedTasks.forEach(checkedTask => {
    // Находим задачу в DOM по её уникальному идентификатору
    const taskElement = document.querySelector(`[data-task-id="${checkedTask.id}"]`);

    if (taskElement) {
      // Удаляем задачу из списка
      listContainer.removeChild(taskElement);

      // Добавляем её в контейнер для завершенных задач
      const checkContainer = document.getElementById('check'); // Проверьте, что элемент с id "check" действительно существует
      checkContainer.appendChild(taskElement);
    }
  });
}




// Вызываем функцию для перемещения элементов при загрузке страницы
moveChecked();

showTask();