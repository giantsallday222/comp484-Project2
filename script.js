$(function () {

  checkAndUpdatePetInfoInHtml();

  // Writes data onto the element instead of in html
  // Using any stored data from previous to use it here so you can continue the previous session without restarting.
 
  $('.pet-image').data('previousStats', {
    happiness: pet_info.happiness,
    weight: pet_info.weight,
    energy: pet_info.energy
  });

  // When each button is clicked, it will "call" function for that button (functions are below)
  $('.treat-button').click(clickedTreatButton);
  $('.play-button').click(clickedPlayButton);
  $('.exercise-button').click(clickedExerciseButton);

  // Click handler for the NEW action button (Sleep)
  $('.sleep-button').click(clickedSleepButton);
});

// pet_info object with name (string), weight (number), happiness (number), and energy (number)
var pet_info = {
  name: "Hound",
  weight: 30,
  happiness: 50,
  energy: 80
};

function clickedTreatButton() {
  // Treat: increase happiness, increase weight, small energy boost
  pet_info.happiness += 1;
  pet_info.weight += 10;
  pet_info.energy += 5;

  finishActionWithMessage("Yum! Thanks for the treat!");
}

function clickedPlayButton() {
  // Play: increase happiness, decrease weight, costs energy
  pet_info.happiness += 1;
  pet_info.weight -= 1;
  pet_info.energy -= 10;

  finishActionWithMessage("Whee! That was fun, let's play more!");
}

function clickedExerciseButton() {
  // Exercise: decrease happiness, decrease weight, costs a lot of energy
  pet_info.happiness -= 5;
  pet_info.weight -= 3;
  pet_info.energy -= 30;

  finishActionWithMessage("*pant pant* I'm getting stronger...");
}

// New behavior: Sleep restores energy and a little happiness
function clickedSleepButton() {
  pet_info.energy += 50;
  pet_info.happiness += 2;

  finishActionWithMessage("Zzz... so cozy and warm.");
}


function finishActionWithMessage(baseMessage) {
  checkAndUpdatePetInfoInHtml();              
  var deltaText = computeAndStoreStatDeltas();  
  showPetMessage(baseMessage + ' ' + deltaText);
  bouncePet();
}

function checkAndUpdatePetInfoInHtml() {
  checkWeightAndHappinessBeforeUpdating();
  updatePetInfoInHtml();
}

// Don't allow values to go below zero
function checkWeightAndHappinessBeforeUpdating() {
  if (pet_info.weight < 0) {
    pet_info.weight = 0;
  }
  if (pet_info.happiness < 0) {
    pet_info.happiness = 0;
  }
  if (pet_info.energy < 0) {
    pet_info.energy = 0;
  }
  if (pet_info.energy > 100) {
    pet_info.energy = 100;
  }
}

// Updates your HTML with the current values in your pet_info object
function updatePetInfoInHtml() {
  $('.name').text(pet_info['name']);
  $('.weight').text(pet_info['weight']);
  $('.happiness').text(pet_info['happiness']);
  $('.energy').text(pet_info['energy']);
}

function computeAndStoreStatDeltas() {
  var $pet = $('.pet-image');

  // .data() READ — pull the previously stored object snapshot off the element
  var previous = $pet.data('previousStats');

  // Calculates the difference before and after the last click to calculate the happiness
  var changes = [];
  var hDelta = pet_info.happiness - previous.happiness;
  var wDelta = pet_info.weight - previous.weight;
  var eDelta = pet_info.energy - previous.energy;

  if (hDelta !== 0) changes.push((hDelta > 0 ? '+' : '') + hDelta + ' happiness');
  if (wDelta !== 0) changes.push((wDelta > 0 ? '+' : '') + wDelta + ' lbs');
  if (eDelta !== 0) changes.push((eDelta > 0 ? '+' : '') + eDelta + ' energy');

  // .data() stores the stats for the next session
  $pet.data('previousStats', {
    happiness: pet_info.happiness,
    weight: pet_info.weight,
    energy: pet_info.energy
  });

  return changes.length ? '(' + changes.join(', ') + ')' : '';
}

//This .finish() function allows me to spam click any button and not have the messages overlap even though there are delays.
function showPetMessage(message) {
  $('.pet-message')
    .finish()                // <-- UNIQUE METHOD #2: clears queue + jumps to end state
    .text(message)
    .fadeIn(200)
    .delay(1800)             // keep bubble visible for 1.8s between fade-in and fade-out
    .fadeOut(500);
}

function bouncePet() {
  $('.pet-image')
    .finish()                                // <-- .finish() again, on the pet's queue
    .animate({ marginTop: '-20px' }, 150)    // hop up
    .animate({ marginTop: '0px' }, 200);     // settle back down
}
