import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import { FiPlus, FiX, FiTrash2, FiChevronDown, FiChevronUp, FiTag, FiCheckCircle } from 'react-icons/fi';

// --- Topic badge for inside subject cards ---
const TopicItem = ({ topic, onRemove, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 12px',
      background: topic.studied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${topic.studied ? 'rgba(16,185,129,0.3)' : 'var(--border-glass)'}`,
      borderRadius: '8px', gap: '8px'
    }}
  >
    <button
      onClick={() => onToggle(topic.id, topic.studied)}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'left' }}
    >
      <FiCheckCircle
        size={15}
        color={topic.studied ? 'var(--success)' : 'var(--text-secondary)'}
        style={{ flexShrink: 0 }}
      />
      <span style={{
        fontSize: '13px',
        color: topic.studied ? 'var(--success)' : 'var(--text-primary)',
        textDecoration: topic.studied ? 'line-through' : 'none',
      }}>
        {topic.name}
      </span>
    </button>
    <button onClick={() => onRemove(topic.id)} style={{ color: 'var(--text-secondary)', flexShrink: 0 }}
      className="delete-btn">
      <FiX size={13} />
    </button>
  </motion.div>
);

// --- Individual subject card ---
const SubjectCard = ({ sub, topics, onRemove, onAddTopic, onRemoveTopic, onToggleTopic }) => {
  const [expanded, setExpanded] = useState(false);
  const [topicInput, setTopicInput] = useState('');

  const subTopics = useMemo(() => topics.filter(t => t.subjectId === sub.id), [topics, sub.id]);
  const doneCount = subTopics.filter(t => t.studied).length;

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    onAddTopic({ name: topicInput.trim(), subjectId: sub.id, studied: false });
    setTopicInput('');
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass-card"
      style={{ position: 'relative', borderTop: `4px solid ${sub.color}`, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{sub.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>{sub.description}</p>
        </div>
        <button onClick={() => onRemove(sub.id)} className="delete-btn" style={{ color: 'var(--text-secondary)', marginLeft: '12px', padding: '4px' }}>
          <FiTrash2 size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiTag size={11} /> {subTopics.length} Topics</span>
          <span>{doneCount}/{subTopics.length} studied</span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: subTopics.length > 0 ? `${(doneCount / subTopics.length) * 100}%` : '0%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ height: '100%', background: sub.color, borderRadius: '4px' }}
          />
        </div>
      </div>

      {/* Toggle topics */}
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 500,
          transition: 'color 0.2s'
        }}
      >
        {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        {expanded ? 'Hide' : 'Manage'} Topics
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              <AnimatePresence>
                {subTopics.map(topic => (
                  <TopicItem
                    key={topic.id}
                    topic={topic}
                    onRemove={onRemoveTopic}
                    onToggle={onToggleTopic}
                  />
                ))}
              </AnimatePresence>
              {subTopics.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>
                  No topics yet. Add your first one below.
                </p>
              )}
            </div>
            <form onSubmit={handleAddTopic} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={topicInput}
                onChange={e => setTopicInput(e.target.value)}
                className="input-field"
                placeholder="Add a topic (e.g. Recursion)"
                style={{ fontSize: '13px', padding: '8px 12px' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '8px 14px', flexShrink: 0 }}>
                <FiPlus />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main Subjects Page ---
const Subjects = () => {
  const { subjects, addSubject, removeSubject, topics, addTopic, removeTopic, updateTopic } = useStudy();
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '', color: '#8B5CF6' });

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.name) return;
    await addSubject(newSubject);
    setShowModal(false);
    setNewSubject({ name: '', description: '', color: '#8B5CF6' });
  };

  const handleToggleTopic = useCallback((id, currentStudied) => {
    updateTopic(id, { studied: !currentStudied });
  }, [updateTopic]);

  return (
    <motion.div className="animate-fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px' }}>Subjects & Topics</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Organize your curriculum and track topic progress.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px',
          }}>
            <FiPlus size={36} color="var(--accent-purple)" />
          </div>
          <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>No subjects yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Create your first subject to start building your study curriculum.
          </p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            Create First Subject
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {subjects.map(sub => (
            <SubjectCard
              key={sub.id}
              sub={sub}
              topics={topics}
              onRemove={removeSubject}
              onAddTopic={addTopic}
              onRemoveTopic={removeTopic}
              onToggleTopic={handleToggleTopic}
            />
          ))}
        </div>
      )}

      {/* Add Subject Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="glass-card"
              style={{ width: '100%', maxWidth: '480px', padding: '32px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>Create New Subject</h2>
                <button onClick={() => setShowModal(false)}><FiX size={22} color="var(--text-secondary)" /></button>
              </div>
              <form onSubmit={handleAddSubject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Subject Name *</label>
                  <input type="text" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} className="input-field" required placeholder="e.g. Data Structures" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Description</label>
                  <textarea value={newSubject.description} onChange={e => setNewSubject({ ...newSubject, description: e.target.value })} className="input-field" rows="3" placeholder="Brief overview of this subject..." />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Color Label</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="color" value={newSubject.color} onChange={e => setNewSubject({ ...newSubject, color: e.target.value })} style={{ width: '48px', height: '40px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px' }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Choose a color to identify this subject</span>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Save Subject</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Subjects;
