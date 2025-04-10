// Canvas Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Drawing History for Undo/Redo
const history = [];
let historyIndex = -1;
const maxHistory = 20;

// Current Drawing Settings
let currentTool = 'pencil';
let currentColor = '#000000';
let currentSize = 5;

// Tool Buttons
const toolButtons = document.querySelectorAll('.tool-btn');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const clearBtn = document.getElementById('clear');
const saveBtn = document.getElementById('save');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');

// Initialize Canvas
function initCanvas() {
    // Set canvas size to match container size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth - 32; // Adjust for padding
        canvas.height = window.innerHeight * 0.7; // 70% of viewport height
        
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
    switch(currentTool) {
        case 'pencil':
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = currentSize;
            ctx.strokeStyle = currentColor;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            break;
        case 'brush':
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = currentSize * 2;
            ctx.strokeStyle = currentColor;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            break;
        case 'marker':
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = currentSize * 1.5;
            ctx.strokeStyle = `${currentColor}80`; // Add transparency
            ctx.lineCap = 'square';
            ctx.lineJoin = 'miter';
            break;
        case 'eraser':
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = currentSize * 2;
            ctx.strokeStyle = '#000000';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            break;
    }

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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [x, y];
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
    
    // Update undo/redo buttons
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
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
            // Remove active class from all buttons
            toolButtons.forEach(b => b.classList.remove('tool-active'));
            // Add active class to clicked button
            btn.classList.add('tool-active');
            // Set current tool
            currentTool = btn.id;
        });
    });

    // Color picker
    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
    });

    // Brush size
    brushSize.addEventListener('input', (e) => {
        currentSize = parseInt(e.target.value);
        brushSizeValue.textContent = `${currentSize}px`;
    });

    // Undo/Redo
    undoBtn.addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            ctx.putImageData(history[historyIndex], 0, 0);
            updateUndoRedoButtons();
        }
    });

    redoBtn.addEventListener('click', () => {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            ctx.putImageData(history[historyIndex], 0, 0);
            updateUndoRedoButtons();
        }
    });

    // Clear canvas
    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the canvas?')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveState();
        }
    });

    // Save drawing
    saveBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// Initialize everything
function init() {
    try {
        initCanvas();
        initEventListeners();
        saveState(); // Save initial blank state
    } catch (error) {
        console.error('Error initializing drawing app:', error);
        alert('There was an error initializing the drawing app. Please check if your browser supports HTML5 Canvas.');
    }
}

// Start the application
init();
