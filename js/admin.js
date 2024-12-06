window.onload = () => {
    displayEntries();

    // Update the view when the local storage gets updated.
    window.addEventListener("storage", () => displayEntries());
}

/**
 * Display all the form submission entries stored in the local storage.
 */
function displayEntries() {
    const json = localStorage.getItem("lms-database") || "{}";
    const database = JSON.parse(json);

    // Remove all existing items in the table.
    const table = document.querySelector("#entries-panel table");
    table.querySelectorAll(":scope > tr").forEach(element => {
        element.remove();
    });

    if (database["submissions"]) {
        // Add entries to the table.
        for (const [key, value] of Object.entries(database["submissions"])) {
            const tr = document.createElement("tr");
            tr.id = `i${key}`;

            const firstname = document.createElement("td");
            firstname.textContent = value.firstname;
            tr.appendChild(firstname);
            
            const surname = document.createElement("td");
            surname.textContent = value.lastname;
            tr.appendChild(surname);
            
            const email = document.createElement("td");
            email.textContent = value.email;
            tr.appendChild(email);
            
            const date = document.createElement("td");
            date.textContent = value.date;
            tr.appendChild(date);
            
            const participants = document.createElement("td");
            participants.textContent = value.participants;
            tr.appendChild(participants);

            const comments = document.createElement("td");
            comments.textContent = value.comments;
            tr.appendChild(comments);

            const removeButton = document.createElement("button");
            removeButton.textContent = "x";
            removeButton.addEventListener("click", () => removeEntry(key));

            const removeButtonTd = document.createElement("td");
            removeButtonTd.appendChild(removeButton);
            tr.appendChild(removeButtonTd);

            table.appendChild(tr);
        }
    }
}

/**
 * Remove the entry with the given guid.
 * @param {*} guid: The guid of the entry to remove. 
 */
function removeEntry(guid) {
    const json = localStorage.getItem("lms-database") || "{}";
    const database = JSON.parse(json);

    // Remove the entry.
    if (database["submissions"]) {
        delete database["submissions"][guid];
    }
    
    
    // Serialize the database and store.
    localStorage.setItem("lms-database", JSON.stringify(database));
    
    // Redraw the table.
    displayEntries();
}
