// Store only the 3 most recent console.error messages in localStorage
(function () {
    const STORAGE_KEY = "recentConsoleErrors";
    const MAX_ERRORS = 3;
    // alert("function called")
    // Keep original console.error behavior
    const originalConsoleError = console.error;

    //override console.error:
    console.error = function (...args) {
        try {
            alert("overridden error function called")
            // Convert arguments into a readable string
            const message = args
                .map((arg) => {
                    if (arg instanceof Error) {
                        return arg.stack || arg.message;
                    }

                    if (typeof arg === "object") {
                        return JSON.stringify(arg);
                    }

                    return String(arg);
                })
                .join(" ");

            // Get existing errors
            const existing =
                JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            // Add newest error with timestamp
            existing.unshift({
                message,
                timestamp: new Date().toISOString(),
            });

            // Keep only the 3 most recent
            const trimmed = existing.slice(0, MAX_ERRORS);

            // Save back to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        } catch (e) {
            // Avoid recursive console.error calls
        }

        // Still output to browser console
        originalConsoleError.apply(console, args);
    };
})();
function seeErrors() {
    //get list of errors:
    const errors =
        JSON.parse(localStorage.getItem("recentConsoleErrors")) || [];

    const text = errors
        .map((error, index) => {
            return `Message: ${error.message}\n` + `Time: ${error.timestamp}`;
        })
        .join("\n\n-----------------\n\n");

    alert(text || "No saved errors");
}
