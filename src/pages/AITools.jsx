import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiMessageSquare, FiCopy, FiCheck, FiZap, FiBookOpen } from 'react-icons/fi';
import { toast } from 'react-toastify';

const TOOL_OPTIONS = [
  { id: 'summary', label: 'Generate Summary', icon: <FiBookOpen size={16} />, description: 'Get a structured topic breakdown' },
  { id: 'flashcards', label: 'Create Flashcards', icon: <FiZap size={16} />, description: 'Q&A cards for quick revision' },
  { id: 'questions', label: 'Practice Questions', icon: <FiCpu size={16} />, description: 'Test your understanding' },
];

const MOCK_RESPONSES = {
  summary: (prompt) => `📘 Summary: "${prompt}"\n\n` +
    `1. Core Concept\n   A fundamental building block used to organize and manage hierarchical or structured data efficiently.\n\n` +
    `2. Why It Matters\n   Mastery of this topic is essential for coding interviews and real-world software design.\n\n` +
    `3. Key Sub-Topics\n   • Traversal strategies (in-order, pre-order, post-order)\n   • Insertion & deletion logic\n   • Balancing techniques (AVL, Red-Black)\n\n` +
    `4. Common Interview Questions\n   • What is the time complexity of search?\n   • How do you detect a cycle?\n   • Implement BFS vs DFS.`,

  flashcards: (prompt) => `🃏 Flashcards: "${prompt}"\n\n` +
    `Q1: What is the primary use case?\nA: Efficient sorted storage and retrieval of data in O(log n) time.\n\n` +
    `Q2: What is the worst-case time complexity for search?\nA: O(n) in an unbalanced tree; O(log n) in a balanced one.\n\n` +
    `Q3: How does insertion work?\nA: Compare with root recursively, insert at the correct leaf position.\n\n` +
    `Q4: What is an in-order traversal of a BST?\nA: Produces elements in sorted (ascending) order.`,

  questions: (prompt) => `❓ Practice Questions: "${prompt}"\n\n` +
    `1. [Easy] Define the concept and give a real-world analogy.\n\n` +
    `2. [Medium] Write a function to find the maximum element.\n\n` +
    `3. [Medium] How would you convert a sorted array to this structure?\n\n` +
    `4. [Hard] Implement a function to check if two structures are identical.\n\n` +
    `5. [Hard] Find the lowest common ancestor of two nodes.\n\nHint: Think recursively — compare left and right subtrees.`,
};

const AITools = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeTool, setActiveTool] = useState('summary');
  const [copied, setCopied] = useState(false);

  // useRef: auto-focus the textarea when the page loads
  const textareaRef = useRef(null);
  // useRef: scroll response into view smoothly without re-rendering
  const responseRef = useRef(null);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) {
      toast.warning('Please enter a topic or question first.');
      textareaRef.current?.focus(); // useRef in action — focus without state change
      return;
    }
    setLoading(true);
    setResponse(null);

    setTimeout(() => {
      const output = MOCK_RESPONSES[activeTool]?.(prompt) || 'No response generated.';
      setResponse(output);
      setLoading(false);
      // useRef: scroll to the result smoothly after generation
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1600);
  }, [prompt, activeTool]);

  const handleCopy = useCallback(() => {
    if (!response) return;
    navigator.clipboard.writeText(response).then(() => {
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [response]);

  const handleKeyDown = useCallback((e) => {
    // Ctrl+Enter or Cmd+Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  }, [handleGenerate]);

  return (
    <motion.div className="animate-fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'var(--accent-gradient)', padding: '12px', borderRadius: '12px', display: 'flex' }}>
          <FiCpu size={28} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '32px' }}>AI Study Assistant</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Generate summaries, flashcards, and practice questions instantly.
          </p>
        </div>
      </div>

      {/* Tool Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {TOOL_OPTIONS.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: `1px solid ${activeTool === tool.id ? 'var(--accent-purple)' : 'var(--border-glass)'}`,
              background: activeTool === tool.id ? 'rgba(139,92,246,0.12)' : 'var(--bg-glass)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: activeTool === tool.id ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>
              {tool.icon}
              <span style={{ fontWeight: 600, fontSize: '14px', color: activeTool === tool.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {tool.label}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tool.description}</p>
          </button>
        ))}
      </div>

      {/* Input Card */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
          <FiMessageSquare color="var(--accent-purple)" />
          Enter a topic or question
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 400, marginLeft: 'auto' }}>
            Press Ctrl+Enter to generate
          </span>
        </h3>
        <textarea
          ref={textareaRef}   // useRef attached here
          className="input-field"
          rows="4"
          placeholder="e.g. Binary Search Trees, Photosynthesis, French Revolution..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ resize: 'vertical', fontSize: '15px', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', lineHeight: '1.5' }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: loading || !prompt.trim() ? 0.6 : 1 }}
          >
            {loading ? (
              <>
                <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Generating...
              </>
            ) : (
              <><FiZap /> {TOOL_OPTIONS.find(t => t.id === activeTool)?.label}</>
            )}
          </button>
          {response && (
            <button
              onClick={() => { setResponse(null); setPrompt(''); textareaRef.current?.focus(); }}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', fontSize: '14px', transition: 'all 0.2s' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Response */}
      <AnimatePresence>
        {response && (
          <motion.div
            ref={responseRef}   // useRef attached here for scroll-into-view
            className="glass-card"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            style={{ position: 'relative', paddingTop: '40px' }}
          >
            {/* Gradient top bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-gradient)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: 'var(--accent-purple)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiCpu size={16} /> AI Response
              </h3>
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px',
                  padding: '6px 14px', borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  color: copied ? 'var(--success)' : 'var(--text-secondary)',
                  background: copied ? 'rgba(16,185,129,0.1)' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <pre style={{
              whiteSpace: 'pre-wrap', fontFamily: 'inherit',
              lineHeight: '1.75', color: 'var(--text-primary)', fontSize: '14px'
            }}>
              {response}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
};

export default AITools;
