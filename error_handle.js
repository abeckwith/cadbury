const STORAGE_KEY = "recentConsoleErrors";
const MAX_ERRORS = 10;

// Store only the 3 most recent console.error messages in localStorage
window.addEventListener("error", (event) => {
    const message =
        event.message +
        "\nFILE: " +
        event.filename +
        "\nLINE number: " +
        event.lineno;
    // handleErrors();

    // Get existing errors
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Add newest error with timestamp
    existing.unshift({
        message,
        timestamp: new Date().toISOString(),
    });

    // Keep only the 3 most recent
    const trimmed = existing.slice(0, MAX_ERRORS);

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
});

function seeErrors() {
    //get list of errors:
    const errors =
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const text = errors
        .map((error, index) => {
            return `Message: ${error.message}\n` + `Time: ${error.timestamp}`;
        })
        .join("\n\n-----------------\n\n");

    alert(text || "No saved errors");
}
function clearErrors(){
    localStorage.removeItem(STORAGE_KEY)
}
