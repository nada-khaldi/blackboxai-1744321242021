// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Drawing History for Undo
const history = [];
let historyIndex = -1;
const maxHistory = 20;

// Current Drawing Settings
let currentTool = 'pencil';
let currentSize = 5;

// UI Elements
const toolButtons = document.querySelectorAll('.tool-btn');
const undoBtn = document.getElementById('undo');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const brushSize = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');
const aiCorrectBtn = document.getElementById('aiCorrect');
const aiSuggestBtn = document.getElementById('aiSuggest');
const aiFeedback = document.getElementById('aiFeedback');
const feedbackContent = document.getElementById('feedbackContent');
const closeFeedback = document.getElementById('closeFeedback');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize Canvas
function initCanvas() {
    // Set canvas size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth - 32; // Adjust for padding
        canvas.height = window.innerHeight * 0.6; // 60% of viewport height

        // Restore drawing after resize
        if (history.length > 0 && historyIndex >= 0) {
            ctx.putImageData(history[historyIndex], 0, 0);
        }
    }

    // Initial resize
    resizeCanvas();

    // Resize canvas when window is resized
    window.addEventListener('resize', resizeCanvas);
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
    
    // Set drawing style based on current tool
    if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#000000';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = '#000000';
    }
    
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        saveState();
    }
}

// Helper Functions
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return [
        (e.clientX - rect.left) * (canvas.width / rect.width),
        (e.clientY - rect.top) * (canvas.height / rect.height)
    ];
}

function saveState() {
    // Remove any redo states
    history.splice(historyIndex + 1);
    
    // Add current state to history
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    
    // Remove oldest state if exceeding maxHistory
    if (history.length > maxHistory) {
        history.shift();
    }
    
    historyIndex = history.length - 1;
    
    // Update undo button
    undoBtn.disabled = historyIndex <= 0;
}

// AI Functions
function simulateAICorrection() {
    showLoading();

    // Simulate AI processing time
    setTimeout(() => {
        // Save current drawing
        const originalDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Simulate AI improvements
        ctx.filter = 'blur(1px)'; // Smooth lines
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';

        // Add to history
        saveState();

        hideLoading();
        showFeedback([
            {
                type: 'success',
                message: 'Drawing improved successfully!',
                details: [
                    'Lines smoothed for better flow',
                    'Proportions adjusted for balance',
                    'Perspective alignment enhanced'
                ]
            }
        ]);
    }, 2000);
}

function simulateAISuggestions() {
    showLoading();

    // Simulate AI analysis time
    setTimeout(() => {
        const suggestions = [
            {
                type: 'tip',
                message: 'Line Quality',
                details: [
                    'Try using varying line weights for depth',
                    'Focus on smooth, confident strokes',
                    'Consider adding more detail in focal areas'
                ]
            },
            {
                type: 'improvement',
                message: 'Composition',
                details: [
                    'Adjust the balance of elements',
                    'Consider the rule of thirds',
                    'Add more contrast between elements'
                ]
            }
        ];

        hideLoading();
        showFeedback(suggestions);
    }, 1500);
}

// UI Functions
function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showFeedback(feedback) {
    aiFeedback.classList.remove('hidden');
    feedbackContent.innerHTML = feedback.map(item => `
        <div class="bg-${item.type === 'success' ? 'green' : 'blue'}-50 p-4 rounded-lg">
            <h4 class="font-semibold text-${item.type === 'success' ? 'green' : 'blue'}-900 mb-2">
                ${item.message}
            </h4>
            <ul class="list-disc list-inside text-${item.type === 'success' ? 'green' : 'blue'}-800 space-y-1">
                ${item.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

// Event Listeners
function initEventListeners() {
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e.touches[0]);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e.touches[0]);
    });
    canvas.addEventListener('touchend', stopDrawing);

    // Tool selection
    toolButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toolButtons.forEach(b => b.classList.remove('tool-active'));
            btn.classList.add('tool-active');
            currentTool = btn.id;
        });
    });

    // Brush size
    brushSize.addEventListener('input', (e) => {
        currentSize = parseInt(e.target.value);
        brushSizeValue.textContent = `${currentSize}px`;
    });

    // Undo
    undoBtn.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            ctx.putImageData(history[historyIndex], 0, 0);
            undoBtn.disabled = historyIndex <= 0;
        }
    });

    // Clear canvas
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your drawing?')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveState();
        }
    });

    // Save drawing
    saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'ai-improved-drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // AI buttons
    aiCorrectBtn.addEventListener('click', simulateAICorrection);
    aiSuggestBtn.addEventListener('click', simulateAISuggestions);

    // Close feedback
    closeFeedback.addEventListener('click', () => {
        aiFeedback.classList.add('hidden');
    });
}

// Initialize everything
function init() {
    try {
        initCanvas();
        initEventListeners();
        saveState(); // Save initial blank state
    } catch (error) {
        console.error('Error initializing AI drawing assistant:', error);
        alert('There was an error initializing the AI drawing assistant. Please refresh the page and try again.');
    }
}

// Start the application
init();
