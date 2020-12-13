//Selectors
const todoList = document.querySelector(".todo-list")
const addButton = document.querySelector(".add-button")
const showPrebuiltButton = document.querySelector(".show-prebuilt-button")
const preBuiltContainer = document.querySelector(".prebuilt-container")
//const navBarButton = document.querySelector(".navbar-button")
const sideNavBar = document.querySelector(".side-navbar")
const formInput = document.querySelector(".form-input")
const currentDate = document.querySelector(".current-date")
const addPreBuiltButtons = document.querySelectorAll(".add-prebuilt-task")

//Calendar variable
var calendar;

//Event Listernners
document.addEventListener("DOMContentLoaded", createCalendar)
document.addEventListener("DOMContentLoaded", loadCurrentDate)
document.addEventListener("DOMContentLoaded", loadTodosFromStorage)
addButton.addEventListener('click', addTodo)
showPrebuiltButton.addEventListener('click', showPrebuilt)
addPreBuiltButtons.forEach(button => {
    button.addEventListener('click', addTodo)
})
todoList.addEventListener('click', todoClick)
//navBarButton.addEventListener('click', toggleNavbar)

//Functions
function addTodo(event) {
    event.preventDefault()
    let todoText = ""
    if(event.target.classList[0] === "add-button" && formInput.value != ""){
        todoText = formInput.value
    }
    else if (event.target.classList[0] === "add-prebuilt-task"){
        todoText = event.target.previousElementSibling.innerText
    }

    if (todoText != "") {
        //DIV
        const todoDiv = document.createElement("div")
        todoDiv.classList.add("todo-div")
        //LI
        const todoLi = document.createElement("li")
        todoLi.classList.add("todo-item")
        todoLi.innerText = todoText    
        //SAVE IN STORAGE
        todoObject = {
            date: currentDate.innerText,
            todo: {
                text: todoText,
                completed: false
            }
        }
        saveNewTodo(todoObject)
        addCalendarEvent(currentDate.innerText)
        //COMPLETE BUTTON
        const completeButton = document.createElement("Button")
        completeButton.innerHTML = '<i class="fas fa-check"></i'
        completeButton.classList.add("complete-button")
        //DELETE BUTTON
        const deleteButton = document.createElement("Button")
        deleteButton.innerHTML = '<i class="fas fa-times"></i>'
        deleteButton.classList.add("delete-button")

        todoDiv.appendChild(todoLi)
        todoDiv.appendChild(completeButton)
        todoDiv.appendChild(deleteButton)
        todoList.appendChild(todoDiv)
        formInput.value = null
    }

}

function todoClick(event) {
    if (event.target.classList[0] === "delete-button") {
        const todoItem = event.target.parentElement
        removeTodoFromStorage(todoItem.querySelector(".todo-item").innerText)
        todoItem.remove()
    }
    else if (event.target.classList[0] === "complete-button") {
        const todoItem = event.target.parentElement
        const todotext = todoItem.querySelector(".todo-item").innerText
        todoItem.querySelector(".todo-item").classList.toggle("completed")

        let todos = JSON.parse(localStorage.getItem("todos"))
        todos.forEach(todoObject => {
            if (todoObject.date === currentDate.innerText && todotext === todoObject.todo.text) {
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
    let todos
    if (localStorage.getItem("todos") === null) {
        todos = []
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"))
    }
    let todoIndex = 0;
    todos.forEach(todoObject => {
        if (todoObject.date === currentDate.innerText && todo === todoObject.todo.text) {
            todoIndex = todos.indexOf(todoObject)
        }
    });
    todos.splice(todoIndex, 1)
    localStorage.setItem("todos", JSON.stringify(todos))
    removeCalendarEvent(currentDate.innerText)
}

function loadCurrentDate() {
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
            if (todo.todo.completed) {
                todoLi.classList.add("completed")
            }
            //COMPLETE BUTTON
            const completeButton = document.createElement("Button")
            completeButton.innerHTML = '<i class="fas fa-check"></i'
            completeButton.classList.add("complete-button")
            //DELETE BUTTON
            const deleteButton = document.createElement("Button")
            deleteButton.innerHTML = '<i class="fas fa-times"></i>'
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
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: function (info) {
            loadDay(info),
            currentDate.classList.toggle("date-animation")
            currentDate.addEventListener('animationend', function(){
                currentDate.classList.remove("date-animation")
            })
        },
        selectable: true,
        unselectAuto: false
    });
    loadEvents();
    calendar.render();

}

function loadDay(dateInfo) {
    currentDate.innerText = dateInfo.dateStr
    loadTodosFromStorage()
}

function addCalendarEvent(date) {
    calendar.addEvent({
        id: date,
        title: `Tarefas`,
        start: date,
        display: 'background',
        backgroundColor: 'green'
    });
    saveEvents()
}

function removeCalendarEvent(date) {
    const events = calendar.getEvents()

    //remove it from calendar
    if (calendar.getEventById(date)) {
        calendar.getEventById(date).remove()
    }

    //remove it from local storage 
    let eventIndex = 0
    events.forEach(event => {
        if (event.id === date) {
            eventIndex = events.indexOf(event)
        }
    });
    events.splice(eventIndex, 1)
    localStorage.setItem("events", JSON.stringify(events))
}

function saveEvents() {
    const events = calendar.getEvents()
    localStorage.setItem('events', JSON.stringify(events))
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem("events"))

    if (events) {
        events.forEach(event => {
            calendar.addEvent(event)
        });
    }
}

function showPrebuilt(event){
    event.preventDefault()
    preBuiltContainer.classList.toggle("showContainer")
}


//Navbar functions
function toggleNavbar(){
    sideNavBar.classList.toggle("show-navbar")
    sideNavBar.addEventListener('transitionend', function(){
        calendar.updateSize()
    })
    
}





