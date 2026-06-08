import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProgressContext = createContext();

export function useProgress() {
  return useContext(ProgressContext);
}

export function ProgressProvider({ children }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded email for testing since auth is not fully wired up yet
  const USER_EMAIL = "test@codedojo.com";
  const API_URL = "http://localhost:5000/api/progress";

  // Fetch initial progress on load
  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/${USER_EMAIL}`, { timeout: 3000 });
      setProfileData(data);
    } catch (error) {
      console.warn("MongoDB connection failed or timed out. Falling back to local data.", error.message);
      // Fallback data so the UI doesn't break
      setProfileData({
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
    } finally {
      setLoading(false);
    }
  };

  // Submit successful problem solving
  const submitProblemAction = async (problemIdx, problemName, difficulty, logicScore, xpGained) => {
    try {
      const { data } = await axios.post(`${API_URL}/submit`, {
        email: USER_EMAIL,
        problemIdx,
        problemName,
        difficulty,
        logicScore,
        xpGained
      });
      // The API returns the completely updated user document
      setProfileData(data);
      return true;
    } catch (error) {
      console.error("Failed to submit problem progress:", error);
      return false;
    }
  };

  const value = {
    profileData,
    loading,
    submitProblemAction,
    fetchProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
