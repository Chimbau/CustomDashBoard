//Selectors
const tabChangeButton = document.querySelectorAll(".tab-change-button")
const todoList = document.querySelector(".todo-list")
const addButton = document.querySelector(".add-button")
const showPrebuiltButton = document.querySelector(".show-prebuilt-button")
const preBuiltContainer = document.querySelector(".prebuilt-container")
const sideNavBar = document.querySelector(".side-navbar")
const formInput = document.querySelector(".form-input")
const currentDate = document.querySelector(".current-date")
const currentStatisticsDates = document.querySelector(".current-selected-dates")
const addPreBuiltButtons = document.querySelectorAll(".add-prebuilt-task")
const preBuiltInput = document.querySelector(".pre-built-input")
const preBuiltAddButton = document.querySelector(".pre-built-add-button")

//Calendar variable
var calendar;

//Chart variables
var chartCtx;
var globalChart;

//Event Listernners

//Called when page is loaded
document.addEventListener("DOMContentLoaded", createCalendar)
document.addEventListener("DOMContentLoaded", loadCurrentDate)
document.addEventListener("DOMContentLoaded", loadTodosFromStorage)
document.addEventListener("DOMContentLoaded", loadPreBuiltTasks)
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
preBuiltAddButton.addEventListener('click', addPreBuiltTask)

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
    completeButton.innerHTML = '<i class="fas fa-check"></i>'
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

//Pre-built tasks

function addPreBuiltTask(event) {
    event.preventDefault()
    let task = createPreBuiltTask(preBuiltInput.value)
    preBuiltInput.value = ""
    savePreBuiltTask(task)
}

function createPreBuiltTask(taskText) {
    //LI
    const itemList = document.createElement("li")

    //SPAN
    const itemLabel = document.createElement("span")
    itemLabel.innerText = taskText

    //ADD BUTTON
    const addTaskButton = document.createElement("button")
    addTaskButton.classList.add("add-prebuilt-task")
    addTaskButton.innerHTML = '<i class="fas fa-plus"></i>'
    addTaskButton.addEventListener('click', addTodo)

    //APPEND TO LIST
    const list = document.querySelector(".pre-built-list")
    itemList.appendChild(itemLabel)
    itemList.appendChild(addTaskButton)
    list.appendChild(itemList)

    return itemLabel.innerText
}

function savePreBuiltTask(task) {
    let preBuiltTasksStorage

    if (localStorage.getItem("preBuiltTasksStorage") === null) {
        preBuiltTasksStorage = {}
    }
    else {
        preBuiltTasksStorage = JSON.parse(localStorage.getItem("preBuiltTasksStorage"))
    }
    let randomColor = Math.floor(Math.random()*16777215).toString(16)
    preBuiltTasksStorage[task] = '#' + randomColor
    localStorage.setItem("preBuiltTasksStorage", JSON.stringify(preBuiltTasksStorage))
}

function loadPreBuiltTasks() {
    if (localStorage.getItem("preBuiltTasksStorage") === null) {
        preBuiltTasksStorage = {}
    }
    else {
        preBuiltTasksStorage = JSON.parse(localStorage.getItem("preBuiltTasksStorage"))
    }
    Object.keys(preBuiltTasksStorage).forEach(task => {
        createPreBuiltTask(task)
    })
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
        select: function (info) {
            //Get selected dates
            currentStatisticsDates.innerText = `${info.startStr.substring(0, 10)} \u00A0 to \u00A0 ${info.endStr.substring(0, 10)}`
            currentStatisticsDates.classList.toggle("date-animation")
            currentStatisticsDates.addEventListener('animationend', function () {
                currentStatisticsDates.classList.remove("date-animation")
            })
            let selectedDates = []
            let dateStart = info.start
            let dayDifference = (info.end.getTime() - info.start.getTime()) / (1000 * 3600 * 24)
            for (let i = 0; i < dayDifference; i++) {
                dateString = dateStart.toISOString().substring(0, 10)
                selectedDates.push(dateString)
                dateStart.setDate(dateStart.getDate() + 1);
            }

            loadChartDataSet(selectedDates)
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
    showPrebuiltButton.firstElementChild.classList.toggle("rotate-animation")
}

function loadChartDataSet(selectedDates) {
    const tasksStorage = JSON.parse(localStorage.getItem("tasksStorage"))
    const preBuilt = JSON.parse(localStorage.getItem("preBuiltTasksStorage")) || {}
    let dataSet = {}
    let colors = []
    selectedDates.forEach(date => {
        if (tasksStorage[date]) {
            tasksStorage[date].forEach(task => {
                let taskText = task.todo.text
                if (preBuilt[taskText]) {
                    if (!dataSet[taskText]) {
                        dataSet[taskText] = 1
                    }
                    else {
                        dataSet[taskText]++
                    }
                }
                else{
                    if(!dataSet["Others"]){
                        dataSet["Others"] = 1
                    }
                    else{
                        dataSet["Others"]++
                    }
                    
                }

            })
        }
    })
 
    Object.keys(preBuilt).forEach(key => {
        if(dataSet[key]){
            colors.push(preBuilt[key])
        }
    })
  
    globalChart.data.datasets[0].data = Object.values(dataSet)
    globalChart.data.labels = Object.keys(dataSet)
    globalChart.data.datasets[0].backgroundColor = colors
    globalChart.update()
}


function createChart() {
    chartCtx = document.getElementById('myChart').getContext('2d');
    globalChart = new Chart(chartCtx, {
        // The type of chart we want to create
        type: 'pie',

        // The data for our dataset
        data: {
            datasets: [{
                data: [],

                backgroundColor: []
            }],
            // These labels appear in the legend and in the tooltips when hovering different arcs
        },

        // Configuration options go here
        options: {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 14
                }
            },
            cutoutPercentage: 40
        }
    });
}



