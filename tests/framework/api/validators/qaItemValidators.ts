import { expect } from "@playwright/test";

export const validateQAItemStructure = (item: any) => {
  expect(item).toMatchObject({
    id: expect.any(String),
    origin: expect.any(String),
    title: expect.any(String),
    createdAt: expect.any(Number),
    description: expect.any(String),
    status: expect.stringMatching(/^(open|in_progress|ready_for_qa|verified|closed)$/),
  });
};

export const validateTimeStamp = (timeStamp: number) => {
  expect(new Date(timeStamp).toString()).not.toBe("Invalid Date");
};
