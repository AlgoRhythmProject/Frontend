import "@testing-library/jest-dom";
import { add, average, clamp, calculateGrade } from "./test_example";

describe("sum module", () => {
  test("adds 1 + 2 to equal 3", () => {
    expect(add(1, 2)).toBe(3);
  });
});

describe("mathUtils", () => {
  test("add() should add two numbers", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  test("average() should calculate mean correctly", () => {
    expect(average([1, 2, 3, 4])).toBe(2.5);
  });

  test("average() should throw on empty array", () => {
    expect(() => average([])).toThrow("Cannot average empty array");
  });

  test("clamp() should limit value within range", () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-3, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
  });

  test("calculateGrade() returns correct grade", () => {
    expect(calculateGrade([100, 95, 90])).toBe("A");
    expect(calculateGrade([80, 75, 70])).toBe("B");
    expect(calculateGrade([65, 60, 55])).toBe("C");
    expect(calculateGrade([20, 40, 10])).toBe("F");
  });
});
