import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

export default function EditNamePage() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('codedojo_user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [name, setName] = useState(user?.name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    const updatedUser = { ...user, name: name.trim() };
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
          <h1 className="text-2xl font-bold text-white mb-2">Change Your Name</h1>
          <p className="text-gray-400 text-sm mb-6">Update your profile name</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <p className="text-sm text-green-400">Name updated successfully!</p>
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
              {success ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
