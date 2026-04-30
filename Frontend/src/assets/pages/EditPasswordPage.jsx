import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';

export default function EditPasswordPage() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('codedojo_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    if (!currentPassword.trim()) {
      setError('Current password is required');
      return;
    }

    if (!newPassword.trim()) {
      setError('New password cannot be empty');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    // In a real app, validate currentPassword against stored hash
    // For now, we'll just accept any input (demo purposes)
    const updatedUser = { ...user, password: newPassword };
    localStorage.setItem('codedojo_user', JSON.stringify(updatedUser));
    setSuccess(true);
    setTimeout(() => navigate('/home'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] to-[#161b22] pt-20 px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white mb-2">Change Your Password</h1>
          <p className="text-gray-400 text-sm mb-6">Secure your account with a new password</p>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 pr-10 text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 pr-10 text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 pr-10 text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <p className="text-sm text-green-400">Password updated successfully!</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 rounded-lg border border-zinc-600 bg-transparent px-4 py-2.5 text-white font-medium hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={success}
              className="flex-1 rounded-lg bg-cyan-600 px-4 py-2.5 text-white font-medium hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            >
              {success ? 'Saved!' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
