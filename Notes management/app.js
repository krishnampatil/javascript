let titleIn = document.getElementById("title");
let descriptionIn = document.getElementById("description");
let addBtn = document.getElementById("add");
let container = document.getElementById("container");
let editNoteId = null;
let notes = [];

addBtn.addEventListener("click", function () {

    const title = titleIn.value;
    const description = descriptionIn.value;

    if (title === "" || description === "") {
        alert("Please fill all fields");
        return;
    }

    if (editNoteId !== null){
        notes = notes.map(function (note){
            if(note.is === editNoteId){
                return{
                    ...note,
                    title: title,
                    description: description
                };
            }
            return note;
        })

        editNoteId = null;
    } else {
        
        const note = {
        id: Date.now(),
        title: title,
        description: description,
        };

        notes.push(note);
    }

    displayNotes();

    titleIn.value = "";
    descriptionIn.value = "";
});

function displayNotes() {
    container.innerHTML = "<h3>Note List</h3>";

    notes.forEach(function (note) {

        const noteDiv = document.createElement("div");

        noteDiv.innerHTML = `
            <h4>${note.title}</h4>
            <p>${note.description}</p>

            <button onclick="editNote(${note.id})">
                Edit
            </button>

            <button onclick="deleteNote(${note.id})">
                Delete
            </button>

            <hr>
        `;
        container.appendChild(noteDiv);
    });
}

function deleteNote(id){
    notes = notes.filter(function (note){
        return note.id !== id;
    });

    displayNotes();
}

function editNote(id){
    
    const note = notes.find(function(note){
        return note.id === id;
    });

    titleIn.value = note.title;
    descriptionIn.value = note.description;
    
    editNoteId = id;
}