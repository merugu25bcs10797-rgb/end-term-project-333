import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import StatCard from '../components/StatCard';
import {
  FiBook, FiCheckSquare, FiClock, FiTrendingUp, FiAlertCircle, FiStar
} from 'react-icons/fi';

// StatCard is now a shared component — imported from /components/StatCard

const Dashboard = () => {
  const { subjects, tasks, stats } = useStudy();

  // useMemo: only recalculate recent tasks when tasks array changes
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const inWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tasks.filter(t =>
      t.status === 'Pending' && t.deadline &&
      new Date(t.deadline) >= now &&
      new Date(t.deadline) <= inWeek
    ).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [tasks]);

  return (
    <motion.div className="animate-fade-in" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>Study Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your learning progress at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard icon={<FiBook size={22} />} label="Total Subjects" value={stats.totalSubjects} color="#8B5CF6" delay={0} />
        <StatCard icon={<FiStar size={22} />} label="Topics Covered" value={stats.totalTopics} color="#6366F1" delay={0.05} />
        <StatCard icon={<FiClock size={22} />} label="Pending Tasks" value={stats.pendingTasks} color="#F59E0B" delay={0.1} />
        <StatCard icon={<FiCheckSquare size={22} />} label="Completed Tasks" value={stats.completedTasks} color="#10B981" delay={0.15} />
        <StatCard icon={<FiAlertCircle size={22} />} label="Overdue" value={stats.overdueTasks} color="#EF4444" delay={0.2} />
        <StatCard icon={<FiTrendingUp size={22} />} label="Completion Rate" value={`${stats.completionRate}%`} color="#EC4899" delay={0.25} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Activity */}
        <motion.div className="glass-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiClock size={20} color="var(--accent-purple)" /> Recent Tasks
          </h2>
          {recentTasks.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>No tasks yet. Add one on the Tasks page!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentTasks.map(t => (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: '10px', border: '1px solid var(--border-glass)'
                }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                    background: t.status === 'Completed' ? 'var(--success)' : 'var(--warning)'
                  }} />
                  <span style={{
                    fontSize: '14px', flex: 1,
                    textDecoration: t.status === 'Completed' ? 'line-through' : 'none',
                    color: t.status === 'Completed' ? 'var(--text-secondary)' : 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{t.title}</span>
                  <span style={{
                    fontSize: '11px', padding: '3px 8px', borderRadius: '20px', flexShrink: 0,
                    background: t.priority === 'High' ? 'rgba(239,68,68,0.15)' : t.priority === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                    color: t.priority === 'High' ? '#EF4444' : t.priority === 'Medium' ? '#F59E0B' : '#10B981',
                  }}>{t.priority}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div className="glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiAlertCircle size={20} color="#F59E0B" /> Due This Week
          </h2>
          {upcomingDeadlines.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>
              🎉 Nothing due this week!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingDeadlines.map(t => (
                <div key={t.id} style={{
                  padding: '12px', background: 'rgba(245,158,11,0.05)',
                  borderRadius: '10px', border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px'
                }}>
                  <span style={{ fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                  <span style={{ fontSize: '12px', color: '#F59E0B', flexShrink: 0 }}>
                    {new Date(t.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
