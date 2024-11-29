let currentTheme = 'default';
    
document.getElementById("toggleTheme").addEventListener("click", function () {
    const body = document.body;

    if (currentTheme === 'default') {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        currentTheme = 'dark';
    } else if (currentTheme === 'dark') {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        currentTheme = 'light';
    } else {
        body.classList.remove("light-mode");
        currentTheme = 'default';
    }
});
document.getElementById("fontSelectButton").addEventListener("click", function () {
    const newFont = prompt("Enter a font style (Poppins, Arial, Courier New):", "Poppins");
    if (newFont) {
        document.querySelectorAll('*').forEach(function (el) {
            el.style.fontFamily = newFont;
        });
    }
});

document.getElementById("fontSizeButton").addEventListener("click", function () {
    const newSize = prompt("Enter a font size (e.g., 16px, 18px, 14px):", "16px");
    if (newSize) {
        document.querySelectorAll('*').forEach(function (el) {
            el.style.fontSize = newSize;
        });

        // Convert the font size to a number (e.g., '16px' -> 16)
        const sizeNumber = parseInt(newSize);

        // Adjust the size of the cards based on the new font size
        document.querySelectorAll('.card').forEach(function (card) {
            card.style.height = (sizeNumber * 10) + 'px'; // Adjust the multiplier (10) as needed
            card.style.width = (sizeNumber * 10) + 'px';  // Adjust the multiplier to keep aspect ratio
        });
        document.querySelectorAll('.hero_area').forEach(function (nav) {
            nav.style.height = (sizeNumber * 1.2) + 'vh'; // Adjust the multiplier (10) as needed
        });
    }
});

document.getElementById("letterSpacingButton").addEventListener("click", function () {
    const dialog = document.getElementById("letterSpacingDialog");
    dialog.style.display = (dialog.style.display === "none" || dialog.style.display === "") ? "block" : "none";
});

document.getElementById("setSpacingButton").addEventListener("click", function () {
    const spacingValue = document.getElementById("letterSpacing").value;
    if (spacingValue) {
        document.querySelectorAll('*').forEach(function (el) {
            el.style.letterSpacing = spacingValue + 'px'; // Set letter spacing
        });
        document.getElementById("letterSpacingDialog").style.display = "none"; // Hide dialog after setting spacing
    }
});