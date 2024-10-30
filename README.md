![image](https://github.com/user-attachments/assets/decaf165-239d-4f3d-9342-870d6c6df80b)

modell.html
[ <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Page - AI Model</title>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        /* General Page Styling */
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background-image: url('image7.png'); /* Background image */
            background-size: cover;
            background-position: center;
            color: #f4f4f9; /* Light font color for readability */
        }

        /* Semi-transparent background overlay for content */
        #content-wrapper {
            background-color: rgba(0, 0, 0, 0.6); /* Dark overlay */
            padding: 40px;
            border-radius: 10px;
            margin: 20px auto;
            max-width: 800px;
            color: #f4f4f9;
        }

        /* Typography Styling */
        h1, h2 {
            color: #e0ffda; /* Light green for headings */
            text-align: center;
        }

        /* Header and Navigation Styling */
        header {
            background-color: rgba(46, 139, 87, 0.8); /* Slightly transparent dark green */
            color: white;
            padding: 15px;
            text-align: center;
        }

        .header-logo {
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 10px;
        }

        nav {
            display: flex;
            justify-content: center;
            gap: 20px;
            font-weight: 600;
        }

        nav a {
            color: white;
            text-decoration: none;
            font-size: 1.1rem;
        }

        nav .active a {
            border-bottom: 2px solid #f4f4f9;
        }

        /* Form and Button Styling */
        #label-container, #webcam-container {
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: rgba(255, 255, 255, 0.1); /* Light overlay for content boxes */
            padding: 15px;
            margin-top: 20px;
            text-align: center;
        }

        input[type="file"] {
            margin-top: 10px;
            background-color: #e0ffda;
            color: #333;
            padding: 8px;
            border-radius: 5px;
        }

        button {
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-weight: 600;
            font-size: 1rem;
        }

        button:hover {
            background-color: #357ab8;
        }

        #output {
            margin-top: 10px;
            max-width: 224px;
            display: block;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        /* Enhanced output message styling */
        .output-message {
            border: none; /* Remove border */
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            font-family: Arial, sans-serif; /* Font */
            font-weight: bold; /* Bold text */
            color: #fff; /* Change text color to white for contrast */
            background-color: rgba(0, 0, 0, 0.7); /* Solid background color for better visibility */
            transition: transform 0.2s; /* Add transition for hover effect */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow for depth */
        }

        .plastic {
            border-color: #ff5722; /* Orange for plastic */
        }

        .paper {
            border-color: #2196F3; /* Blue for paper */
        }

        .cardboard {
            border-color: #ff9800; /* Amber for cardboard */
        }

        .mixed {
            border-color: #9C27B0; /* Purple for mixed */
        }

        .unknown {
            border-color: #f44336; /* Red for unknown */
        }

        .low-confidence {
            border-color: #FFC107; /* Yellow for low confidence */
        }

    </style>
</head>
<body>
    <!-- Header with Navigation Bar -->
    <header>
        <div class="header-logo">Vironai</div>
        <nav>
            <div class="nav-items"><a href="..\home\index.html">Home</a></div>
            <div class="nav-items"><a href="..\home\about.html">About</a></div>
            <div class="nav-items"><a href="modell.html">Services</a></div>
            <div class="nav-items active"><a href="..\home\project.html">Projects</a></div> <!-- Link to this page -->
            <div class="nav-items"><a href="contact.html">Contact</a></div>
        </nav>
    </header>

    <!-- Content Wrapper for Styling and Background Overlay -->
    <div id="content-wrapper">
        <h1>AI Trash Recognition</h1>

        <h2>Upload Image for Prediction</h2>
        <input type="file" id="fileInput" accept="image/*">
        <button id="uploadButton" type="button">Upload and Predict</button>
        <canvas id="canvas" width="224" height="224" style="display: none;"></canvas>
        <img id="output" alt="Resized Image" style="display: none;">

        <h2>Webcam Prediction</h2>
        <button type="button" onclick="startWebcam()">Start Webcam</button>
        <button type="button" onclick="stopWebcam()">Stop Webcam</button>
        <div id="webcam-container"></div>
        
        <h2>Predictions</h2>
        <div id="label-container"></div>
    </div>

    <script src="modell.js"></script>
</body>
</html>
]

modell.js
[// Classifier Variable 
let model, webcam, labelContainer, maxPredictions;
let webcamRunning = false; // Track if the webcam is active

// Model URL
const URL = "./my_model/";

// Load the model first
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup label container for displaying predictions
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

// Toggle the webcam on
async function startWebcam() {
    if (!webcamRunning) {
        const flip = true; // Flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // Request access to the webcam
        await webcam.play();
        webcamRunning = true;

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        window.requestAnimationFrame(loop);
    }
}

// Toggle the webcam off
function stopWebcam() {
    if (webcam && webcamRunning) {
        webcam.stop();
        document.getElementById("webcam-container").innerHTML = ""; // Clear webcam container
        webcamRunning = false;
    }
}

// Webcam prediction loop
async function loop() {
    if (webcamRunning) {
        webcam.update(); // Update the webcam frame
        await predictWebcam();
        window.requestAnimationFrame(loop);
    }
}

// Predict using webcam feed
async function predictWebcam() {
    if (webcamRunning) {
        const prediction = await model.predict(webcam.canvas);
        displayPredictions(prediction);
    }
}

// Handle image upload and prediction
document.getElementById('uploadButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert("Please select an image file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.src = e.target.result;
        
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            
            // Resize the image to 224x224
            ctx.drawImage(img, 0, 0, 224, 224);
            
            // Display resized image (for reference)
            const output = document.getElementById('output');
            output.src = canvas.toDataURL();
            output.style.display = 'block';

            // Make prediction on the uploaded image
            predictImage(canvas);
        };
    };
    reader.readAsDataURL(file);
});

// Predict using uploaded image
async function predictImage(canvas) {
    const prediction = await model.predict(canvas);
    displayPredictions(prediction);
}

// Display predictions in the label container
function displayPredictions(predictions) {
    // Clear previous predictions
    labelContainer.innerHTML = '';

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = predictions[i].className + ": " + predictions[i].probability.toFixed(2);
        labelContainer.appendChild(document.createElement("div")).innerHTML = classPrediction;
    }

    // Handle specific outputs
    let outputMessage = '';
    const highestPrediction = predictions.reduce((max, prediction) => prediction.probability > max.probability ? prediction : max, {probability: 0});

    // Check confidence level
    if (highestPrediction.probability > 0.51) {
        switch (highestPrediction.className) {
            case 'plastic':
                outputMessage = `
                    <div style="font-weight: bold; color: #0056b3;">
                        The disposal of plastic is a critical environmental issue, as plastics take hundreds of years to decompose and often release harmful chemicals. Proper disposal involves recycling to reduce landfill waste, and where possible, reusing or repurposing plastic items. Alternatives to disposal, like biodegradable plastics, are being explored to reduce environmental impact. However, effective plastic waste management requires collaboration between individuals, industries, and governments to prevent pollution and protect ecosystems.
                    </div>
                    <div style="font-weight: bold; color: #0056b3;">Here are some YouTube links for creativity on plastic:</div>
                    <ul>
                        <li><a href="https://www.youtube.com/shorts/uYYZTMjE9pA" target="_blank">Creative Use of Plastic - Video 1</a></li>
                        <li><a href="https://www.youtube.com/shorts/0iwgpPRlfrI" target="_blank">Creative Use of Plastic - Video 2</a></li>
                    </ul>
                `;
                break;
            case 'Paper':
                outputMessage = `
                    <div style="font-weight: bold; color: #0056b3;">
                        This is paper. Proper disposal includes recycling it, as it can be easily processed. How to Dispose of Paper
                        Check Local Recycling Guidelines:

                      Before disposing of paper, check your local recycling rules, as guidelines may vary by location.
                      Separate Paper from Other Waste:

                      Ensure that paper is separated from other types of waste. This helps recycling facilities process it more efficiently.
                      Prepare Paper for Recycling:

                      Flatten: If you have cardboard boxes, flatten them to save space and make recycling easier.
                      Remove Non-Paper Components: Take off any non-paper materials, such as plastic windows in envelopes or metal fasteners.
                      Avoid Contaminated Paper:

                      Do not recycle paper that is contaminated with food (e.g., pizza boxes) or other substances, as it can disrupt the recycling process.
                      Use Curbside Recycling:

                      Place clean, dry paper in your curbside recycling bin if available. Make sure to follow any specific guidelines provided by your local waste management authority.
                      Take to a Recycling Center:

                      If curbside recycling is not an option, you can take paper to a local recycling center. Check their accepted materials before going.
                      Consider Composting:

                      If you have paper products that are uncoated, like newspaper or plain paper, you can compost them. Shred the paper to help it break down more quickly. If you're looking for creative ways to deal with paper, consider recycling or repurposing it. 
                    </div>
                    <div style="font-weight: bold; color: #0056b3;">Here is a YouTube link for creativity on paper:</div>
                    <ul>
                        <li><a href="https://www.youtube.com/watch?v=GFsNnAurVLA&list=PLKEme8ErY6VwCsLV0F72-jQ1l0G_KesaF" target="_blank">Creative Ways to Use Paper</a></li>
                    </ul>
                `;
                break;
            case 'cardboard':
                outputMessage=`<strong>The trash is cardboard.</strong>
                    <p>Cardboard is recyclable. Make sure to flatten the boxes and remove any non-cardboard components before disposal.</p>
                    <p>For creative ideas on how to deal with cardboard, check out these videos:</p>
                    <ul>
                        <li><a href="https://youtu.be/j9GcS_Ov1v4?si=FurIBls5yLIUOr8-" target="_blank">Cardboard Disposal Tips - Video 1</a></li>
                        <li><a href="https://youtu.be/H9Cy6aA5JNw?si=olhfifk9HIrTzFm_" target="_blank">Cardboard Disposal Tips - Video 2</a></li>
                    </ul>`;    
            case 'plastic with other components':
                outputMessage = `
                    <div style="font-weight: bold; color: #0056b3;">
                        Items classified as "plastic with other components" require careful disposal. Here’s how to manage them:
                    </div>
                    <ul>
                        <li><strong>Sort and Separate:</strong> If possible, separate the plastic from other materials.</li>
                        <li><strong>Rinse and Clean:</strong> Rinse out any food or liquid residues.</li>
                        <li><strong>Check Local Recycling Guidelines:</strong> Look up local regulations for recycling these items.</li>
                        <li><strong>Contact Local Recycling Centers:</strong> If too contaminated, see if they accept them separately.</li>
                        <li><strong>Repurpose or Upcycle:</strong> Consider creative ways to repurpose them.</li>
                        <li><strong>Reduce and Avoid:</strong> Try to avoid products that combine materials.</li>
                        <li><strong>Educate on Proper Disposal:</strong> Share knowledge on handling complex waste items.</li>
                        <li><strong>Explore Biodegradable Options:</strong> Look for alternatives that won’t contribute to plastic waste.</li>
                    </ul>
                `;
                break;
            default:
                outputMessage = 'Unrecognized category. Please check the item.';
                break;
        }
    } else {
        outputMessage = 'The model is not confident about the prediction. Please try again with a clearer image.';
    }

    // Display the output message
    document.getElementById('label-container').innerHTML += `<div>${outputMessage}</div>`;
}

// Initialize model
init();
]

this contains metadata.json and model.json
