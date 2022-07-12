var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  //$(<li>) creates an lie and then the  add class gives the class name to the li 
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);
  

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//jquery sortable UL
$(".card .list-group").sortable({ 
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event){
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
  update: function() {
    var tempArr = [];

    // loop over current set of children in sortable list
    $(this)
      .children()
      .each(function() {
        // save values in temp array
        tempArr.push({
          text: $(this)
            .find("p")
            .text()
            .trim(),
          date: $(this)
            .find("span")
            .text()
            .trim()
        });
      });

    // trim down list's ID to match object property
    var arrName = $(this)
      .attr("id")
      .replace("list-", "");

    // update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();
  },
  stop: function(event) {
    $(this).removeClass("dropover");
  }
});  

// strart the dropable tash 
$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  // this is the most important method because that measn a user is trying to delete something
  drop: function(event, ui){
    console.log("drop")

    ui.draggable.remove();

  },

  over: function(event, ui){
    console.log("over")
  },

  out: function(event, ui){
    console.log("out")
  }

})
// trim down list id to match object property


 



// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

$(".list-group").on("click", "p", function(){
  var text = $(this)
  .text()
  .trim();

  var textInput = $("<textarea>")
  .addClass("form-control")
  .val(text);

  $(this).replaceWith(textInput)
  // this trigger method triggers the specified event adn defaulkt behabior of an event, in this case the textinput
  textInput.trigger("focus")
});


  // edit field was un-focused
  $(".list-group").on("blur", "textarea", function(){
    // get the textarea current value text
    var text = $(this)
    .val();

    // get the parent ul's id attribute

    var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

    // get the tasks position in the list of other li elements 
    var index = $(this)
    .closest(".list-group-item")
    .index();

    tasks[status][index].text = text;
    saveTasks();

    // recreate p element
var taskP = $("<p>")
.addClass("m-1")
.text(text);

// replace textarea with p element
$(this).replaceWith(taskP);
    })  

    $(".list-group").on("click", "span", function(){
      //get current text
      var date = $(this)
      .text( )
      .trim();
    
      // create new input element
    
      var dateInput = $("<input>")
      .attr("type", "text")
      .addClass("form-control")
      .val(date);
    
      //swap out elements
      $(this).replaceWith(dateInput);
    
      //automatically focus on new element 
    
      dateInput.trigger("focus")
    })
    



// due date was clicked 

//value of due datew was changed 
$(".list-group").on("blur", "input[type='text']", function(){
  var date = $(this)
  .val()
  

  // get the parents uls id attribute
  var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "")

  // get the task position in the list of other li elements 
  var index = $(this)
  .closest(".list-group-item")
  .index();

  // updatre task in array and re-save to local storage
  tasks[status][index].date = date;
  saveTasks();

  // recreate span element with boostrap classes
  var takeSpan = $("<span>")
  .addClass("badge badge-primary badge-pill")
  .text(date);

  // replace input with span element
 $(this).replaceWith(takeSpan)  
})

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});



// load tasks for the first time
loadTasks();


