let comments = '';

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
        let origins = data.origins;

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


        //Display the boxes inside the outer box
        let container = document.getElementById('main-box');
        
        let boxes = Object.entries(data.objects);
        
        for(let i = 0; i < boxes.length; i++) {
            let key = boxes[i][0];
            userInput.push({[key]: ''});
            let obj = boxes[i][1];

            let width  = twipsToPixels(obj.position[2] - obj.position[0]);
            let height = twipsToPixels(obj.position[3] - obj.position[1]);
            
            let boxHTML = `
                <div id="input-box-${i}"
                    style="height: ${height}px;
                    width: ${width}px;
                    position: absolute;
                    left: ${twipsToPixels(obj.position[0])}px;
                    top: ${twipsToPixels(obj.position[1])}px;
                    ">${obj.defaultText}</div>
            `;
            
            // Append boxHTML to the container
            container.innerHTML += boxHTML;
            
            // Checks to see if the editable property is true, if so, make the box editable in the HTML
            if(obj.editable) {
                let inputBox = document.getElementById(`input-box-${i}`);
                inputBox.contentEditable = 'true';
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
        
        // Get the comments from the input boxes
        let comment71 = document.getElementById('input-box-71');
        
        comment71.addEventListener('input', () => {
            comments = comment71.innerHTML;
        });

        return comments;
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
        console.log('User Input: ', comments);
    });
});