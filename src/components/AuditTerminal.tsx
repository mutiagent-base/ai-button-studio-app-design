import React, { useState } from 'react';
import { Terminal, ShieldCheck, Award, Trash2, CheckCircle, AlertTriangle, XCircle, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { AuditLog, A11yAuditResult } from '../types';

interface AuditTerminalProps {
  logs: AuditLog[];
  a11yAudit: A11yAuditResult;
  onClearLogs: () => void;
}

type LogCategoryFilter = 'ALL' | 'PARSER' | 'STATE' | 'A11Y' | 'CREDIT' | 'ACTION';

export const AuditTerminal: React.FC<AuditTerminalProps> = ({
  logs,
  a11yAudit,
  onClearLogs,
}) => {
  const [filter, setFilter] = useState<LogCategoryFilter>('ALL');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredLogs = logs.filter(
    l => filter === 'ALL' || l.category === filter
  );

  return (
    <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Bar Header with Stats */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Ethical Registry & Audit Console
            </span>
          </div>

          {/* Accessibility Score Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>A11y Score: <strong>{a11yAudit.score}/100</strong></span>
          </div>

          {/* Passed Checks */}
          <span className="hidden sm:inline text-[11px] text-neutral-400 font-mono">
            ({a11yAudit.passedChecks}/{a11yAudit.totalChecks} Criteria Passed)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter Chips */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
            {(['ALL', 'PARSER', 'STATE', 'A11Y', 'CREDIT'] as LogCategoryFilter[]).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition-all ${
                  filter === cat
                    ? 'bg-neutral-800 text-cyan-300 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClearLogs}
            title="Clear Console Output"
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title={isExpanded ? 'Collapse Console' : 'Expand Console'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        className={`px-4 py-2.5 bg-neutral-950 font-mono text-[11px] overflow-y-auto space-y-1.5 transition-all
          ${isExpanded ? 'max-h-[260px]' : 'max-h-[110px]'}
        `}
      >
        {filteredLogs.length === 0 ? (
          <div className="text-neutral-400 py-1">Console idle. Interactive state transitions and parser telemetry will stream here.</div>
        ) : (
          filteredLogs.slice(-25).map(log => {
            const levelColor =
              log.level === 'success'
                ? 'text-emerald-400'
                : log.level === 'warn'
                ? 'text-amber-400'
                : log.level === 'error'
                ? 'text-rose-400'
                : 'text-cyan-400';

            return (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-neutral-400 select-none">[{log.timestamp}]</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${levelColor} bg-neutral-900 border border-neutral-800`}>
                  {log.category}
                </span>
                <span className="text-neutral-300">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
