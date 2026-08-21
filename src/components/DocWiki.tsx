import React, { useState } from 'react';
import { BookOpen, Search, Code, Cpu, Shield, Sparkles, Layers, Sliders, ExternalLink } from 'lucide-react';

export const DocWiki: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'formula',
      title: '1. Modular Prompt Grammar',
      tag: 'Prompting',
      content: `Prompts must strictly follow the tripartite architecture:
[Location] + [Action] + [Effect]

• Location: Grid coordinate (R1C1 through R4C4) and Section (Header, Hero, Content_Left, Content_Right, Footer).
• Action: Operation to execute on trigger (internal_scroll, open_modal, open_search, external_link) and target.
• Effect: Visual style (neon_blue_glow, gradient_fill, outline_rgb, soft_shadow) and physics features (dynamic_shadow_cursor_tracking, rgb_running_border).`,
    },
    {
      id: 'statemachine',
      title: '2. The Advanced 6-State Machine',
      tag: 'State Logic',
      content: `• Idle State: Ambient vitality with slow RGB rotation.
• Hover State: Engages dynamic inverse shadow projection & accelerates conic gradient.
• Click State: Immediate shadow retraction & border color flash.
• Loading State: Rotating SVG spinner, pulsing animation, and pointer lock.
• Disabled State: Desaturated opacity & forceful interaction suppression.
• Success/Error: Emerald confirmation (1.5s) or crimson physical shake reaction.`,
    },
    {
      id: 'physics',
      title: '3. Kinetic Physics & Dynamic Shadows',
      tag: 'Physics',
      content: `Dynamic Cursor Proximity Shadow Algorithm:
Computes the vector from pointer to button center and projects shadow offsets inversely:
shadowOffsetX = -(diffX / 15)
shadowOffsetY = -(diffY / 15)
blurRadius = clamp(10, 30, 4000 / distance)

This delivers an organic, physically floating tactile feedback in 3D space.`,
    },
    {
      id: 'rgb',
      title: '4. Conic RGB Boundary Mechanics',
      tag: 'CSS Engine',
      content: `Utilizes dual-layer masking with CSS custom properties:
- Underlayer: 200% width/height conic-gradient rotating continuously.
- Mask Layer: Inset by var(--border-thickness) to create razor-sharp border trail.
- Acceleration: Transitioning var(--rgb-duration) from 4s to 0.8s on cursor hover.`,
    },
    {
      id: 'a11y',
      title: '5. Inclusive Accessibility (A11y)',
      tag: 'A11y',
      content: `• Automated ARIA label synthesis based on lexical action intent.
• TabIndex preservation for full keyboard navigation flow.
• Native support for @media (prefers-reduced-motion: reduce) disabling keyframe motion and intense flashes for sensitive users.`,
    },
    {
      id: 'credit',
      title: '6. Auto-Credit & Ethical Attribution',
      tag: 'Ethics',
      content: `All compiled snippets include an automated header watermark:
/* Credit: [Author] under [License] */
Preserving developer rights and providing open-source transparency.`,
    },
  ];

  const filtered = sections.filter(
    s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search architecture specs, grammar, physics..."
          className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 rounded-lg border border-neutral-800 focus:border-cyan-500 text-xs text-neutral-200 placeholder:text-neutral-400 focus:outline-none"
        />
      </div>

      {/* Wiki Cards */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[460px]">
        {filtered.map(sec => (
          <div
            key={sec.id}
            className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <h4 className="text-xs font-bold text-neutral-200">{sec.title}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 font-mono">
                {sec.tag}
              </span>
            </div>
            <pre className="text-[11px] text-neutral-400 whitespace-pre-wrap font-sans leading-relaxed">
              {sec.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
