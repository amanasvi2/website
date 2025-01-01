function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}
'use strict';

// Constants for circle properties
const circleCount = 150;
const circlePropCount = 8;
const circlePropsLength = circleCount * circlePropCount;
const baseSpeed = 0.05;
const rangeSpeed = 0.3;
const baseTTL = 150;
const rangeTTL = 200;
const baseRadius = 100;
const rangeRadius = 200;
const rangeHue = 60;
const xOff = 0.0015;
const yOff = 0.0015;
const zOff = 0.0015;
const backgroundColor = 'hsla(220, 10%, 15%, 1)';  // Dark grayish-blue background

// Variables for canvas and circles
let container;
let canvas;
let ctx;
let circleProps;
let simplex;
let baseHue;

// Function to initialize the setup
function setup() {
  createCanvas();
  resize();
  initCircles();
  draw();
}
 
  // Make sure this is being called after the page is loaded
  window.addEventListener('load', setup);
  window.addEventListener('resize', resize);
  

  function initCircles() {
    circleProps = new Float32Array(circlePropsLength);  // Create array for circle properties
    simplex = new SimplexNoise();  // Noise function for randomization
    baseHue = 220;
  
    for (let i = 0; i < circlePropsLength; i += circlePropCount) {
      initCircle(i);
    }
  }
  
  function initCircle(i) {
    let x = rand(canvas.a.width);
    let y = rand(canvas.a.height);
    let n = simplex.noise3D(x * xOff, y * yOff, baseHue * zOff);
    let t = rand(TAU);
    let speed = baseSpeed + rand(rangeSpeed);
    let vx = speed * Math.cos(t);
    let vy = speed * Math.sin(t);
    let life = 0;
    let ttl = baseTTL + rand(rangeTTL);
    let radius = baseRadius + rand(rangeRadius);
    let hue = baseHue + n * rangeHue;
  
    // Store the circle properties in the array
    circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
    
    // Log the circle properties to check
    console.log(circleProps);
  }
  

// Function to update the properties of all circles
function updateCircles() {
  baseHue++;

  for (let i = 0; i < circlePropsLength; i += circlePropCount) {
    updateCircle(i);
  }
}

// Function to update an individual circle
function updateCircle(i) {
  let i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i, i6 = 5 + i, i7 = 6 + i, i8 = 7 + i;
  let x, y, vx, vy, life, ttl, radius, hue;

  x = circleProps[i];
  y = circleProps[i2];
  vx = circleProps[i3];
  vy = circleProps[i4];
  life = circleProps[i5];
  ttl = circleProps[i6];
  radius = circleProps[i7];
  hue = circleProps[i8];

  drawCircle(x, y, life, ttl, radius, hue);

  life++;

  circleProps[i] = x + vx;
  circleProps[i2] = y + vy;
  circleProps[i5] = life;

  (checkBounds(x, y, radius) || life > ttl) && initCircle(i);
}

// Function to draw a circle
function drawCircle(x, y, life, ttl, radius, hue) {
    ctx.a.save();
    // Change the fillStyle to make the circles stand out better
    ctx.a.fillStyle = `hsla(${hue}, 60%, 50%, ${fadeInOut(life, ttl)})`; // Use light hues with reduced opacity
    ctx.a.beginPath();
    ctx.a.arc(x, y, radius, 0, TAU);
    ctx.a.fill();
    ctx.a.closePath();
    ctx.a.restore();
  }
  

// Function to check if the circle is out of bounds
function checkBounds(x, y, radius) {
  return (
    x < -radius ||
    x > canvas.a.width + radius ||
    y < -radius ||
    y > canvas.a.height + radius
  );
}

// Function to create the canvas
function createCanvas() {
  container = document.querySelector('.content--canvas');
  canvas = {
    a: document.createElement('canvas'),
    b: document.createElement('canvas')
  };
  canvas.b.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  `;
  container.appendChild(canvas.b);
  ctx = {
    a: canvas.a.getContext('2d'),
    b: canvas.b.getContext('2d')
  };
  resize();
}

// Function to resize canvas on window resize
function resize() {
  const { innerWidth, innerHeight } = window;
  canvas.a.width = innerWidth;
  canvas.a.height = innerHeight;

  ctx.a.drawImage(canvas.b, 0, 0);

  canvas.b.width = innerWidth;
  canvas.b.height = innerHeight;

  ctx.b.drawImage(canvas.a, 0, 0);
}

// Function to apply a blur effect
function render() {
  ctx.b.save();
  ctx.b.filter = 'blur(50px)';
  ctx.b.drawImage(canvas.a, 0, 0);
  ctx.b.restore();
}

function draw() {
    ctx.a.clearRect(0, 0, canvas.a.width, canvas.a.height);  // Clear previous frame
    ctx.a.fillStyle = backgroundColor;  // Apply the background color to the main canvas
    ctx.a.fillRect(0, 0, canvas.a.width, canvas.a.height);  // Fill the background of canvas.a
  
    updateCircles();
    render(); // Apply blur effect on the canvas
  
    window.requestAnimationFrame(draw);  // Request next frame
  }
  

// Event listeners for loading and resizing
window.addEventListener('load', setup);
window.addEventListener('resize', resize);

// Helper functions that were missing from the original code
const TAU = Math.PI * 2; // Full circle in radians
function rand(max) {
  return Math.random() * max;
}

function fadeInOut(life, ttl) {
  return Math.max(0, Math.min(1, (ttl - life) / ttl));
}
