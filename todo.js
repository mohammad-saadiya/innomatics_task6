let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");

// Fetch the todo list from localStorage
function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  return parsedTodoList === null ? [] : parsedTodoList;
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

// Save todo list to localStorage
saveTodoButton.onclick = function () {
  localStorage.setItem("todoList", JSON.stringify(todoList));
};

// Add new todo
addTodoButton.onclick = function () {
  onAddTodo();
};

// Function to add a new todo
function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let dueDateElement = document.getElementById("dueDateInput");
  let priorityElement = document.getElementById("priorityInput");
  let categoryElement = document.getElementById("categoryInput");

  let userInputValue = userInputElement.value;
  let dueDateValue = dueDateElement.value;
  let priorityValue = priorityElement.value;
  let categoryValue = categoryElement.value;

  // Validate input
  if (userInputValue === "") {
    alert("Please enter a valid task");
    return;
  }

  todosCount += 1;

  let newTodo = {
    id: todosCount,
    text: userInputValue,
    dueDate: dueDateValue,
    priority: priorityValue,
    category: categoryValue,
    isChecked: false,
  };

  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  
  // Clear input fields
  userInputElement.value = "";
  dueDateElement.value = "";
  priorityElement.value = "low";
  categoryElement.value = "";
}

// Function to handle todo status change
function onTodoStatusChange(checkboxId, labelId, todoId) {
  let checkboxElement = document.getElementById(checkboxId);
  let labelElement = document.getElementById(labelId);
  labelElement.classList.toggle("checked");

  let todoObjectIndex = todoList.findIndex((todo) => todo.id === todoId);
  todoList[todoObjectIndex].isChecked = !todoList[todoObjectIndex].isChecked;
}

// Function to delete a todo
function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(`todo${todoId}`);
  todoItemsContainer.removeChild(todoElement);
  todoList = todoList.filter((todo) => todo.id !== todoId);
}

// Function to create and append a todo item
function createAndAppendTodo(todo) {
  let todoId = `todo${todo.id}`;
  let checkboxId = `checkbox${todo.id}`;
  let labelId = `label${todo.id}`;

  let todoElement = document.createElement("li");
  todoElement.id = todoId;
  todoElement.classList.add("todo-item-container");

  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = checkboxId;
  inputElement.checked = todo.isChecked;
  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todo.id);
  };

  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId);
  labelElement.id = labelId;
  labelElement.textContent = `${todo.text} (Due: ${todo.dueDate}, Priority: ${todo.priority}, Category: ${todo.category})`;
  labelElement.classList.toggle("checked", todo.isChecked);

  let deleteButton = document.createElement("i");
  deleteButton.classList.add("far", "fa-trash-alt");
  deleteButton.onclick = function () {
    onDeleteTodo(todo.id);
  };

  todoElement.appendChild(inputElement);
  todoElement.appendChild(labelElement);
  todoElement.appendChild(deleteButton);
  todoItemsContainer.appendChild(todoElement);
}

// Load all existing todos from localStorage
for (let todo of todoList) {
  createAndAppendTodo(todo);
}

// Filter functionality
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    let filter = btn.getAttribute("data-filter");
    filterTasks(filter);
  });
});

// Function to filter tasks based on their status
function filterTasks(filter) {
  todoItemsContainer.innerHTML = "";

  let filteredList = todoList.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.isChecked;
    if (filter === "pending") return !todo.isChecked;
  });

  for (let todo of filteredList) {
    createAndAppendTodo(todo);
  }
}
