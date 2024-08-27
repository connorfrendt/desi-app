fetch("phone.json")
        .then(response => {
            if(!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Parse the JSON file
            return response.json();
        })
        .then(data => {
            console.log('origin: ', data.origins)
            let origins = data.origins;
            //Display the main box
            let container = document.getElementById('main-box');
            Object.entries(data.objects).forEach(([key, obj]) => {
                let width = twipsToPixels(obj.position[2] - obj.position[0]);
                let height = twipsToPixels(obj.position[3] - obj.position[1]);
                // console.log('Key: ', key);
                // console.log('Object: ', obj);
                console.log(
                    'width: ',    width,
                    '\nheight: ', height
                );
                
                // console.log(twipsToPixels(origin[0][0] + obj.position[0]))
                let boxHTML = `
                    <div class="input"
                        style="height: ${height}px;
                        width: ${width}px;
                        background-color: ${obj.color};
                        position: absolute;
                        left: ${twipsToPixels(origins[0][0] + obj.position[0])}px;
                        top: ${twipsToPixels(origins[0][1] + obj.position[1])}px;
                        "></div>
                `;
                 container.innerHTML += boxHTML;
            });

        })
        .catch(error => {
            console.error('ERROR: ', error);
        });

    const twipsToPixels = num => {
        let numTwips = num / 1440 // 1440 twips per inch
        let twipsToPixels = numTwips * 96; // 96 pixels per inch
        return twipsToPixels;
    }

    let comments = '';
    let commentText = document.getElementById('comments-box');

    commentText.addEventListener('input', function(event) {
        comments = event.target.value;
        console.log(comments);
    });