//Selectors
const tabChangeButton = document.querySelectorAll(".tab-change-button")
const todoList = document.querySelector(".todo-list")
const addButton = document.querySelector(".add-button")
const showPrebuiltButton = document.querySelector(".show-prebuilt-button")
const preBuiltContainer = document.querySelector(".prebuilt-container")
const sideNavBar = document.querySelector(".side-navbar")
const formInput = document.querySelector(".form-input")
const currentDate = document.querySelector(".current-date")
const addPreBuiltButtons = document.querySelectorAll(".add-prebuilt-task")

//Calendar variable
var calendar;

//Chart variable
var chartCtx;

//Event Listernners

//Called when page is loaded
document.addEventListener("DOMContentLoaded", createCalendar)
document.addEventListener("DOMContentLoaded", loadCurrentDate)
document.addEventListener("DOMContentLoaded", loadTodosFromStorage)
document.addEventListener("DOMContentLoaded", createChart)


//Called when a button is clicked
tabChangeButton.forEach(button => {
    button.addEventListener('click', changeTab)
})
addButton.addEventListener('click', addTodo)
showPrebuiltButton.addEventListener('click', showPrebuilt)
addPreBuiltButtons.forEach(button => {
    button.addEventListener('click', addTodo)
})
todoList.addEventListener('click', todoClick)


//Functions

function changeTab(event) {
    event.preventDefault()
    const rightContainer = document.querySelector(".right-container")
    const rightContainerTabs = rightContainer.children

    tabChangeButton.forEach(button => {
        button.classList.remove("active")
    })

    for (let i = 1; i < rightContainerTabs.length; i++) {
        if (rightContainerTabs[i].classList[0] === event.target.value) {
            rightContainerTabs[i].style.display = "block"
        }
        else {
            rightContainerTabs[i].style.display = "none"
        }
    }
    event.target.classList.add("active")

}


function createToDo(todoText, completed) {
    //DIV
    const todoDiv = document.createElement("div")
    todoDiv.classList.add("todo-div")
    //LI
    const todoLi = document.createElement("li")
    todoLi.classList.add("todo-item")
    todoLi.innerText = todoText
    if (completed) {
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

function addTodo(event) {
    event.preventDefault()
    let todoText = ""
    if (event.target.classList[0] === "add-button" && formInput.value != "") {
        todoText = formInput.value
    }
    else if (event.target.classList[0] === "add-prebuilt-task") {
        todoText = event.target.previousElementSibling.innerText
    }

    //Check if its already in toDo List
    let tasksStorage = JSON.parse(localStorage.getItem("tasksStorage"))
    let storageTodos = tasksStorage[currentDate.innerText]
    let inList = false

    if (storageTodos) {
        storageTodos.forEach(todoObject => {
            if (todoObject.todo.text === todoText) {
                inList = true
            }
        })
    }

    if (todoText != "" && !inList) {
        //Create toDo item
        createToDo(todoText)

        //SAVE IN STORAGE AND ADD CALENDAR EVENT
        todoObject = {
            date: currentDate.innerText,
            todo: {
                text: todoText,
                completed: false
            }
        }
        saveNewTodo(todoObject)
        addCalendarEvent(currentDate.innerText)
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

        let tasksStorage = JSON.parse(localStorage.getItem("tasksStorage"))
        let todos = tasksStorage[currentDate.innerText]

        todos.forEach(todoObject => {
            if (todotext === todoObject.todo.text) {
                todoObject.todo.completed = !todoObject.todo.completed
            }
        });
        tasksStorage[currentDate.innerText] = todos
        localStorage.setItem("tasksStorage", JSON.stringify(tasksStorage))
    }
}

function saveNewTodo(todo) {
    //let todos
    let tasksStorage

    if (localStorage.getItem("tasksStorage") === null) {
        tasksStorage = {}
    }
    else {
        tasksStorage = JSON.parse(localStorage.getItem("tasksStorage"))
    }

    if (!tasksStorage[todo.date]) {
        tasksStorage[todo.date] = []
    }

    tasksStorage[todo.date].push(todo)
    localStorage.setItem("tasksStorage", JSON.stringify(tasksStorage))

}

function removeTodoFromStorage(todo) {
    let todos = [];
    let todoIndex = 0;

    if (localStorage.getItem("tasksStorage") === null) {
        tasksStorage = {}
    }
    else {
        tasksStorage = JSON.parse(localStorage.getItem("tasksStorage"))
    }

    todos = tasksStorage[currentDate.innerText]
    todos.forEach(todoObject => {
        if (todo === todoObject.todo.text) {
            todoIndex = todos.indexOf(todoObject)
        }
    });
    todos.splice(todoIndex, 1)
    tasksStorage[currentDate.innerText] = todos;
    if (todos.length == 0) {
        delete tasksStorage[currentDate.innerText]
    }
    localStorage.setItem("tasksStorage", JSON.stringify(tasksStorage))
    removeCalendarEvent(currentDate.innerText)
}


function loadTodosFromStorage() {
    if (localStorage.getItem("tasksStorage") === null) {
        tasksStorage = {}
    }
    else {
        tasksStorage = JSON.parse(localStorage.getItem("tasksStorage"))
        setTodos(tasksStorage)
    }
}

function setTodos(taskStorage) {
    //Clear current todoList
    todoList.textContent = ''
    todos = taskStorage[currentDate.innerText]

    if (todos) {
        todos.forEach(todoObject => {
            createToDo(todoObject.todo.text, todoObject.todo.completed)
        })
    }

}


function loadCurrentDate() {
    let date = new Date();
    currentDate.innerText = date.toISOString().substring(0, 10);
}


function createCalendar() {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: function (info) {
            loadDay(info),
                currentDate.classList.toggle("date-animation")
            currentDate.addEventListener('animationend', function () {
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

function showPrebuilt(event) {
    event.preventDefault()
    preBuiltContainer.classList.toggle("showContainer")
}


function createChart() {
    chartCtx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(chartCtx, {
        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
            datasets: [{
                data: [10, 20, 30],

                backgroundColor: [
                    '#4dc9f6',
                    '#f67019',
                    '#f53794',
                ]
            }],
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Red',
                'Yellow',
                'Blue'
            ],
        },

        // Configuration options go here
        options: {}
    });
}



