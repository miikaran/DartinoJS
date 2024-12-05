let specialValue = null;
let chosenValue = "";

/* Handles the clicks done on SpecialButton and NumberedButton */
export default function ScoreButtonClickHandler(pressedButton, buttonIsSpecial = false) {
    if (buttonIsSpecial) {
        handleSpecialButton(pressedButton);
        return;
    }

    const numberedValue = getNumberedButtonValue(pressedButton);
    if (specialValue) {
        handleCombinedValue(specialValue, numberedValue);
    } else {
        chosenValue = numberedValue;
        console.log(chosenValue);
    }
}

/* Handles a special button click by storing its first character */
function handleSpecialButton(button) {
    specialValue = button.charAt(0).toUpperCase();
}

/* Handles combining special and numbered button values and logs points */
function handleCombinedValue(special, numbered) {
    chosenValue = `${special}${numbered}`;
    console.log(chosenValue);

    const pointsReceived = calculatePoints(special, numbered);
    console.log(`points => ${pointsReceived}\n`);

    specialValue = null;
}

/* Gets the displayed value from the numbered button. */
function getNumberedButtonValue(numberedButtonID) {
    return numberedButtonID + 1;
}

/* Multiplies the numbered value according to what special button was pressed first. */
function calculatePoints(special, numbered) {
    switch (special) {
        case 'D':
            return numbered * 2;
        case 'T':
            return numbered * 3;
        default:
            throw new Error(`Something went wrong with multiplication. Received special value => ${numbered}`);
    }
}

// Note: Does not handle OUT or UNDO (yet)