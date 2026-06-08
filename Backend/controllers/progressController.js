import mongoose from 'mongoose';
import User from '../models/User.js';

// @desc    Get user progress profile
// @route   GET /api/progress/:email
export const getProgress = async (req, res) => {
  try {
    const { email } = req.params;
    // If MongoDB isn't connected, return a deterministic dummy payload for local development
    if (mongoose.connection.readyState !== 1) {
      const user = {
        email,
        identity: {
          fullName: "Amit Rawal",
          degree: "B.Tech CSE - Final Year",
          currentTitle: "Algorithm Assassin",
          level: 42,
          currentXP: 8750,
          globalRank: 1337
        },
        coreMetrics: {
          socraticTrustScore: 88.5,
          currentStreakDays: 14,
          skillRadar: {
            algorithmicThinking: 92,
            codeOptimization: 85,
            aiDefense: 88,
            consistency: 78
          }
        },
        proofOfWork: {
          activityHeatmap: [
            { date: new Date(Date.now() - 6*86400000).toISOString().split('T')[0], submissions: 3 },
            { date: new Date(Date.now() - 5*86400000).toISOString().split('T')[0], submissions: 5 },
            { date: new Date(Date.now() - 4*86400000).toISOString().split('T')[0], submissions: 2 },
            { date: new Date(Date.now() - 3*86400000).toISOString().split('T')[0], submissions: 0 },
            { date: new Date(Date.now() - 2*86400000).toISOString().split('T')[0], submissions: 7 },
            { date: new Date(Date.now() - 1*86400000).toISOString().split('T')[0], submissions: 4 },
            { date: new Date().toISOString().split('T')[0], submissions: 6 }
          ],
          recentBattleLog: [
            { problemIdx: 0, problemName: "Alien Dictionary", difficulty: "Hard", stagesCleared: 3, hintsUsed: 0, xpGained: 500 }
          ],
          trophies: [
            { title: "Untouchable", description: "Cleared 5 Hard problems without AI hints.", icon: "🛡️" }
          ],
          solvedHistory: []
        }
      };

      return res.status(200).json(user);
    }

    let user = await User.findOne({ email });

    // For testing/development, create a dummy user if none exists
    if (!user) {
      user = await User.create({
        email,
        identity: {
          fullName: "Amit Rawal",
          degree: "B.Tech CSE - Final Year",
          currentTitle: "Algorithm Assassin",
          level: 42,
          currentXP: 8750,
          globalRank: 1337
        },
        coreMetrics: {
          socraticTrustScore: 88.5,
          currentStreakDays: 14,
          skillRadar: {
            algorithmicThinking: 92,
            codeOptimization: 85,
            aiDefense: 88,
            consistency: 78
          }
        },
        proofOfWork: {
          activityHeatmap: [
            { date: new Date(Date.now() - 6*86400000).toISOString().split('T')[0], submissions: 3 },
            { date: new Date(Date.now() - 5*86400000).toISOString().split('T')[0], submissions: 5 },
            { date: new Date(Date.now() - 4*86400000).toISOString().split('T')[0], submissions: 2 },
            { date: new Date(Date.now() - 3*86400000).toISOString().split('T')[0], submissions: 0 },
            { date: new Date(Date.now() - 2*86400000).toISOString().split('T')[0], submissions: 7 },
            { date: new Date(Date.now() - 1*86400000).toISOString().split('T')[0], submissions: 4 },
            { date: new Date().toISOString().split('T')[0], submissions: 6 }
          ],
          recentBattleLog: [
            { problemIdx: 0, problemName: "Alien Dictionary", difficulty: "Hard", stagesCleared: 3, hintsUsed: 0, xpGained: 500 }
          ],
          trophies: [
            { title: "Untouchable", description: "Cleared 5 Hard problems without AI hints.", icon: "🛡️" }
          ],
          solvedHistory: []
        }
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("getProgress error:", error.message);
    res.status(500).json({ message: "Server error retrieving progress." });
  }
};

// @desc    Submit successful code execution and update progress
// @route   POST /api/progress/submit
export const submitProgress = async (req, res) => {
  try {
    const { email, problemIdx, problemName, difficulty, logicScore, xpGained } = req.body;
    
    if (!email || problemIdx === undefined) {
      return res.status(400).json({ message: "Email and problem index required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const todayDateStr = new Date().toISOString().split('T')[0];

    // 1. Calculate new XP and Level
    let newXP = user.identity.currentXP + xpGained;
    let newLevel = user.identity.level;
    let xpThreshold = newLevel * 1000;

    // Check if leveled up
    while (newXP >= xpThreshold) {
      newXP -= xpThreshold;
      newLevel += 1;
      xpThreshold = newLevel * 1000;
    }

    // 2. Update heatmap
    let heatmapUpdated = false;
    const newHeatmap = user.proofOfWork.activityHeatmap.map(day => {
      if (day.date === todayDateStr) {
        heatmapUpdated = true;
        return { ...day, submissions: day.submissions + 1 };
      }
      return day;
    });

    if (!heatmapUpdated) {
      newHeatmap.push({ date: todayDateStr, submissions: 1 });
      if (newHeatmap.length > 7) newHeatmap.shift(); // Keep last 7 days
    }

    // 3. New battle log entry
    const newBattle = {
      problemIdx,
      problemName,
      difficulty,
      stagesCleared: 3,
      hintsUsed: 0,
      logicScore,
      xpGained,
      date: new Date()
    };

    // 4. Update solved history if not already solved
    const alreadySolved = user.proofOfWork.solvedHistory.find(s => s.problemIdx === problemIdx);
    const pushOps = { 'proofOfWork.recentBattleLog': { $each: [newBattle], $slice: -5 } };
    
    if (!alreadySolved) {
      pushOps['proofOfWork.solvedHistory'] = { problemIdx, date: todayDateStr, attempts: 1, logicScore };
    }

    // 5. Update user atomically
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          'identity.currentXP': newXP,
          'identity.level': newLevel,
          'proofOfWork.activityHeatmap': newHeatmap
        },
        $push: pushOps
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("submitProgress error:", error.message);
    res.status(500).json({ message: "Server error updating progress." });
  }
};
