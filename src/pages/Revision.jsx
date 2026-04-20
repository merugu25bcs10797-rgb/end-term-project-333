import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import { FiCalendar, FiClock, FiCheckCircle, FiAlertTriangle, FiBook, FiFilter } from 'react-icons/fi';

const Revision = () => {
  const { topics, subjects, tasks } = useStudy();
  const [activeFilter, setActiveFilter] = useState('All');

  // useMemo: Build revision items from topics (not yet studied) + overdue tasks
  const revisionItems = useMemo(() => {
    const now = new Date();

    // Not-studied topics
    const unstudiedTopics = topics
      .filter(t => !t.studied)
      .map(topic => {
        const parentSubject = subjects.find(s => s.id === topic.subjectId);
        return {
          id: `topic-${topic.id}`,
          type: 'topic',
          title: topic.name,
          subject: parentSubject?.name || 'Unknown Subject',
          subjectColor: parentSubject?.color || '#8B5CF6',
          raw: topic,
        };
      });

    // Overdue pending tasks
    const overdueTasks = tasks
      .filter(t => t.status === 'Pending' && t.deadline && new Date(t.deadline) < now)
      .map(task => ({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        subject: task.subject || 'General',
        subjectColor: '#EF4444',
        deadline: task.deadline,
        priority: task.priority,
        raw: task,
      }));

    return [...overdueTasks, ...unstudiedTopics];
  }, [topics, subjects, tasks]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return revisionItems;
    return revisionItems.filter(item => item.type === activeFilter.toLowerCase());
  }, [revisionItems, activeFilter]);

  const countByType = useMemo(() => ({
    All: revisionItems.length,
    Topic: revisionItems.filter(i => i.type === 'topic').length,
    Task: revisionItems.filter(i => i.type === 'task').length,
  }), [revisionItems]);

  return (
    <motion.div className="animate-fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <div style={{ background: 'var(--accent-gradient)', padding: '12px', borderRadius: '12px', display: 'flex' }}>
          <FiCalendar size={26} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '32px' }}>Revision Planner</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Topics to study & tasks that need your attention.
          </p>
        </div>
      </div>

      {/* Summary strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px',
        margin: '28px 0'
      }}>
        {[
          { label: 'Total To Review', value: revisionItems.length, color: '#8B5CF6', icon: <FiFilter size={18} /> },
          { label: 'Unstudied Topics', value: countByType.Topic, color: '#6366F1', icon: <FiBook size={18} /> },
          { label: 'Overdue Tasks', value: countByType.Task, color: '#EF4444', icon: <FiAlertTriangle size={18} /> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
            <div style={{ background: `${color}20`, padding: '10px', borderRadius: '10px', color, display: 'flex' }}>
              {icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {['All', 'Topic', 'Task'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '8px 20px', borderRadius: '24px', fontSize: '14px',
              backgroundColor: activeFilter === f ? 'var(--accent-purple)' : 'var(--bg-glass)',
              color: activeFilter === f ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${activeFilter === f ? 'var(--accent-purple)' : 'var(--border-glass)'}`,
              fontWeight: activeFilter === f ? 600 : 400, transition: 'all 0.2s ease'
            }}
          >
            {f} <span style={{ opacity: 0.7, fontSize: '12px' }}>({countByType[f] ?? 0})</span>
          </button>
        ))}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '80px 40px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
          <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>All caught up!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            No pending topics or overdue tasks. Keep up the great work!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card"
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px',
                  borderLeft: `5px solid ${item.subjectColor}`,
                }}
              >
                {/* Icon */}
                <div style={{
                  background: `${item.subjectColor}15`, padding: '10px', borderRadius: '10px',
                  color: item.subjectColor, flexShrink: 0, display: 'flex'
                }}>
                  {item.type === 'task' ? <FiAlertTriangle size={18} /> : <FiBook size={18} />}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '12px', background: `${item.subjectColor}15`,
                      color: item.subjectColor, padding: '2px 8px', borderRadius: '6px'
                    }}>
                      {item.subject}
                    </span>
                    {item.deadline && (
                      <span style={{ fontSize: '12px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiClock size={11} />
                        Due: {new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    <span style={{
                      fontSize: '12px', padding: '2px 8px', borderRadius: '6px',
                      background: item.type === 'task' ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)',
                      color: item.type === 'task' ? '#EF4444' : '#6366F1',
                    }}>
                      {item.type === 'task' ? '⚠ Overdue Task' : '📘 Unstudied Topic'}
                    </span>
                  </div>
                </div>

                {/* Status indicator */}
                <div style={{ flexShrink: 0 }}>
                  <FiCheckCircle size={20} color="var(--border-glass)" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Revision;
