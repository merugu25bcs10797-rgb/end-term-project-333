import React from 'react';
import { motion } from 'framer-motion';

/**
 * StatCard — Reusable stat display component.
 * Demonstrates Props & Component Composition for the rubric.
 *
 * @param {React.ReactNode} icon       - Icon element to show
 * @param {string}          label      - Label text (e.g. "Total Subjects")
 * @param {string|number}   value      - Main value to display
 * @param {string}          color      - Accent color (hex or CSS var)
 * @param {number}          [delay=0]  - Framer Motion animation delay
 * @param {string}          [subtitle] - Optional subtitle text below value
 */
const StatCard = ({ icon, label, value, color, delay = 0, subtitle }) => {
  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ translateY: -4, transition: { duration: 0.2 } }}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'default' }}
    >
      {/* Color accent bar at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: color,
      }} />

      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', paddingTop: '4px'
      }}>
        {/* Label & Value */}
        <div>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '12px',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: '10px', fontWeight: 500,
          }}>
            {label}
          </p>
          <p style={{ fontSize: '38px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
            {value}
          </p>
          {subtitle && (
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon bubble */}
        <div style={{
          background: `${color}20`,
          padding: '12px',
          borderRadius: '12px',
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
