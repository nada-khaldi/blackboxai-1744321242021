// Tutorial Data
const tutorials = {
    basics: {
        title: "Drawing Basics",
        steps: [
            {
                title: "Getting Started",
                description: "Learn how to hold your drawing tools and set up your workspace.",
                image: "https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg",
                tips: [
                    "Hold your pencil lightly for better control",
                    "Keep your workspace clean and organized",
                    "Ensure good lighting for better visibility"
                ]
            },
            {
                title: "Basic Shapes",
                description: "Master drawing fundamental shapes: circles, squares, and triangles.",
                image: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg",
                tips: [
                    "Start with light, sketchy lines",
                    "Practice drawing shapes in different sizes",
                    "Focus on proportion and symmetry"
                ]
            },
            {
                title: "Shading Techniques",
                description: "Learn different shading methods to add depth to your drawings.",
                image: "https://images.pexels.com/photos/6177607/pexels-photo-6177607.jpeg",
                tips: [
                    "Practice consistent pressure for even shading",
                    "Experiment with different pencil grades",
                    "Build up shadows gradually"
                ]
            }
        ]
    },
    portraits: {
        title: "Portrait Drawing",
        steps: [
            {
                title: "Face Proportions",
                description: "Understanding the basic proportions of the human face.",
                image: "https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg",
                tips: [
                    "Start with basic guidelines",
                    "Divide the face into thirds",
                    "Pay attention to eye spacing"
                ]
            },
            {
                title: "Eyes and Expression",
                description: "Techniques for drawing realistic eyes and capturing expressions.",
                image: "https://images.pexels.com/photos/6976943/pexels-photo-6976943.jpeg",
                tips: [
                    "Observe light reflections in the eyes",
                    "Pay attention to eyelid structure",
                    "Add subtle details for realism"
                ]
            },
            {
                title: "Hair and Texture",
                description: "Methods for drawing different hair types and textures.",
                image: "https://images.pexels.com/photos/7290715/pexels-photo-7290715.jpeg",
                tips: [
                    "Draw hair in sections, not individual strands",
                    "Focus on light and shadow patterns",
                    "Use varying line weights"
                ]
            }
        ]
    },
    landscapes: {
        title: "Landscape Drawing",
        steps: [
            {
                title: "Perspective Basics",
                description: "Understanding perspective in landscape drawing.",
                image: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg",
                tips: [
                    "Establish your horizon line",
                    "Use perspective guidelines",
                    "Consider atmospheric perspective"
                ]
            },
            {
                title: "Trees and Vegetation",
                description: "Techniques for drawing various types of trees and plants.",
                image: "https://images.pexels.com/photos/5428277/pexels-photo-5428277.jpeg",
                tips: [
                    "Start with basic shapes",
                    "Layer foliage details",
                    "Vary your mark making"
                ]
            },
            {
                title: "Water and Reflections",
                description: "Methods for drawing water and creating realistic reflections.",
                image: "https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg",
                tips: [
                    "Observe water patterns",
                    "Keep reflections simple",
                    "Use horizontal strokes"
                ]
            }
        ]
    }
};

// UI Elements
const tutorialContent = document.getElementById('tutorialContent');
const tutorialSteps = document.getElementById('tutorialSteps');
const progressBar = document.getElementById('progressBar');
const prevButton = document.getElementById('prevStep');
const nextButton = document.getElementById('nextStep');
const practiceCanvas = document.getElementById('practiceCanvas');
const clearCanvasBtn = document.getElementById('clearCanvas');
const savePracticeBtn = document.getElementById('savePractice');

// Current Tutorial State
let currentTutorial = null;
let currentStep = 0;

// Practice Canvas Setup
let ctx = practiceCanvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize Practice Canvas
function initPracticeCanvas() {
    // Set canvas size
    function resizeCanvas() {
        const container = practiceCanvas.parentElement;
        practiceCanvas.width = container.clientWidth - 32; // Adjust for padding
        practiceCanvas.height = 400; // Fixed height for practice area
    }

    // Initial resize
    resizeCanvas();

    // Resize canvas when window is resized
    window.addEventListener('resize', resizeCanvas);

    // Drawing event listeners
    practiceCanvas.addEventListener('mousedown', startDrawing);
    practiceCanvas.addEventListener('mousemove', draw);
    practiceCanvas.addEventListener('mouseup', stopDrawing);
    practiceCanvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    practiceCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startDrawing(touch);
    });
    practiceCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        draw(touch);
    });
    practiceCanvas.addEventListener('touchend', stopDrawing);
}

// Drawing Functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getMousePos(e);
}

function draw(e) {
    if (!isDrawing) return;

    const [x, y] = getMousePos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
}

function getMousePos(e) {
    const rect = practiceCanvas.getBoundingClientRect();
    return [
        (e.clientX - rect.left) * (practiceCanvas.width / rect.width),
        (e.clientY - rect.top) * (practiceCanvas.height / rect.height)
    ];
}

// Tutorial Functions
function showTutorial(tutorialId) {
    currentTutorial = tutorialId;
    currentStep = 0;
    tutorialContent.classList.remove('hidden');
    updateTutorialContent();
    scrollTo(tutorialContent);
}

function updateTutorialContent() {
    const tutorial = tutorials[currentTutorial];
    const step = tutorial.steps[currentStep];
    const progress = ((currentStep + 1) / tutorial.steps.length) * 100;

    // Update progress bar
    progressBar.style.width = `${progress}%`;

    // Update tutorial content
    tutorialSteps.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden tutorial-step">
            <img src="${step.image}" alt="${step.title}" class="w-full h-64 object-cover">
            <div class="p-6">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">${step.title}</h3>
                <p class="text-gray-600 mb-6">${step.description}</p>
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-900 mb-2">Pro Tips:</h4>
                    <ul class="list-disc list-inside text-blue-800 space-y-2">
                        ${step.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    // Update navigation buttons
    prevButton.disabled = currentStep === 0;
    nextButton.disabled = currentStep === tutorial.steps.length - 1;
}

function nextStep() {
    if (currentStep < tutorials[currentTutorial].steps.length - 1) {
        currentStep++;
        updateTutorialContent();
        scrollTo(tutorialContent);
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        updateTutorialContent();
        scrollTo(tutorialContent);
    }
}

function scrollTo(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Practice Canvas Actions
function clearCanvas() {
    if (confirm('Are you sure you want to clear your practice drawing?')) {
        ctx.clearRect(0, 0, practiceCanvas.width, practiceCanvas.height);
    }
}

function savePractice() {
    const link = document.createElement('a');
    link.download = 'my-practice-drawing.png';
    link.href = practiceCanvas.toDataURL();
    link.click();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize practice canvas
    initPracticeCanvas();

    // Navigation buttons
    prevButton.addEventListener('click', prevStep);
    nextButton.addEventListener('click', nextStep);

    // Practice canvas buttons
    clearCanvasBtn.addEventListener('click', clearCanvas);
    savePracticeBtn.addEventListener('click', savePractice);
});
