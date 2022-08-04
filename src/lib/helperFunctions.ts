import fileUpload from "express-fileupload";
import { Response } from "express";

export function hasAnyPropertyUndefined(obj: object) {
  const undefinedValues = Object.values(obj).findIndex(
    (element) => element === undefined
  );

  if (undefinedValues !== -1) {
    return true;
  } else {
    return false;
  }
}

export function arrayIsSubset(array1: any[], array2: any[]) {
  // if array 1 is larger, then check if array 2 is a subset of array 2.
  if (array1.length >= array2.length) {
    const isSubset = array2.every((value) => array1.includes(value));
    return isSubset;
  } else {
    const isSubset = array1.every((value) => array2.includes(value));
    return isSubset;
  }
}

export function mean(nums: number[]) {
  const mean = sum(nums) / nums.length;
  return mean;
}

export function sum(nums: number[]) {
  const sum = nums.reduce((a, b) => a + b, 0);
  return sum;
}

export function median(nums: number[]) {
  const ordered = nums.sort((a, b) => a - b);

  if (ordered.length % 2 === 0) {
    const middle1 = ordered.length / 2 - 1;
    const middle2 = middle1 + 1;

    return mean([ordered[middle1], ordered[middle2]]);
  } else {
    const middle = (ordered.length - 1) / 2;
    return ordered[middle];
  }
}

export function highestNum(nums: number[]) {
  const ordered = nums.sort((a, b) => a - b);

  return ordered[ordered.length - 1];
}

export function secondHighestNum(nums: number[]) {
  const highest = highestNum(nums);

  const ordered = sortGreatestToLeast(nums);

  const secondHighest = ordered.find((num) => num !== highest);

  if (secondHighest === undefined) {
    return highest;
  } else {
    return secondHighest;
  }
}

export function lowestNum(nums: number[]) {
  const ordered = nums.sort((a, b) => a - b);

  return ordered[0];
}

export function std(nums: number[], suppliedMean?: number) {
  if (suppliedMean) {
    const ss = sumOfSquares(nums, suppliedMean);
    const variance = ss / nums.length;
    const stdev = Math.sqrt(variance);

    return stdev;
  } else {
    const meanCal = mean(nums);
    const ss = sumOfSquares(nums, meanCal);
    const variance = ss / nums.length;
    const stdev = Math.sqrt(variance);

    return stdev;
  }
}

export function sortLeastToGreatest(nums: number[]) {
  return nums.sort((a, b) => a - b);
}

export function sortGreatestToLeast(nums: number[]) {
  return nums.sort((a, b) => b - a);
}

export function sumOfSquares(nums: number[], mean: number) {
  return nums.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
}

export function isValidEmail(email: string) {
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  return email.toLowerCase().match(emailRegex) !== null;
}

export function isEmptyObject(obj: Object) {
  return Object.keys(obj).length === 0;
}

export function handleKnexRawResults<K extends any[]>(results: any) {
  if (results[0].length === 0) {
    return [] as unknown as K;
  } else {
    return results[0] as K;
  }
}
