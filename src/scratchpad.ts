// import { random } from "fp-ts/lib/Random";

// class SoundQuestion {
//   description: string;
//   intensity?: number;
//   decibels?: number;

//   constructor(description: string, intensity?: number, decibels?: number) {
//     this.description = description;

//     if (decibels && !intensity) {
//       this.decibels = decibels;
//       this.intensity = Math.pow(10, decibels / 10) * Math.pow(10, -12);
//     } else if (intensity && !decibels) {
//       this.intensity = intensity;
//       this.decibels = 10 * Math.log10(intensity / Math.pow(10, -12));
//     } else if (!intensity && !decibels) {
//       throw new Error(
//         "Unable to create object, did not pass through information."
//       );
//     } else {
//       this.intensity = intensity;
//       this.decibels = decibels;
//     }
//   }

//   createQuestion(type: "intensity" | "decibels") {
//     if (type === "decibels") {
//       const answer = this.decibels;

//       const question = `The ${this.description} has an intensity of ${this.intensity} W/m^2.  What is this sound in decibels?`;

//       return [answer, question];
//     }

//     if (type === "intensity") {
//       const answer = this.intensity;

//       const question = `The ${this.description} has a sound of ${this.decibels} decibels.  What is the intensity of this sound in W/m^2?`;

//       return [answer, question];
//     }
//   }
// }

// interface AnimalSounds {
//   name: string;
//   decibels: number;
// }

// const Animals: AnimalSounds[] = [
//   {
//     name: "American Alligator's bellow",
//     decibels: 90,
//   },
//   { name: "Coqui Frog's croak", decibels: 100 },
//   { name: "Three Wattled Bellbird's mating call", decibels: 100 },
//   { name: "Hyena's laugh", decibels: 112 },
//   { name: "Hippo's groan", decibels: 114 },
//   { name: "Lion's roar", decibels: 114 },
//   { name: "Gray Wolf's howl", decibels: 115 },
//   { name: "North American Bullfrog's mating croak", decibels: 119 },
//   { name: "Green Grocer Cicada's vibrating exoskeleton", decibels: 120 },
//   { name: "Northern Elephant Seal's warning call", decibels: 126 },
//   { name: "Moluccan Cockatoo's cry", decibels: 129 },
//   { name: "Kapkapo, the loudest bird on earth,", decibels: 132 },
//   { name: "Howler Monkey's howl", decibels: 140 },
// ];

// class RichterScaleQuestion {
//   year: number;
//   location: string;
//   magnitude: number;
//   groundMovement: number;

//   constructor(year: number, location: string, magnitude: number) {
//     this.year = year;
//     this.location = location;
//     this.magnitude = magnitude;

//     this.groundMovement = Math.pow(10, magnitude);
//   }
// }

// const questionString = `The deadliest earthquake in YEAR was near LOCATION.  This earthquake had a MAGNITUDE/GROUND MOVEMENT of .  What was its ground movement/magnitude?`;

// class GrowthRateQuestion {
//   years: number;
//   initial: number;
//   current: number;
//   rate: number;

//   constructor(years: number, initial: number, current: number) {
//     this.years = years;
//     this.initial = initial;
//     this.current = current;

//     this.rate = round((1 / years) * Math.log(current / initial), 4);
//   }

//   createQuestion(toSolve: "years" | "initial" | "current" | "rate") {
//     let answer;
//     let question;
//     switch (toSolve) {
//       case "years":
//         answer = this.years;

//         question = `An individual deposits $${
//           this.initial
//         }.  Now, their investment is worth $${
//           this.current
//         }.  If their investment earns an interest rate of ${
//           this.rate * 100
//         }%, how long (in years) has their money been invested?  Round your answer to the nearest year.  Use the continuous growth rate formula.`;
//         return [answer, question];

//       case "initial":
//         answer = this.initial;

//         question = `An individual has an investment that has grown to a value of $${
//           this.current
//         } at an interest rate of ${
//           this.rate * 100
//         }%.  If they deposited their money ${
//           this.years
//         } years ago, how much money did they initially deposit?  Round your answer to the nearest cent. Use the continuous growth rate formula.`;

//         return [answer, question];

//       case "rate":
//         answer = this.rate;
//         question = `An individual deposits $${this.initial} into a bank account. ${this.years} years later, their investment is worth $${this.current}.  What was the interest rate on their account?  Round your answer to the nearest tenth (one decimal place). Use the continuous growth rate formula.`;
//         return [answer, question];

//       case "current":
//         answer = this.current;
//         question = `${this.years} ago, an individual deposits $${
//           this.initial
//         } into a bank account at an interest rate of ${
//           this.rate * 100
//         }%.  What is the current balance of their bank account?  Round your answer to the nearest cent.  Use the continous growth rate formula.`;
//       default:
//         break;
//     }
//   }
// }

// function round(num: number, places: number) {
//   const multiplier = Math.pow(10, places);

//   return Math.round(num * multiplier) / multiplier;
// }

// function randomBoolean() {
//   return Math.random() < 0.5;
// }

// for (let i = 0; i < 7; i++) {
//   const randomIndex = Math.floor(Math.random() * Animals.length);
//   const animal = Animals[randomIndex];

//   Animals.splice(randomIndex, 1);

//   const animalQuestion = new SoundQuestion(
//     animal.name,
//     undefined,
//     animal.decibels
//   );

//   const question = animalQuestion.createQuestion(
//     randomBoolean() ? "intensity" : "decibels"
//   );

//   console.log(question);
// }

// for (let i = 0; i < 7; i++) {
//   const randomStart = randomIntFromInterval(1, 10) * 1000;
//   const randomEnd = randomIntFromInterval(1, 5) * 1000 + randomStart;

//   const randomTime = randomIntFromInterval(1, 15);

//   const rateQuestion = new GrowthRateQuestion(
//     randomTime,
//     randomStart,
//     randomEnd
//   );

//   const randomType = randomIntFromInterval(1, 4);

//   switch (randomType) {
//     case 1:
//       console.log(rateQuestion.createQuestion("years"));
//       break;

//     case 2:
//       console.log(rateQuestion.createQuestion("rate"));
//       break;

//     case 3:
//       console.log(rateQuestion.createQuestion("initial"));
//       break;

//     case 4:
//       console.log(rateQuestion.createQuestion("current"));
//       break;

//     default:
//       break;
//   }
// }

// function randomIntFromInterval(min: number, max: number) {
//   // min and max included
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// import { get } from "./dbtools/get";

// get("student",{firstName: "Seth"}).then(results => console.log(results));

// import { verify } from "../headless/verify";

// verify().then((results) => console.log(results));