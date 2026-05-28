let titleIn = document.getElementById("title");
let descriptionIn = document.getElementById("description");
let addBtn = document.getElementById("add");
let container = document.getElementById("container");
let searchInput = document.getElementById("search");
const categoryInput = document.getElementById("category");
const filterCategory = document.getElementById("filterCategory");
let editNoteId = null;
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

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
        category: categoryInput.value,
        isPinned: false
        };

        notes.push(note);
    }
    saveNotes();
    displayNotes();

    titleIn.value = "";
    descriptionIn.value = "";
});

function displayNotes() {
    container.innerHTML = "<h3>Note List</h3>";

    const sortedNotes = [...notes].sort(function (a, b) {
    return b.isPinned - a.isPinned;
});

    sortedNotes.forEach(function (note) {

        const noteDiv = document.createElement("div");

        noteDiv.classList.add("note-card");

        noteDiv.innerHTML = `
            <h4>${note.title}</h4>
            <p>${note.description}</p>

            <small>Category: ${note.category}</small>

            <br><br>

            <button onclick="togglePin(${note.id})">
            ${note.isPinned ? "Unpin" : "Pin"}
            </button>

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
    saveNotes();
    displayNotes();
}

function togglePin(id) {

    notes = notes.map(function (note) {

        if (note.id === id) {

            return {
                ...note,
                isPinned: !note.isPinned
            };
        }

        return note;
    });

    saveNotes();
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

searchInput.addEventListener("input", function () {

    const searchText = searchInput.value.toLowerCase();

    const filteredNotes = notes.filter(function (note) {

        return (
            note.title.toLowerCase().includes(searchText) ||
            note.description.toLowerCase().includes(searchText)
        );
    });

    displayFilteredNotes(filteredNotes);
});


filterCategory.addEventListener("change", function () {

    const selectedCategory = filterCategory.value;

    if (selectedCategory === "All") {

        displayNotes();

        return;
    }

    const filteredNotes = notes.filter(function (note) {

        return note.category === selectedCategory;
    });

    displayFilteredNotes(filteredNotes);
});

function displayFilteredNotes(filteredNotes) {

    container.innerHTML = "<h3>Note List</h3>";

    filteredNotes.forEach(function (note) {

        const noteDiv = document.createElement("div");

        noteDiv.classList.add("note-card");

        noteDiv.innerHTML = `
            <h4>${note.title}</h4>
            <p>${note.description}</p>

            <button onclick="togglePin(${note.id})">
            ${note.isPinned ? "Unpin" : "Pin"}
            </button>

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

displayNotes();