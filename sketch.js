// bring in the Hugging Face library's Inference function
import { HfInference } from "https://cdn.jsdelivr.net/npm/@huggingface/inference@2.7.0/+esm";

// CONNECT TO HF API
// replace the HF_TOKEN value with your own
const HF_TOKEN = "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";
const inference = new HfInference(HF_TOKEN);

//animated text sketch
let inputOne = [
  "fork it",
  "race like a mercedes-benz",
  "say queen in chinese",
  "am going to touch you",
  "comfort",
  "drive",
  "cruise",
  "wait",
  "contaminate your water supply",
  "uaAUG",
  "brainrot",
  "never skip russian videos",
  "watch moana 2",
  "grab beaver",
  "race in a mercedes-benz clr gtr",
  "make foodiechina88 recipes",
  "hang out with my chickens",
  "quit my job",
  "hug krystal from star fox",
];

let inputTwo = [
  "ai mark zuckerberg",
  "making foodiechina88 recipes",
  "watched",
  "surveilled",
  "sonichu",
  "the sydney metro",
  "mercedes-benz clr gtr",
  "abridged innocence",
  "mythical reel pull",
  "5-in-1 dove shampoo",
  "luxury redefined",
  "r-form",
  "la jambon",
  "meaty mike",
  "honey tearing mask",
  "BÂLKÂN DWÂRF",
  "brainheal",
  "funky burger",
  "the big bad wolf",
  "just a white gal",
  "what pure love looks like",
  "authentic italian pizza recipe",
  "me lol",
];

let inputThree = [
  "ancient egyptian chant",
  "get in a whiskey bath",
  "scroll",
  "click im interested",
  "dont laught",
  "found this on your fyp",
  "empty my pockets",
  "pick at my skin",
  "found The Reel",
  "uplift",
  "scan into gyms using a REAL fish",
  "get a free lobotomy",
  "go to feier restaurant",
  "give my bird body dysmorphia",
  "own a mercedes-benz",
  "get overwhelmed with polynesian culture",
  "comment three times",
];

let inputFour = [
  "activate my chakras",
  "love myself",
  "make my algorithm brick by brick",
  "become a symbol of luxury on wheels",
  "be interested",
  "be nourished",
  "not lose",
  "be cursed with 200,000 bad meals",
  "never be desireable",
  "blanked by thick cloud",
  "transform into a mercedes-benz clr gtr",
  "be real",
  "not see that coming",
  "fw this heavy",
  "drive a mercedes-benz clr gtr",
  "race in a mercedes-benz clr gtr",
  "develop hypergamous attraction disorder",
];

let frameCountOne = 0;
let frameCountTwo = 0;
let frameCountThree = 0;
let frameCountFour = 0;

// Arrays for generating random prompts
const adjectives = [
  "humorous",
  "mysterious",
  "saturated",
  "cute",
  "lisa frank",
  "snapchat filter",
  "enchanted",
  "strange",
  "dreamlike",
  "flying",
  "swimming",
  "random",
  "relaistic",
  "sassy",
  "random",
  "real",
];
const nouns = [
  "cute adorable AI cat",
  "potato",
  "two blue staring eyes into the galaxy",
  "phinease and ferb",
  "emo bird",
  "among us",
  "nightmare fuel alien",
  "Sonic the Hedgehog",
  "grandma",
  "3d rendered human",
  "minion",
  "aniceint temple",
  "smurf",
  "tinkerbell",
  "brisk ice tea",
  "saxaphone"
];

const styles = [
  "photo",
  "photorealistic render",
  "digital video",
  "hyper-realistic photo",
];

// New arrays for random text generation
const randomVerbs = [
  "dance",
  "talk",
  "stare at the moon",
  "happy",
  "cry",
  "dreams",
  "kiki",
  "transform",
  "chant",
  "heal",
  "ponder",
];
const randomAdjs = [
  "enigmatic",
  "radiant",
  "esoteric",
  "cosmic",
  "silly",
  "infinite",
  "etheral",
];

// Text templates with placeholders
const textTemplates = [
  "Be my {adj} {noun} 👁👁",
  "A {noun} recommendation for you",
  "⚠️Tag your {adj} friend who you want to {verb} with⚠️",
  "These {noun}s are for you because I {verb} you",
  "Send this {noun} to someone you want to {verb} with",
  "This is your sign to {verb} together right now",
  "We love our {noun} community 😻",
  "This is what true {noun} community looks like <3",
  "This {noun} reminds me of us",
];

// Global variable to store the current prompt's noun
let currentPromptNoun = "";

// Function to generate a random prompt
function generateRandomPrompt() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  // Store the noun globally for use in text overlay
  currentPromptNoun = noun;

  const style = styles[Math.floor(Math.random() * styles.length)];
  const adj2 = adjectives[Math.floor(Math.random() * styles.length)];
  const noun2 = nouns[Math.floor(Math.random() * styles.length)];
  return `A ${adj} ${noun} with ${adj2} ${noun2}, ${style}`;
}

// Function to generate random overlay text
function generateRandomText() {
  const template =
    textTemplates[Math.floor(Math.random() * textTemplates.length)];

  return template
    .replace(
      "{verb}",
      randomVerbs[Math.floor(Math.random() * randomVerbs.length)]
    )
    .replace("{adj}", randomAdjs[Math.floor(Math.random() * randomAdjs.length)])
    .replace("{noun}", currentPromptNoun); // Use the current prompt's noun
}

// Text-to-Image Task with a single random prompt
async function textImgTask() {
  let MODEL = "runwayml/stable-diffusion-v1-5";
  const randomPrompt = generateRandomPrompt();

  try {
    const blobImg = await inference.textToImage({
      model: MODEL,
      inputs: randomPrompt,
      parameters: {
        guidance_scale: 3.5,
        height: 400,
        width: 400,
      },
    });

    return {
      url: URL.createObjectURL(blobImg),
      prompt: randomPrompt,
      model: MODEL,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

// p5.js sketch
new p5(function (p5) {
  let generatedImage;
  let modelInfo;
  let overlayTexts = [];
  let isGenerating = false;
  let lastGenerationTime = 0;
  const GENERATION_INTERVAL = 60000; // 60 seconds

  p5.setup = function () {
    p5.createCanvas(400, 400);
    p5.background(240);
    p5.frameRate(30);
    p5.textAlign(p5.CENTER);
    p5.textSize(30);

    // Generate initial image
    generateImage();

    // Set up periodic regeneration
    setInterval(generateImage, GENERATION_INTERVAL);
  };

  async function generateImage() {
    // Prevent multiple simultaneous generations
    if (isGenerating) return;

    isGenerating = true;
    try {
      const result = await textImgTask();
      if (result) {
        generatedImage = p5.loadImage(result.url);
        modelInfo = result;

        // Generate multiple random overlay texts
        overlayTexts = [];
        for (let i = 0; i < 3; i++) {
          overlayTexts.push({
            text: generateRandomText(),
            x: p5.random(0, 150),
            y: p5.random(50, 350),
            size: p5.random(15, 30),
            color: p5.color(
              p5.random(255),
              p5.random(255),
              p5.random(255),
              200
            ),
            strokeColor: p5.color(
              p5.random(255),
              p5.random(255),
              p5.random(255),
              150
            ),
          });
        }

        lastGenerationTime = p5.millis();
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      isGenerating = false;
    }
  }

  
  
   p5.draw = function() {
    p5.background(240);
    
    // Update frame counters with different speeds
    frameCountOne += 1;
    frameCountTwo += 2;
    frameCountThree += 3;
    frameCountFour += 4;
    
    // Generate indices based on frame counters
    let indexOne = p5.floor((frameCountOne / 30) % inputOne.length);
    let indexTwo = p5.floor((frameCountTwo / 30) % inputTwo.length);
    let indexThree = p5.floor((frameCountThree / 30) % inputThree.length);
    let indexFour = p5.floor((frameCountFour / 30) % inputFour.length);
    
    if (generatedImage) {
      // Display the image
      p5.image(generatedImage, 0, 0, 400, 400);
      
      // Display random overlay texts
      overlayTexts.forEach(textObj => {
        p5.push(); 
        
        // Set text properties
        p5.textSize(textObj.size);
        p5.fill(textObj.color);
        p5.stroke(textObj.strokeColor);
        p5.strokeWeight(2);
        
        // Draw text
        p5.text(textObj.text, textObj.x, textObj.y);
        
        p5.pop(); 
      });
      
      // Glowing text overlay
      function drawGlowingText(txt, x, y, glowColor) {
        // Glow effect layers
        for (let i = 30; i > 0; i--) {
          p5.fill(255, 10);
          p5.textSize(30 + i);
          p5.text(txt, x, y + p5.sin(p5.frameCount / 20) * 10);
        }
        // Main text
        p5.fill(255);
        p5.textSize(20);
        p5.text(txt, x, y);
      }
      
      // Draw the glowing text overlay with input texts
      drawGlowingText('i ' + inputOne[indexOne], p5.width / 2, 100, p5.color(255, 100, 100));
      drawGlowingText("therefore i am " + inputTwo[indexTwo], p5.width / 2, 150, p5.color(100, 255, 100));
      drawGlowingText('if i ' + inputThree[indexThree], p5.width / 2, 200, p5.color(100, 100, 255));
      drawGlowingText('then will i ' + inputFour[indexFour], p5.width / 2, 250, p5.color(255, 255, 0));
       
      
      // Top gradient (black to transparent)
      p5.push();
      const topGradient = p5.drawingContext.createLinearGradient(0, 0, 0, 100);
      topGradient.addColorStop(0, 'rgba(0,0,0,1)');
      topGradient.addColorStop(1, 'rgba(0,0,0,0)');
      p5.drawingContext.fillStyle = topGradient;
      p5.rect(0, 0, p5.width, 100);
      p5.pop();

      // Bottom gradient (transparent to black)
      p5.push();
      const bottomGradient = p5.drawingContext.createLinearGradient(0, p5.height - 100, 0, p5.height);
      bottomGradient.addColorStop(0, 'rgba(0,0,0,0)');
      bottomGradient.addColorStop(1, 'rgba(0,0,0,1)');
      p5.drawingContext.fillStyle = bottomGradient;
      p5.rect(0, p5.height - 100, p5.width, 100);
      p5.pop();
      
      
      // Display prompt info (optional)
      // p5.noStroke();
      // p5.fill(0);
      // p5.textSize(14);
      console.log(`Prompt: ${modelInfo.prompt}`, 10, p5.height - 50);
    }
  }
  

  // Add a button to manually regenerate the image and texts
  p5.mousePressed = function () {
    if (
      p5.mouseX > 0 &&
      p5.mouseX < p5.width &&
      p5.mouseY > 0 &&
      p5.mouseY < p5.height
    ) {
      generateImage();
    }
  };
});
