import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import { FiPlus, FiX, FiCheck, FiClock, FiTrash2, FiEdit2, FiFilter } from 'react-icons/fi';

const getPriorityColor = (priority) => {
  if (priority === 'High') return { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' };
  if (priority === 'Medium') return { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
  return { color: '#10B981', bg: 'rgba(16,185,129,0.12)' };
};

const isOverdue = (task) =>
  task.status === 'Pending' && task.deadline && new Date(task.deadline) < new Date();

const Tasks = () => {
  const { tasks, addTask, removeTask, toggleTask, updateTask, subjects } = useStudy();
  const [activeTab, setActiveTab] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null); // null = create, object = edit mode
  const [formData, setFormData] = useState({ title: '', subject: '', priority: 'Medium', deadline: '' });

  const tabs = ['All', 'Pending', 'Completed', 'Overdue'];

  // useMemo: filtered list only recalculates when tasks or tab changes
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Pending') return t.status === 'Pending' && !isOverdue(t);
      if (activeTab === 'Completed') return t.status === 'Completed';
      if (activeTab === 'Overdue') return isOverdue(t);
      return true;
    });
  }, [tasks, activeTab]);

  const openCreate = useCallback(() => {
    setEditTask(null);
    setFormData({ title: '', subject: '', priority: 'Medium', deadline: '' });
    setShowModal(true);
  }, []);

  const openEdit = useCallback((task) => {
    setEditTask(task);
    setFormData({
      title: task.title,
      subject: task.subject || '',
      priority: task.priority || 'Medium',
      deadline: task.deadline || '',
    });
    setShowModal(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    if (editTask) {
      await updateTask(editTask.id, formData);
    } else {
      await addTask({ ...formData, status: 'Pending' });
    }
    setShowModal(false);
    setEditTask(null);
  };

  const handleTabChange = useCallback((tab) => setActiveTab(tab), []);

  return (
    <motion.div className="animate-fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '32px' }}>Study Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{tasks.length} total tasks</p>
        </div>
        <button className="btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> Create Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', overflowX: 'auto', paddingBottom: '4px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: '8px 22px',
              borderRadius: '24px',
              backgroundColor: activeTab === tab ? 'var(--accent-purple)' : 'var(--bg-glass)',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === tab ? 'var(--accent-purple)' : 'var(--border-glass)'}`,
              whiteSpace: 'nowrap',
              fontWeight: activeTab === tab ? 600 : 400,
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            {tab === 'Overdue' && <FiFilter size={12} />}
            {tab}
            <span style={{
              background: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
              borderRadius: '12px', padding: '1px 7px', fontSize: '12px'
            }}>
              {tasks.filter(t => {
                if (tab === 'All') return true;
                if (tab === 'Pending') return t.status === 'Pending' && !isOverdue(t);
                if (tab === 'Completed') return t.status === 'Completed';
                if (tab === 'Overdue') return isOverdue(t);
                return false;
              }).length}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '64px 40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {activeTab === 'Completed' ? '🎉' : activeTab === 'Overdue' ? '⏰' : '📋'}
          </div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
            {activeTab === 'Completed' ? 'No completed tasks yet' : activeTab === 'Overdue' ? 'No overdue tasks!' : 'No tasks here'}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {activeTab === 'All' ? 'Create your first task to get started.' : `Nothing in ${activeTab} category.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence>
            {filteredTasks.map(t => {
              const pColor = getPriorityColor(t.priority);
              const overdue = isOverdue(t);
              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={t.id}
                  className="glass-card"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 20px',
                    borderLeft: `5px solid ${overdue ? '#EF4444' : pColor.color}`,
                    opacity: t.status === 'Completed' ? 0.65 : 1,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                    {/* Toggle button */}
                    <button
                      onClick={() => toggleTask(t.id, t.status)}
                      style={{
                        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                        border: `2px solid ${t.status === 'Completed' ? 'var(--success)' : 'var(--text-secondary)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: t.status === 'Completed' ? 'var(--success)' : 'transparent',
                        color: 'white', transition: 'all 0.2s'
                      }}
                    >
                      {t.status === 'Completed' && <FiCheck size={14} />}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        textDecoration: t.status === 'Completed' ? 'line-through' : 'none',
                        fontSize: '15px', marginBottom: '4px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>{t.title}</h3>
                      <div style={{ display: 'flex', gap: '14px', color: 'var(--text-secondary)', fontSize: '13px', flexWrap: 'wrap' }}>
                        {t.subject && (
                          <span style={{
                            background: 'rgba(139,92,246,0.12)', color: 'var(--accent-purple)',
                            padding: '2px 8px', borderRadius: '6px', fontSize: '12px'
                          }}>{t.subject}</span>
                        )}
                        {t.deadline && (
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            color: overdue ? '#EF4444' : 'var(--text-secondary)'
                          }}>
                            <FiClock size={12} />
                            {overdue ? 'Overdue · ' : ''}{new Date(t.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                        <span style={{ background: pColor.bg, color: pColor.color, padding: '2px 8px', borderRadius: '6px', fontSize: '12px' }}>
                          {t.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                    <button
                      onClick={() => openEdit(t)}
                      style={{ color: 'var(--text-secondary)', padding: '6px' }}
                      className="delete-btn"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => removeTask(t.id)}
                      style={{ color: 'var(--text-secondary)', padding: '6px' }}
                      className="delete-btn"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit Modal */}
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
              style={{ width: '100%', maxWidth: '500px', padding: '32px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2>{editTask ? 'Edit Task' : 'Create Task'}</h2>
                <button onClick={() => setShowModal(false)}><FiX size={22} color="var(--text-secondary)" /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Task Title *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="input-field" required placeholder="e.g. Master React Hooks" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Subject (Optional)</label>
                  <select value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="input-field" style={{ appearance: 'none', background: 'rgba(0,0,0,0.3)' }}>
                    <option value="">Select a Subject</option>
                    {subjects.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Deadline</label>
                    <input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} className="input-field" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>Priority</label>
                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="input-field" style={{ appearance: 'none', background: 'rgba(0,0,0,0.3)' }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>
                  {editTask ? 'Update Task' : 'Create Task'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tasks;
