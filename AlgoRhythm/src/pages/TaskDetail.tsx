import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, RotateCcw, Check, X } from 'lucide-react';
import { tasks } from '../data/mockData';

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === id);

  const [code, setCode] = useState(task?.starterCode || '');
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; message: string }> | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!task) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">Task not found</p>
          <button
            onClick={() => navigate('/tasks')}
            className="bg-[#6942d5] text-white px-6 py-2 rounded-lg hover:bg-[#7952e5] transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const handleReset = () => {
    setCode(task.starterCode);
    setTestResults(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);

    // Simulate code execution
    setTimeout(() => {
      const mockResults = [
        { passed: true, message: 'Test case 1 passed ✓' },
        { passed: true, message: 'Test case 2 passed ✓' },
        { passed: Math.random() > 0.3, message: Math.random() > 0.3 ? 'Test case 3 passed ✓' : 'Test case 3 failed: Expected 2, got 3' },
      ];
      setTestResults(mockResults);
      setIsRunning(false);
    }, 1500);
  };

  const difficultyColor = {
    Easy: 'bg-[#ace798]',
    Medium: 'bg-[#ffee9c]',
    Hard: 'bg-[#fe6868]',
  }[task.difficulty];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#3d3d3d] px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/tasks')}
          className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1">
          <p className="font-['Plus_Jakarta_Sans:Regular',sans-serif] text-[#6942d5] text-xs mb-1">{task.id}</p>
          <p className="font-['Roboto_Mono:Medium',sans-serif] text-white">{task.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${difficultyColor}`} />
          <span className="font-['Roboto:Regular',sans-serif] text-white">{task.difficulty}</span>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-full lg:w-1/2 overflow-y-auto bg-[#0d0d0d] p-6">
          <div className="max-w-2xl">
            <h2 className="font-['Roboto:Medium',sans-serif] text-white text-2xl mb-4">Description</h2>
            <p className="font-['Roboto:Regular',sans-serif] text-[#d1d1d1] mb-6 whitespace-pre-wrap">
              {task.description}
            </p>

            <h3 className="font-['Roboto:Medium',sans-serif] text-white text-xl mb-3">Examples</h3>
            <div className="space-y-4 mb-6">
              {task.examples.map((example, idx) => (
                <div key={idx} className="bg-[#1a1a1a] border border-[#3d3d3d] rounded-lg p-4">
                  <p className="font-['Roboto_Mono:Regular',sans-serif] text-[#ace798] mb-2">
                    Input: {example.input}
                  </p>
                  <p className="font-['Roboto_Mono:Regular',sans-serif] text-[#ffee9c] mb-2">
                    Output: {example.output}
                  </p>
                  {example.explanation && (
                    <p className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0] text-sm">
                      {example.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <h3 className="font-['Roboto:Medium',sans-serif] text-white text-xl mb-3">Constraints</h3>
            <ul className="list-disc list-inside space-y-1 mb-6">
              {task.constraints.map((constraint, idx) => (
                <li key={idx} className="font-['Roboto:Regular',sans-serif] text-[#b0b0b0]">
                  {constraint}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#6942d5]/20 text-[#6942d5] px-3 py-1 rounded-full text-sm font-['Roboto:Medium',sans-serif]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="hidden lg:flex lg:w-1/2 flex-col bg-[#1a1a1a] border-l border-[#3d3d3d]">
          {/* Editor Header */}
          <div className="border-b border-[#3d3d3d] px-6 py-3 flex items-center justify-between">
            <p className="font-['Roboto:Medium',sans-serif] text-white">Code Editor</p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-2 bg-[#6942d5] hover:bg-[#7952e5] text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 overflow-auto">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-[#1e1e1e] text-white p-6 font-mono text-sm outline-none resize-none"
              spellCheck={false}
            />
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="border-t border-[#3d3d3d] p-6 bg-[#0d0d0d] max-h-64 overflow-auto">
              <h3 className="font-['Roboto:Medium',sans-serif] text-white mb-4">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${result.passed ? 'bg-[#ace798]/10 border border-[#ace798]/30' : 'bg-[#fe6868]/10 border border-[#fe6868]/30'
                      }`}
                  >
                    {result.passed ? (
                      <Check className="w-5 h-5 text-[#ace798]" />
                    ) : (
                      <X className="w-5 h-5 text-[#fe6868]" />
                    )}
                    <p className={`font-['Roboto:Regular',sans-serif] ${result.passed ? 'text-[#ace798]' : 'text-[#fe6868]'}`}>
                      {result.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
