let specialValue = null;
let pointsReceived = 0;
let chosenValue = "";

/* Handles the clicks done on SpecialButton and NumberedButton */
const ScoreButtonClickHandler = (pressedButton, buttonIsSpecial = false) => {
    if (buttonIsSpecial) {
        specialValue = getFirstCharacterFromSpecialButton(pressedButton);
    } else {
        const numberedValue = getNumberedButtonValue(pressedButton);
        if (specialValue != null) {
            chosenValue = combineSpecialButtonAndNumberedButton(specialValue, numberedValue);
            console.log(chosenValue);

            pointsReceived = multiplyNumberedButtonValueBasedOnClickedSpecialButton(specialValue, numberedValue);
            console.log(`points => ${pointsReceived}\n`);

            specialValue = null;
        } else {
            chosenValue = numberedValue;
            console.log(chosenValue);
        }
    }
}
export default ScoreButtonClickHandler;

// Note: Does not handle OUT or UNDO (yet)
/* Gets the first character from the special button. */
const getFirstCharacterFromSpecialButton = (specialButton) => {
    return specialButton.charAt(0).toUpperCase();
}

/* Gets the displayed value from the numbered button. */
const getNumberedButtonValue = (numberedButtonID) => {
    return numberedButtonID + 1;
}

/* Combines the special value and numbered button value.
* This could be used in the UI to display a completed action.
*/
const combineSpecialButtonAndNumberedButton = (specialValue, numberedValue) => {
    return `${specialValue}${numberedValue}`;
}

/* Multiplies the numbered value according to what special button was pressed first. */
const multiplyNumberedButtonValueBasedOnClickedSpecialButton = (specialValue, numberedValue) => {
    switch (specialValue) {
        case 'D':
            return numberedValue * 2;
        case 'T':
            return numberedValue * 3;
        default:
            throw new Error(`Something went wrong with multiplication. Received special value => ${numberedValue}`);
    }
}