/**
 * Generate/initialize all functionality associated to the forms.
 */
function generateForms() {
    document.querySelector("#meeting-form").addEventListener("submit", (event) => submitHandler(event));
}

/**
 * Generate an unique UUID.
 * @returns An unique string formatted according to the UUID format.
 */
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}  

/**
 * Attempt to submit the form.
 */
function submitForm() {
    // Fetch the database from local storage.
    const json = localStorage.getItem("lms-database") || "{}";
    const database = JSON.parse(json);

    // Generate an unique id and store the submitted data in the database.
    database["submissions"] = database["submissions"] || {};

    const formElement = document.querySelector("#meeting-form");
    const entry = {
        firstname: formElement.querySelector("#firstname").value,
        lastname: formElement.querySelector("#surname").value,
        email: formElement.querySelector("#email").value,
        date: formElement.querySelector("#date").value,
        participants: formElement.querySelector("#participants").value,
        comments: formElement.querySelector("#comments").value,
    }
    database["submissions"][uuidv4()] = entry;

    // Serialize the database and store.
    localStorage.setItem("lms-database", JSON.stringify(database));

    formElement.reset();
}

/**
 * Handle submit events.
 * @param {*} event: The event associated with a form submission.
 * @returns Whether the submission has been accepted.
 */
function submitHandler(event) {
    event.preventDefault();

    if (!document.querySelector("#terms").checked) {
        alert("De algemene voorwaarden moeten geaccepteerd worden.");
        return false;
    }

    submitForm();
    return true;
}

export { generateForms }