//Selectors
const todoList = document.querySelector(".todo-list")
const addButton = document.querySelector(".add-button")
const formInput = document.querySelector(".form-input")

//Event Listernners
document.addEventListener("DOMContentLoaded", createCalendar)
document.addEventListener("DOMContentLoaded", getTodos)
addButton.addEventListener('click', addTodo)
todoList.addEventListener('click', removeTodo)

//Functions
function addTodo(event){
    event.preventDefault()
    //DIV
    const todoDiv = document.createElement("div")
    todoDiv.classList.add("todo-div")
    //LI
    const todoLi = document.createElement("li")
    todoLi.classList.add("todo-item")
    todoLi.innerText = formInput.value
    saveTodosInStorage(formInput.value)
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

function removeTodo(event){
    if(event.target.classList[0] === "delete-button"){
        const todoItem = event.target.parentElement
        removeTodoFromStorage(todoItem.querySelector(".todo-item").innerText)
        todoItem.remove()
    }
    else if(event.target.classList[0] === "complete-button"){
        console.log(event.target)
        const todoItem = event.target.parentElement
        todoItem.querySelector(".todo-item").classList.toggle("completed")
    }
}

function saveTodosInStorage(todo){
    let todos 
    if(localStorage.getItem("todos") === null){
        todos = []
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    todos.push(todo)
    localStorage.setItem("todos", JSON.stringify(todos))
}

function removeTodoFromStorage(todo){
    console.log(todo)
    let todos 
    if(localStorage.getItem("todos") === null){
        todos = []
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    const todoIndex = todos.indexOf(todo)
    todos.splice(todoIndex, 1)
    localStorage.setItem("todos", JSON.stringify(todos))
}

function getTodos(){
    if(localStorage.getItem("todos") === null){
        todos = []
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"))
        todos.forEach(todoValue => {
            const todoDiv = document.createElement("div")
            todoDiv.classList.add("todo-div")
            const todoLi = document.createElement("li")
            todoLi.classList.add("todo-item")
            todoLi.innerText = todoValue
            const completeButton = document.createElement("Button")
            completeButton.innerText = "C"
            completeButton.classList.add("complete-button")
            const deleteButton = document.createElement("Button")
            deleteButton.innerText = "X"
            deleteButton.classList.add("delete-button")
            todoDiv.appendChild(todoLi)
            todoDiv.appendChild(completeButton)
            todoDiv.appendChild(deleteButton)
            todoList.appendChild(todoDiv)
            formInput.value = null
        });
    }
}


function createCalendar(){
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: function (info) {
            inputDate(info)
        },
        selectable: true
    });
    calendar.render();
}

function inputDate(dateInfo){
    formInput.value = dateInfo.dateStr
}




