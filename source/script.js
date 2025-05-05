// Detect platform
var isWebCollect = (document.body.className.indexOf("web-collect") >= 0);
var isAndroid = (document.body.className.indexOf("android-collect") >= 0);
var isIOS = (document.body.className.indexOf("ios-collect") >= 0);

// Get parameters
var leftSymbol = getPluginParameter("left");
var rightSymbol = getPluginParameter("right");
var belowSymbol = getPluginParameter("below");
var fieldWidthParam = getPluginParameter("field-width"); // Use field-width parameter

// Get DOM elements
var input = document.getElementById('decimal-field');
var leftLabel = document.querySelector("#symbol-left");
var rightLabel = document.querySelector("#symbol-right");
var belowLabel = document.querySelector("#symbol-below");
var inputWrapper = document.querySelector(".input-wrapper");

// --- Symbol Visibility ---
var hasLeftSymbol = false;
if (leftSymbol) {
    leftLabel.textContent = leftSymbol;
    leftLabel.classList.remove("hide-symbol");
    hasLeftSymbol = true;
} else {
    leftLabel.classList.add("hide-symbol");
    leftLabel.textContent = ''; // Clear content if hidden
}

var hasRightSymbol = false;
if (rightSymbol) {
    rightLabel.textContent = rightSymbol;
    rightLabel.classList.remove("hide-symbol");
    hasRightSymbol = true;
} else {
    rightLabel.classList.add("hide-symbol");
    rightLabel.textContent = ''; // Clear content if hidden
}

if (belowSymbol) {
    belowLabel.textContent = belowSymbol;
    belowLabel.classList.remove("hide-symbol");
} else {
    belowLabel.classList.add("hide-symbol");
    belowLabel.textContent = ''; // Clear content if hidden
}

// --- Width Calculation Logic ---

// Reset inline styles before applying new ones to rely on CSS defaults first
input.style.flexGrow = '';
input.style.flexShrink = '';
input.style.flexBasis = '';
input.style.maxWidth = '';
input.style.minWidth = '';
leftLabel.style.flexGrow = '';
leftLabel.style.flexShrink = '';
leftLabel.style.flexBasis = '';
leftLabel.style.maxWidth = '';
rightLabel.style.flexGrow = '';
rightLabel.style.flexShrink = '';
rightLabel.style.flexBasis = '';
rightLabel.style.maxWidth = '';

if (fieldWidthParam && inputWrapper) {
    // --- Behavior WITH field-width parameter ---
    let inputPercent;
    // Parse parameter value (keywords or direct percentage)
    if (fieldWidthParam === "half") inputPercent = 50;
    else if (fieldWidthParam === "quarter") inputPercent = 25;
    else if (fieldWidthParam === "third") inputPercent = 33.33;
    else if (fieldWidthParam === "two-thirds") inputPercent = 66.67;
    else if (fieldWidthParam === "fifth") inputPercent = 20; // Example: 20%
    else if (!isNaN(fieldWidthParam)) inputPercent = parseFloat(fieldWidthParam);
    else inputPercent = null; // Invalid parameter value

    if (inputPercent !== null && inputPercent > 0 && inputPercent < 100) {
        const symbolsTotalPercent = 100 - inputPercent;

        // --- Input field takes the specified fixed width percentage ---
        input.style.flexBasis = `${inputPercent}%`;
        input.style.flexGrow = '0';   // Don't grow
        input.style.flexShrink = '0';  // Don't shrink
        input.style.minWidth = `${inputPercent}%`; // Ensure it doesn't get smaller than basis

        // --- Symbols take natural width, don't grow, but have max-width ---
        const symbolFlexGrow = '0';     // Symbols should NOT grow
        const symbolFlexShrink = '1';   // Allow shrinking if needed
        const symbolFlexBasis = 'auto'; // Base size on content

        if (hasLeftSymbol && hasRightSymbol) {
            const maxSymbolWidth = symbolsTotalPercent / 2;
            leftLabel.style.flexGrow = symbolFlexGrow;
            leftLabel.style.flexShrink = symbolFlexShrink;
            leftLabel.style.flexBasis = symbolFlexBasis;
            leftLabel.style.maxWidth = `${maxSymbolWidth}%`;
            rightLabel.style.flexGrow = symbolFlexGrow;
            rightLabel.style.flexShrink = symbolFlexShrink;
            rightLabel.style.flexBasis = symbolFlexBasis;
            rightLabel.style.maxWidth = `${maxSymbolWidth}%`;
        } else if (hasLeftSymbol) {
            leftLabel.style.flexGrow = symbolFlexGrow;
            leftLabel.style.flexShrink = symbolFlexShrink;
            leftLabel.style.flexBasis = symbolFlexBasis;
            leftLabel.style.maxWidth = `${symbolsTotalPercent}%`;
        } else if (hasRightSymbol) {
            rightLabel.style.flexGrow = symbolFlexGrow;
            rightLabel.style.flexShrink = symbolFlexShrink;
            rightLabel.style.flexBasis = symbolFlexBasis;
            rightLabel.style.maxWidth = `${symbolsTotalPercent}%`;
        }
    } else {
        console.warn("Invalid field-width parameter value. Falling back to default behavior.");
        applyDefaultWidthBehavior();
    }
} else {
    // --- Default behavior WITHOUT field-width parameter ---
    applyDefaultWidthBehavior();
}

function applyDefaultWidthBehavior() {
    // Input field grows (flex-grow: 1 from CSS)
    // Symbols take auto basis, don't grow (flex-grow: 0 from CSS), shrink (flex-shrink: 1 from CSS)
    if (hasLeftSymbol && hasRightSymbol) {
        leftLabel.style.maxWidth = '33.33%';
        rightLabel.style.maxWidth = '33.33%';
    } else if (hasLeftSymbol) {
        leftLabel.style.maxWidth = '66.67%';
    } else if (hasRightSymbol) {
        rightLabel.style.maxWidth = '66.67%';
    }
    // Input field width is handled by its default flex-grow: 1 in CSS, taking remaining space.
}


// --- Input Filtering and Other Functions ---

// Checks whether an input should be treated like an empty decimal value.
function isEmptyDecimal(value) {
    return value === "" || value === "-" || value === "." || value === "-.";
}

// Restricts input for the given textbox to the given inputFilter.
function setInputFilter(textbox, inputFilter) {
    function restrictInput() {
        // Store cursor position and value before filtering
        let originalValue = this.value;
        let originalStart = this.selectionStart;
        let originalEnd = this.selectionEnd;
        let valueChangedByTruncation = false; // Flag to track if value was changed specifically by truncation

        // Truncate to 15 characters *before* validation
        if (this.value.length > 15) {
           this.value = this.value.substring(0, 15);
           valueChangedByTruncation = true;
           // Adjust potential cursor position if truncation happened
           originalStart = Math.min(originalStart, 15);
           originalEnd = Math.min(originalEnd, 15);
        }

        if (inputFilter(this.value)) { // Validate the (potentially truncated) value
            // Value is valid
            this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
            this.oldValue = this.value;
            // Save the valid (potentially truncated) value
            setAnswer(isEmptyDecimal(this.value) ? "" : this.value);

            // If the value was changed *only* by truncation, restore the adjusted cursor position
            if (valueChangedByTruncation) {
                this.setSelectionRange(originalStart, originalEnd);
            }
        } else if (this.hasOwnProperty("oldValue")) {
            // Value is invalid, revert to the last known valid value
            this.value = this.oldValue;
            // Try to restore cursor position to where it was before the invalid change
            this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            // No need to call setAnswer here, the value is reverting to the last saved state
        } else {
            // Value is invalid and there's no history, clear it
            this.value = "";
            this.oldValue = ""; // Update oldValue as well
            this.oldSelectionStart = 0;
            this.oldSelectionEnd = 0;
            // Save the empty value
            setAnswer("");
        }
    }

    // Apply restriction logic on the 'input' event
    textbox.addEventListener("input", restrictInput);
}


// If the field is not marked readonly, then restrict input to decimal only.
if(!fieldProperties.READONLY) {

    // Set/remove the "inputmode".
    function setInputMode(attributeValue) {
        if (attributeValue === null) {
            input.removeAttribute("inputmode");
        } else {
            input.setAttribute("inputmode", attributeValue);
        }
    }

    // Platform-specific inputmode handling
    if (isIOS) {
        var inputModeIOS = getPluginParameter("inputmode-ios");
        setInputMode(inputModeIOS === undefined ? "numeric" : inputModeIOS);
    } else if (isAndroid) {
        var inputModeAndroid = getPluginParameter("inputmode-android");
        if (inputModeAndroid !== undefined) setInputMode(inputModeAndroid);
        // else keep default from template.html ("decimal")
    } else if (isWebCollect) {
        var inputModeWebCollect = getPluginParameter("inputmode-web");
        if (inputModeWebCollect !== undefined) setInputMode(inputModeWebCollect);
        // else keep default from template.html ("decimal")
    }

    // Apply the input filter (which now also handles setAnswer)
    setInputFilter(input, function (value) {
        // Allow empty/intermediate states
        if (isEmptyDecimal(value)) {
            return true;
        }
        // Regex check for valid decimal format (already truncated in restrictInput)
        return /^-?\d*\.?\d*$/.test(value);
    });
}

// Define what happens when the user attempts to clear the response
function clearAnswer() {
    input.value = '';
    if (!fieldProperties.READONLY) {
        // Update internal state if needed
        input.oldValue = '';
        input.oldSelectionStart = 0;
        input.oldSelectionEnd = 0;
    }
    setAnswer(''); // Update the underlying answer
}

// If the field is not marked readonly, then focus on the field and show the on-screen keyboard (for mobile devices)
function setFocus() {
    if(!fieldProperties.READONLY){
        input.focus();
        if (window.showSoftKeyboard) {
            window.showSoftKeyboard();
        }
    }
}

// REMOVED redundant input.oninput handler - setAnswer is now called within setInputFilter

// If the field label or hint contain any HTML that isn't in the form definition, then the < and > characters will have been replaced by their HTML character entities, and the HTML won't render. We need to turn those HTML entities back to actual < and > characters so that the HTML renders properly. This will allow you to render HTML from field references in your field label or hint.
function unEntity(str){
    // Check if str is null or undefined before trying to replace
    if (str == null) return '';
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
if (fieldProperties.LABEL) {
    document.querySelector(".label").innerHTML = unEntity(fieldProperties.LABEL);
}
if (fieldProperties.HINT) {
    document.querySelector(".hint").innerHTML = unEntity(fieldProperties.HINT);
}

// Set the initial value from the fieldProperties and ensure it's clean
// (Value is set in template, but let's ensure filter logic state is initialized)
if (!fieldProperties.READONLY) {
    let initialValue = input.value;
    // Apply initial truncation if necessary
    if (initialValue.length > 15) {
        initialValue = initialValue.substring(0, 15);
        input.value = initialValue; // Update display
    }
    // Validate initial value
    const isValidInitial = isEmptyDecimal(initialValue) || /^-?\d*\.?\d*$/.test(initialValue);
    if (isValidInitial) {
        input.oldValue = initialValue;
        setAnswer(isEmptyDecimal(initialValue) ? "" : initialValue);
    } else {
        // Handle invalid initial value (e.g., clear it)
        input.value = "";
        input.oldValue = "";
        setAnswer("");
        console.warn("Initial field value was invalid and has been cleared.");
    }
    // Set initial cursor state for filter history
    input.oldSelectionStart = input.selectionStart;
    input.oldSelectionEnd = input.selectionEnd;
}