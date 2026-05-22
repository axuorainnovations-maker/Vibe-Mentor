const navItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
    ),
    label: 'New task',
    active: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
    ),
    label: 'Agent',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
    ),
    label: 'Scheduled',
    badge: { text: 'New', variant: 'blue' },
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    ),
    label: 'Search',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6M8 11h4"/></svg>
    ),
    label: 'Library',
  },
];

const chatHistory = [
  'How to Prompt Changes f...',
  'How to Code an Exact Replica of ...',
  'SimilarWeb Analytics Overview',
];

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5.5a2 2 0 0 1 3.5-1.3l1 1a2 2 0 0 0 2.8 0l.7-.7a2 2 0 1 1 2.8 2.8l-.7.7a2 2 0 0 0 0 2.8l1 1a2 2 0 0 1-1.3 3.5"/>
      <path d="M7.5 14.5l-3 3a2 2 0 0 0 0 2.8l.5.5a2 2 0 0 0 2.8 0l3-3"/>
      <path d="M14 9l-5 5"/>
      <path d="M10.5 13.5l-3 3"/>
    </svg>
  );
}

function PanelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 3v18"/>
    </svg>
  );
}

function FolderPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px] shrink-0" style={{ color: '#A6A6AD' }}>
      <path d="M12 20H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2"/>
      <path d="M18 12v6M15 15h6"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h13M7 12h9M10 18h6"/>
    </svg>
  );
}

export default function ManusSidebar() {
  return (
    <aside className="w-[260px] flex flex-col shrink-0" style={{ background: '#1E1E20', borderRight: '1px solid #151517' }}>
      <div className="h-[54px] flex items-center justify-between px-3 pl-4">
        <div className="flex items-center gap-2 font-semibold text-[16.5px] tracking-[-.2px] text-white">
          <span className="w-5 h-5 text-white"><WrenchIcon /></span>
          <span>manus</span>
        </div>
        <div className="w-[26px] h-[26px] grid place-items-center text-[#6A6A70] rounded-md hover:bg-[#1A1A1C] cursor-pointer">
          <PanelIcon />
        </div>
      </div>

      <nav className="px-2 py-1.5 flex flex-col">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <SectionHeader label="Projects" icon={<PlusIcon />} />
      <div className="px-2">
        <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg cursor-pointer text-[13.5px] text-[#D6D6DB] hover:bg-[#161618]">
          <FolderPlusIcon />
          <span>New project</span>
        </div>
      </div>

      <SectionHeader label="Chats" icon={<FilterIcon />} />
      <div className="px-2 flex flex-col">
        {chatHistory.map((title) => (
          <div
            key={title}
            className="flex items-center px-4 py-1.5 rounded-lg text-[13.5px] text-[#D0D0D4] hover:bg-[#151517] cursor-pointer"
          >
            {title}
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-[#2A2A2E] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full grid place-items-center text-white font-semibold text-[13px]"
            style={{ background: 'linear-gradient(180deg, #3B6EFF, #1A3A8A)' }}
          >
            {'\u03B1'}
          </div>
          <span className="text-[13.5px] text-[#D0D0D4] font-normal">axuora.innovations</span>
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: { text: string; variant: string };
}) {
  return (
    <div
      className={`flex items-center gap-2.5 px-2.5 rounded-lg cursor-pointer text-[13.5px] ${
        active ? 'text-white bg-[#1D1D20]' : 'text-[#D6D6DB] hover:bg-[#161618]'
      } ${active ? 'py-2' : 'py-2'}`}
    >
      <span className="w-[18px] h-[18px] flex items-center justify-center shrink-0" style={{ color: active ? '#E4E4E7' : '#A6A6AD' }}>
        {icon}
      </span>
      <span>{label}</span>
      {badge && (
        <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: '#0B2A4A', color: '#3AA0FF' }}>
          {badge.text}
        </span>
      )}
    </div>
  );
}

function SectionHeader({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="mt-4 px-4 pb-1.5 text-[12.5px] text-[#8A8A91] flex items-center justify-between tracking-[.2px]">
      <span>{label}</span>
      <span className="text-[#5F5F66] cursor-pointer">{icon}</span>
    </div>
  );
}
