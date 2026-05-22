function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
      <path d="M11 5.5a2 2 0 0 1 3.5-1.3l1 1a2 2 0 0 0 2.8 0l.7-.7a2 2 0 1 1 2.8 2.8l-.7.7a2 2 0 0 0 0 2.8l1 1a2 2 0 0 1-1.3 3.5" />
      <path d="M7.5 14.5l-3 3a2 2 0 0 0 0 2.8l.5.5a2 2 0 0 0 2.8 0l3-3" />
      <path d="M14 9l-5 5" />
      <path d="M10.5 13.5l-3 3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function AgentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6M8 11h4" />
    </svg>
  );
}

function FolderPlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
      <path d="M12 20H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2" />
      <path d="M18 12v6M15 15h6" />
    </svg>
  );
}

function HashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[15px] h-[15px]">
      <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
    </svg>
  );
}

const chatHistory = [
  'How to Prompt Changes f...',
  'How to Code an Exact Replica of ...',
  'SimilarWeb Analytics Overview',
];

export default function ManusSidebar() {
  return (
    <aside className="w-[256px] flex flex-col shrink-0 bg-[#151517] border-r border-[#1f1f22]">
      <div className="h-[52px] flex items-center justify-between px-3 pl-4">
        <div className="flex items-center gap-[7px] text-[14px] font-medium text-[#e1e1e4]">
          <WrenchIcon />
          <span>manus</span>
        </div>
      </div>

      <nav className="px-[6px] flex flex-col gap-[1px]">
        <NavItem icon={<EditIcon />} label="New task" active />
        <NavItem icon={<AgentIcon />} label="Agent" />
        <NavItem icon={<ClockIcon />} label="Scheduled" badge="New" />
        <NavItem icon={<SearchIcon />} label="Search" />
        <NavItem icon={<BookIcon />} label="Library" />
      </nav>

      <SectionHeader label="Projects" />
      <div className="px-[6px]">
        <NavItem icon={<FolderPlusIcon />} label="New project" tight />
      </div>

      <SectionHeader label="Chats" />
      <div className="px-[6px] flex flex-col gap-[1px]">
        {chatHistory.map((title) => (
          <div
            key={title}
            className="flex items-center gap-[10px] px-[10px] py-[5px] rounded-[6px] text-[14px] text-[#78787f] hover:text-[#c7c7cc] hover:bg-[#1c1c1f] cursor-pointer transition-all duration-150"
          >
            <HashIcon />
            <span className="truncate">{title}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto px-3 py-[10px] border-t border-[#1f1f22]">
        <div className="flex items-center gap-[9px] px-[7px] py-[6px] rounded-[6px] hover:bg-[#1c1c1f] cursor-pointer transition-all duration-150">
          <div className="w-[26px] h-[26px] rounded-full bg-[#252528] flex items-center justify-center text-[#78787f] text-[12px] font-medium">
            {'\u03B1'}
          </div>
          <span className="text-[13px] text-[#a1a1a8] font-medium">axuora.innovations</span>
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
  tight,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  tight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-[10px] px-[10px] rounded-[6px] cursor-pointer text-[14px] transition-all duration-150 ${
        active ? 'text-[#e1e1e4] bg-white/[0.07]' : 'text-[#78787f] hover:text-[#c7c7cc] hover:bg-[#1c1c1f]'
      } ${tight ? 'py-[5px]' : 'py-[7px]'}`}
    >
      <span className={`w-[18px] h-[18px] flex items-center justify-center shrink-0 ${active ? 'text-[#a1a1a8]' : 'text-[#55555b]'}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {badge && (
        <span className="ml-auto text-[11px] font-medium px-[7px] py-[1px] rounded-[5px] text-[#60A5FA]" style={{ background: 'rgba(59,130,246,0.12)' }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="mt-[18px] mb-[2px] px-[14px] py-[2px] text-[12px] font-medium text-[#55555b] flex items-center justify-between tracking-[0.02em]">
      <span>{label.toUpperCase()}</span>
    </div>
  );
}
