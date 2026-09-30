import React from 'react';
import { TaskStatus, TaskPriority, IssueSeverity, ProjectHealth } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'cyan' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  const variantMap = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
    danger: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
    cyan: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-mono tracking-tight uppercase ${variantMap[variant]} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  switch (status) {
    case 'TODO':
      return <Badge variant="neutral">To Do</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="primary">In Progress</Badge>;
    case 'REVIEW':
      return <Badge variant="warning">In Review</Badge>;
    case 'DONE':
      return <Badge variant="success">Completed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
  switch (priority) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          MED
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
          LOW
        </span>
      );
    default:
      return <Badge>{priority}</Badge>;
  }
};

export const SeverityBadge: React.FC<{ severity: IssueSeverity }> = ({ severity }) => {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
          P0 CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-rose-950/60 text-rose-300 border border-rose-800/70">
          P1 HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-800/70">
          P2 MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
          P3 LOW
        </span>
      );
    default:
      return <Badge>{severity}</Badge>;
  }
};

export const HealthBadge: React.FC<{ health: ProjectHealth }> = ({ health }) => {
  switch (health) {
    case 'HEALTHY':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Healthy
        </span>
      );
    case 'NEEDS_ATTENTION':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Needs Attention
        </span>
      );
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          Critical Alert
        </span>
      );
  }
};
