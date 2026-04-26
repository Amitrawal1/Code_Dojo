export const problems = [
  {
    title: "Two Sum",
    description: "Find two numbers that add up to target",
    difficulty: "easy",
    track: "Array",
    starterCode: {
      python: "def twoSum(nums, target):\n    pass",
      java: "class Solution { }",
      cpp: "int main() { }"
    },
    testCases: [
      { input: "[2,7,11,15],9", output: "[0,1]" }
    ]
  },
  {
    title: "Reverse Linked List",
    description: "Reverse a singly linked list.",
    difficulty: "easy",
    track: "Linked List",
    starterCode: {
      python: "def reverseList(head):\n    pass",
      java: "class Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}",
      cpp: "ListNode* reverseList(ListNode* head) {\n    \n}"
    },
    testCases: [
      { input: "[1,2,3,4,5]", output: "[5,4,3,2,1]" }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "easy",
    track: "Stack",
    starterCode: {
      python: "def isValid(s):\n    pass",
      java: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
      cpp: "bool isValid(string s) {\n    \n}"
    },
    testCases: [
      { input: "\"()[]{}\"", output: "true" },
      { input: "\"(]\"", output: "false" }
    ]
  },
  {
    title: "Merge Intervals",
    description: "Merge all overlapping intervals.",
    difficulty: "medium",
    track: "Array",
    starterCode: {
      python: "def merge(intervals):\n    pass",
      java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}",
      cpp: "vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    \n}"
    },
    testCases: [
      { input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }
    ]
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "easy",
    track: "DP",
    starterCode: {
      python: "def climbStairs(n):\n    pass",
      java: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}",
      cpp: "int climbStairs(int n) {\n    \n}"
    },
    testCases: [
      { input: "2", output: "2" },
      { input: "3", output: "3" }
    ]
  },
  {
    title: "Course Schedule",
    description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
    difficulty: "medium",
    track: "Graph",
    starterCode: {
      python: "def canFinish(numCourses, prerequisites):\n    pass",
      java: "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        \n    }\n}",
      cpp: "bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    \n}"
    },
    testCases: [
      { input: "2, [[1,0]]", output: "true" },
      { input: "2, [[1,0],[0,1]]", output: "false" }
    ]
  }
];

