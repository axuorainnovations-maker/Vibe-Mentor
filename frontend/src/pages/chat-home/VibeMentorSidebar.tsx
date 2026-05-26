const navItems = [
  {
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" />
      </svg>
    ),
  },
  {
    label: 'Courses',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v3H4z" />
        <path d="M4 8v9a2 2 0 0 0 2 2h6" />
        <path d="M12 14l4 2 4-2v-3l-4 2-4-2z" />
      </svg>
    ),
  },
  {
    label: 'Search',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
];

export default function VibeMentorSidebar() {
  return (
    <aside
      style={{
        width: '248px',
        background: '#0c0c0d',
        borderRight: '1px solid #151517',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px 8px 10px',
        flexShrink: 0,
        height: '100vh',
      }}
    >
      <div>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px 14px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px', color: '#e6e6e6' }}>
            <path d="M7 4 L14 12 L7 20" />
            <path d="M17 4 L10 12 L17 20" />
          </svg>
          <button
            title="Collapse"
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 0,
              color: '#6b6b73',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="14" y="16" width="36" height="32" rx="6" ry="6" fill="none" stroke="#a0a0a0" strokeWidth="2.5" />
              <rect x="18" y="20" width="8" height="24" rx="1.5" ry="1.5" fill="#a0a0a0" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        {navItems.map((item, i) => (
          <a
            key={item.label}
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 10px',
              margin: '0 4px',
              borderRadius: '8px',
              fontSize: '13.8px',
              color: i === 0 ? '#fff' : '#d4d4d8',
              textDecoration: 'none',
              background: i === 0 ? '#1b1b1f' : 'transparent',
            }}
          >
            <span style={{ width: '18px', height: '18px', color: i === 0 ? '#fff' : '#b4b4bb', flexShrink: 0 }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}

        {/* Section label */}
        <div style={{ fontSize: '13.5px', color: '#8b8b92', padding: '0 14px 8px', fontWeight: 500, marginTop: '8px' }}>
          Projects
        </div>

        {/* Project */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 10px',
            margin: '0 4px',
            borderRadius: '8px',
            color: '#9ca3af',
            fontSize: '13.3px',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" style={{ width: '16px', height: '16px', color: '#7a7a84', flexShrink: 0 }}>
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
          </svg>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#a1a1aa' }}>
            i want to build duolin...
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', margin: '4px 4px 2px', borderRadius: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#222227',
              display: 'grid',
              placeItems: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#c7c7cf',
              border: '1px solid #2a2a2e',
              flexShrink: 0,
            }}
          >
            JL
          </div>
          <div style={{ lineHeight: '1.15' }}>
            <div style={{ fontSize: '13.5px', color: '#d4d4d8' }}>Jayden Liew</div>
            <div style={{ fontSize: '12px', color: '#6f6f78', marginTop: '2px' }}>Free</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
