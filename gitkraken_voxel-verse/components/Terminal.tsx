import React, { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  onCommand: (cmd: string) => void;
  history: string[]; // Output log
  currentBranch: string;
}

export const Terminal: React.FC<TerminalProps> = ({ onCommand, history, currentBranch }) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onCommand(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border-t-4 border-[#2f363d] font-mono text-sm shadow-2xl">
      {/* Terminal Bar */}
      <div className="flex items-center px-4 py-1 bg-[#161b22] border-b border-[#30363d] text-gray-400 select-none">
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span>Keif@GitKraken-Console:~/voxel-verse</span>
      </div>

      {/* Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 text-gray-300">
        <div className="text-gray-500 mb-2">
          Welcome to GitKraken Voxel Verse v1.0.0<br/>
          Type <span className="text-cyan-400">help</span> for a list of commands.
        </div>
        {history.map((line, i) => (
          <div key={i} className="break-words leading-relaxed whitespace-pre-wrap">
            {line.startsWith('>') ? (
               <span className="text-yellow-400 font-bold">{line}</span>
            ) : line.includes('Error') || line.includes('fatal') ? (
                <span className="text-red-400">{line}</span>
            ) : line.includes('Success') || line.includes('Merged') ? (
                <span className="text-green-400">{line}</span>
            ) : (
                <span dangerouslySetInnerHTML={{__html: line}} />
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-2 bg-[#0d1117] flex items-center border-t border-[#30363d]">
        <span className="text-green-500 font-bold mr-2">➜</span>
        <span className="text-cyan-400 font-bold mr-2">({currentBranch})</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-600"
          placeholder="git status..."
          autoFocus
        />
      </form>
    </div>
  );
};