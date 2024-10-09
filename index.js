let userInput = [];

fetch("phone.json")
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Parse the JSON file
        return response.json();
    })
    .then(data => {

        // Origins - The top left corner of the outer box
        let origins = data.origins;
        userInput.push(data);
        
        // Display the outer box
        let outerContainer = document.getElementById('outer-box');
        outerContainer.style.position = 'absolute';
        outerContainer.style.left = twipsToPixels(origins[0][0]) + 'px';
        outerContainer.style.top = twipsToPixels(origins[0][1]) + 'px';

        let outerContainerWidth = twipsToPixels(data.width);
        let outerContainerHeight = twipsToPixels(data.height);
        outerContainer.style.width = outerContainerWidth + 'px';
        outerContainer.style.height = outerContainerHeight + 'px';
        outerContainer.style.backgroundColor = 'lightgray';


        // Display the boxes inside the outer box
        let container = document.getElementById('main-box');
        
        // let boxes = Object.entries(data.objects);
        let boxes = Object.entries(userInput[0].objects);  // JSON data for each box.  Each "entry" is an array with two elements. 0 = "key", 1 = object with the attributes of each box
        
        for(let i = 0; i < boxes.length; i++) {
            let key = boxes[i][0];
            let obj = boxes[i][1];  // The object with the attributes of each box.  The second element of the boxes array for each box
            
            let width  = twipsToPixels(obj.position[2] - obj.position[0]);
            let height = twipsToPixels(obj.position[3] - obj.position[1]);
            
            if(obj.kind === "dottedLine") {
                boxHTML = `
                    <div id="input-box-${i}"
                        style="height: ${height}px;
                        width: ${width}px;
                        position: absolute;
                        left: ${twipsToPixels(obj.position[0])}px;
                        top: ${twipsToPixels(obj.position[1])}px;
                        border: 1px dotted ${obj.color};
                        ">
                    </div>
                `;
            }
            else {
                boxHTML = `
                    <div id="input-box-${i}"
                        style="height: ${height}px;
                        width: ${width}px;
                        position: absolute;
                        left: ${twipsToPixels(obj.position[0])}px;
                        top: ${twipsToPixels(obj.position[1])}px;
                        ">
                        ${obj.defaultText}
                    </div>
                `;
            }
            
            // Append boxHTML to the container
            container.innerHTML += boxHTML;
            
            // Checks to see if the editable property is true, if so, make the box editable in the HTML
            if(obj.editable) {
                let inputBox = document.getElementById(`input-box-${i}`);
                console.log(inputBox);
                inputBox.contentEditable = 'true'; // Make the box editable
                inputBox.style.backgroundColor = obj.color;
                inputBox.style.color = "black";
            }
            else if(!obj.editable && obj.kind === "staticText") {
                let inputBox = document.getElementById(`input-box-${i}`);
                inputBox.style.color = obj.color;
            }
            else if(!obj.editable && obj.kind === "rectangle") {
                let inputBox = document.getElementById(`input-box-${i}`);
                inputBox.style.backgroundColor = obj.color;
            }
        }
        
    })
    .catch(error => {
        console.error('ERROR: ', error);
    });

// Convert Twips to Pixels
const twipsToPixels = num => {
    let numTwips = num / 1440 // 1440 twips per inch
    let twipsToPixels = numTwips * 96; // 96 pixels per inch
    return twipsToPixels;
}

// When the DOM is loaded, listen for when the user submits the form
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');

    const form = document.getElementById('form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let editableBoxes = Object.entries(userInput[0].objects);
        for(let i = 0; i < editableBoxes.length; i++) {
            let key = editableBoxes[i][0];
            let obj = editableBoxes[i][1];

            if(obj.editable) {
                let userInputBox = document.getElementById(`input-box-${i}`);
                obj.userComment = userInputBox.innerHTML;
            }
        }
        
    });
});