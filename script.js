//Selectors
const todoList = document.querySelector(".todo-list")
const addButton = document.querySelector(".add-button")
const formInput = document.querySelector(".form-input")
const currentDate = document.querySelector(".current-date")

//Event Listernners
document.addEventListener("DOMContentLoaded", createCalendar)
document.addEventListener("DOMContentLoaded", loadCurrentDate)
document.addEventListener("DOMContentLoaded", loadTodosFromStorage)
addButton.addEventListener('click', addTodo)
todoList.addEventListener('click', todoClick)


//Functions
function addTodo(event) {
    event.preventDefault()
    //DIV
    const todoDiv = document.createElement("div")
    todoDiv.classList.add("todo-div")
    //LI
    const todoLi = document.createElement("li")
    todoLi.classList.add("todo-item")
    todoLi.innerText = formInput.value
    todoObject = {
        date: currentDate.innerText,
        todo: {
            text: formInput.value,
            completed: false
        }
    }
    saveNewTodo(todoObject)
    //COMPLETE BUTTON
    const completeButton = document.createElement("Button")
    completeButton.innerText = "C"
    completeButton.classList.add("complete-button")
    //DELETE BUTTON
    const deleteButton = document.createElement("Button")
    deleteButton.innerText = "X"
    deleteButton.classList.add("delete-button")

    todoDiv.appendChild(todoLi)
    todoDiv.appendChild(completeButton)
    todoDiv.appendChild(deleteButton)
    todoList.appendChild(todoDiv)
    formInput.value = null
}

function todoClick(event) {
    if (event.target.classList[0] === "delete-button") {
        const todoItem = event.target.parentElement
        removeTodoFromStorage(todoItem.querySelector(".todo-item").innerText)
        todoItem.remove()
    }
    else if (event.target.classList[0] === "complete-button") {
        console.log(event.target)
        const todoItem = event.target.parentElement
        const todotext = todoItem.querySelector(".todo-item").innerText
        todoItem.querySelector(".todo-item").classList.toggle("completed")
        
        let todos = JSON.parse(localStorage.getItem("todos"))
        todos.forEach(todoObject => {
            if(todoObject.date === currentDate.innerText && todotext === todoObject.todo.text){
                todoObject.todo.completed = !todoObject.todo.completed
            }
        });
        localStorage.setItem("todos", JSON.stringify(todos))
        
    }
}

function saveNewTodo(todo) {
    let todos
    if (localStorage.getItem("todos") === null) {
        todos = []
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    todos.push(todo)
    localStorage.setItem("todos", JSON.stringify(todos))
}

function removeTodoFromStorage(todo) {
    console.log(todo)
    let todos
    if (localStorage.getItem("todos") === null) {
        todos = []
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    let todoIndex = 0;
    todos.forEach(todoObject => {
        if(todoObject.date === currentDate.innerText && todo === todoObject.todo.text){
            todoIndex = todos.indexOf(todoObject)
        }
    });
    todos.splice(todoIndex, 1)
    localStorage.setItem("todos", JSON.stringify(todos))
}

function loadCurrentDate(){
    let date = new Date();
    currentDate.innerText = date.toISOString().substring(0, 10);
}

function loadTodosFromStorage() {
    if (localStorage.getItem("todos") === null) {
        todos = []
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"))
        setTodos(todos)
    }
}

function setTodos(todos) {
    //Clear current todoList
    todoList.textContent = ''

    todos.forEach(todo => {
        if (todo.date == currentDate.innerText) {
            //DIV
            const todoDiv = document.createElement("div")
            todoDiv.classList.add("todo-div")
            //LI
            const todoLi = document.createElement("li")
            todoLi.classList.add("todo-item")
            todoLi.innerText = todo.todo.text
            if(todo.todo.completed){
                todoLi.classList.add("completed")
            }
            //COMPLETE BUTTON
            const completeButton = document.createElement("Button")
            completeButton.innerText = "C"
            completeButton.classList.add("complete-button")
            //DELETE BUTTON
            const deleteButton = document.createElement("Button")
            deleteButton.innerText = "X"
            deleteButton.classList.add("delete-button")
            todoDiv.appendChild(todoLi)
            todoDiv.appendChild(completeButton)
            todoDiv.appendChild(deleteButton)
            todoList.appendChild(todoDiv)
            formInput.value = null
        }
    })
}


function createCalendar() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: function (info) {
            loadDay(info)
        },
        selectable: true
    });
    calendar.render();
}

function loadDay(dateInfo) {
    currentDate.innerText = dateInfo.dateStr
    loadTodosFromStorage()
}




