import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String, // easy / medium / hard

  track: {
    type: String,
    enum: ["Array", "Linked List", "String", "Stack", "Queue", "Tree", "Graph", "DP", "Backtracking", "Greedy", "Heap", "Trie"],
  },

  starterCode: {
    python: String,
    java: String,
    cpp: String
  },

  testCases: [
    {
      input: String,
      output: String
    }
  ]
});

export default mongoose.model("Problem", problemSchema); 