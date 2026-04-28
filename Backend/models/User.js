import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  identity: {
    fullName: { type: String, default: "Hacker" },
    degree: { type: String, default: "B.Tech CSE" },
    currentTitle: { type: String, default: "Novice Coder" },
    level: { type: Number, default: 1 },
    currentXP: { type: Number, default: 0 },
    globalRank: { type: Number, default: 9999 }
  },
  coreMetrics: {
    socraticTrustScore: { type: Number, default: 50 },
    currentStreakDays: { type: Number, default: 0 },
    skillRadar: {
      algorithmicThinking: { type: Number, default: 10 },
      codeOptimization: { type: Number, default: 10 },
      aiDefense: { type: Number, default: 10 },
      consistency: { type: Number, default: 10 }
    }
  },
  proofOfWork: {
    activityHeatmap: [{
      date: String, // YYYY-MM-DD
      submissions: Number
    }],
    recentBattleLog: [{
      problemIdx: Number,
      problemName: String,
      difficulty: String,
      stagesCleared: Number,
      hintsUsed: Number,
      logicScore: Number,
      xpGained: Number,
      date: { type: Date, default: Date.now }
    }],
    trophies: [{
      title: String,
      description: String,
      icon: String
    }],
    solvedHistory: [{
      problemIdx: Number,
      date: String,
      attempts: Number,
      logicScore: Number
    }]
  }
}, { timestamps: true });

// Optional: Virtual for xpToNextLevel
userSchema.virtual('identity.xpToNextLevel').get(function() {
  const currentLevel = this.identity.level;
  const xpNeeded = currentLevel * 1000; // Formula: 1000 XP per level scale
  const remaining = xpNeeded - this.identity.currentXP;
  return remaining > 0 ? remaining : 0;
});

// Ensure virtuals are included in res.json()
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

export default User;
