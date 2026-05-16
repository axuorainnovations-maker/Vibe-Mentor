import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Download } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faqs' },
];

const features = [
  {
    title: 'Personalized Courses',
    description: 'Each student gets custom courses built around their own idea. AI generates the curriculum instantly based on what they want to learn or build.',
    details: 'Using Claude AI, we analyze each student\'s interests, age, and goals to create a tailored learning path. No two courses are the same.',
  },
  {
    title: 'Real Projects',
    description: 'Students build actual websites, apps, and brands. Real work, not simulations. Every lesson builds toward a real, shippable project.',
    details: 'From planning to deployment, students learn by doing. Each course results in a real project they can share, showcase, and add to their portfolio.',
  },
  {
    title: 'AI-Powered Guidance',
    description: 'Our Chrome extension watches the student\'s screen and shows exactly where to click, what to type, and how to think through problems.',
    details: 'Real-time cursor animation, voice narration, and click-to-explain features make complex tasks accessible. Three modes: Observe, Guide, Review.',
  },
  {
    title: 'Verifiable Credentials',
    description: 'Certificates tied to real submitted work with public verification. Employers and educators can verify every credential instantly.',
    details: 'Each certificate includes a unique verification code, QR code, and public portfolio page. Blockchain-backed authenticity for maximum trust.',
  },
];

const pricingPlans = [
  {
    name: 'Foundation',
    price: '$0',
    description: 'Free forever',
    features: ['3 foundation courses', '5 tasks per lesson', 'AI-powered feedback', 'Progress tracking', 'Community access'],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Project',
    price: '$12',
    description: 'Per month',
    features: ['Everything in Foundation', 'AI course generation', 'Unlimited projects', 'Chrome extension', 'Certificate verification', 'Priority support'],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Academy',
    price: '$29',
    description: 'Per month',
    features: ['Everything in Project', 'Group learning', 'Admin dashboard', 'Custom branding', 'API access', 'Dedicated support'],
    cta: 'Contact Sales',
    featured: false,
  },
];

const faqs = [
  { q: 'What ages is Vibe Mentor for?', a: 'Vibe Mentor is designed for ages 4-18. Our Foundation track (4-11) focuses on AI literacy through fun, interactive lessons. The Project track (12+) teaches hands-on building with AI tools to create real websites, apps, and brands.' },
  { q: 'Do I need to know how to code?', a: 'Not at all. Vibe Mentor teaches AI literacy from the ground up. Younger students start with basic AI concepts, while older students learn to use AI tools like ChatGPT, Framer, and Bolt.new to build real projects without prior coding experience.' },
  { q: 'How does the Chrome extension work?', a: 'The extension watches your screen as you work and provides real-time guidance. It can animate a cursor to show where to click, narrate instructions via text-to-speech, explain any element you click on, and analyze your progress with AI.' },
  { q: 'Are the certificates actually verifiable?', a: 'Yes. Every certificate has a unique verification code and public URL. Anyone can visit the link to verify the credential is authentic, see the student\'s submitted work, and view the grade. No more fake certificates.' },
  { q: 'Can I use my own AI tools?', a: 'Absolutely. The Project track encourages students to explore various AI tools. We recommend ChatGPT, Claude, Framer, Bolt.new, Canva AI, and many more. The course adapts to the tools you want to use.' },
  { q: 'Is there parent supervision?', a: 'For students ages 4-11, parent consent is required during signup. Parents receive progress reports and can monitor their child\'s learning journey. For ages 12+, students manage their own account.' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-10 w-full transition-all duration-320 ease-smooth
        ${scrolled ? 'max-w-nav-scrolled' : 'max-w-nav'}
        ${mobileOpen ? '!max-w-[calc(100%-24px)]' : ''}
      `}
      style={{ top: '20px', width: mobileOpen ? 'calc(100% - 24px)' : scrolled ? 'min(820px, 100% - 64px)' : 'min(960px, 100% - 32px)' }}
    >
      <div
        className={`rounded-2xl border backdrop-blur-[20px] saturate-[150%] transition-all duration-320 ease-smooth
          ${scrolled ? 'bg-[#0c0c0cdb] border-[#ffffff1a] shadow-nav-scrolled' : 'bg-[#0f0f0fc7] border-[#ffffff14] shadow-nav'}
          ${mobileOpen ? '!bg-[#0f0f0ff0]' : ''}
        `}
      >
        <div className="flex items-center gap-5 p-[6px]">
          <Link to="/" className="inline-flex items-center gap-5 px-5 py-[4px] rounded-md hover:bg-[#ffffff14] transition-colors duration-instant">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="flex-none">
              <rect width="28" height="28" rx="7" fill="#6366F1"/>
              <text x="14" y="19" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Geist, sans-serif">V</text>
            </svg>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">Vibe Mentor</span>
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-[2px]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center h-[34px] px-[12px] text-[14px] font-medium text-white rounded-md hover:bg-[#ffffff14] transition-colors duration-instant whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button className="inline-flex items-center gap-[6px] h-[34px] px-[12px] text-[14px] font-medium text-white rounded-md hover:bg-[#ffffff14] transition-colors duration-instant whitespace-nowrap">
                <span>Resources</span>
                <ChevronDown size={10} className="opacity-70 transition-transform duration-fast" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-20 min-w-[160px] p-[6px] flex flex-col bg-[#0f0f0ff0] backdrop-blur-[20px] saturate-[150%] border border-[#ffffff14] rounded-xl shadow-dropdown">
                  <a href="#" className="block px-[12px] py-[8px] text-[14px] font-medium text-white rounded-md hover:bg-[#ffffff14] transition-colors duration-instant whitespace-nowrap">Blog</a>
                  <a href="#" className="block px-[12px] py-[8px] text-[14px] font-medium text-white rounded-md hover:bg-[#ffffff14] transition-colors duration-instant whitespace-nowrap">Changelog</a>
                </div>
              )}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-[6px]">
            <Link to="/signup" className="inline-flex items-center justify-center h-[34px] px-[14px] gap-[8px] text-[13px] font-medium text-[#0f0f0f] bg-white border border-transparent rounded-md whitespace-nowrap hover:bg-[#ffffffe6] transition-colors duration-instant relative">
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden inline-flex items-center justify-center w-[36px] h-[36px] rounded-pill hover:bg-[#ffffff14] transition-colors duration-fast ml-auto"
          >
            {mobileOpen ? <X size="18" /> : <Menu size="18" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="flex flex-col opacity-100 max-h-[min(80vh,560px)] pb-[12px] border-t border-[#ffffff14] transition-all duration-slow">
            <div className="flex flex-col px-[12px]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-[12px] text-[15px] font-medium text-white border-b border-[#ffffff0f]"
                >
                  {link.label}
                </a>
              ))}
              <a href="#" className="py-[12px] text-[15px] font-medium text-white border-b border-[#ffffff0f]">Blog</a>
              <a href="#" className="py-[12px] text-[15px] font-medium text-white border-b border-[#ffffff0f]">Changelog</a>
            </div>
            <div className="flex items-center gap-[6px] px-[12px] pt-[12px]">
              <Link to="/login" className="flex-1 inline-flex items-center justify-center h-[34px] px-[14px] text-[13px] font-medium text-white border border-[#ffffff24] rounded-md transition-all duration-150 active:scale-[0.97] hover:bg-white/5">Sign in</Link>
              <Link to="/signup" className="flex-1 inline-flex items-center justify-center h-[34px] px-[14px] gap-[6px] text-[13px] font-medium text-[#0f0f0f] bg-white rounded-md transition-all duration-150 active:scale-[0.97] hover:bg-white/90">Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function FeatureRow({ feature, index, activeIndex, onToggle }: {
  feature: typeof features[0];
  index: number;
  activeIndex: number;
  onToggle: () => void;
}) {
  const isActive = activeIndex === index;
  return (
    <div className={`border-t border-[#ffffff14] ${index === 0 ? 'border-t-0' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full text-left bg-transparent border-0 cursor-pointer text-inherit font-inherit"
      >
        <div className="py-[22px] px-0">
          <span className={`block text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.045em] transition-colors duration-280 ${isActive ? 'text-white' : 'text-[#ffffff6b]'}`}>
            {feature.title}
          </span>
        </div>
        <div
          className="grid transition-all duration-[420ms] ease-smooth"
          style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className={`transition-all duration-[360ms] ease-smooth ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
              <p className="text-[#fff9] text-[1rem] leading-[1.55] m-0 max-w-[56ch] pb-[22px]">
                {isActive ? feature.details : feature.description}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-observe]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-page text-white" style={{ background: 'radial-gradient(circle at top, #5a5a5a0f, transparent 42%), #0f0f0f' }}>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.36]" style={{ backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMCIgLz48L3N2Zz4=)' }} />

      <Navbar />

      <main className="flex-1 w-full max-w-content mx-auto px-[24px]" style={{ paddingTop: '124px', paddingBottom: '88px' }}>
        <section className="grid grid-cols-1 place-items-center text-center gap-[40px] px-0 py-[28px]" style={{ gridTemplateAreas: '"copy" "shot"' }}>
          <div className="grid justify-items-center content-center gap-[18px] max-w-hero" style={{ gridArea: 'copy' }}>
            <h1 className="text-[clamp(2.4rem,4.4vw,4rem)] font-medium tracking-[-0.055em] leading-[1.04] whitespace-nowrap mb-[4px] max-[640px]:whitespace-normal max-[640px]:max-w-[10ch]">
              <span className="inline-block mr-[.28em] animate-enter" style={{ animationDelay: 'calc(60ms * 1)' }}>Learn</span>
              <span className="inline-block mr-[.28em] animate-enter" style={{ animationDelay: 'calc(60ms * 2)' }}>to</span>
              <span className="inline-block mr-[.28em] animate-enter" style={{ animationDelay: 'calc(60ms * 3)' }}>Command</span>
              <span className="inline-block mr-[.28em] animate-enter" style={{ animationDelay: 'calc(60ms * 4)' }}>AI</span>
            </h1>
            <p className="text-[#ffffffad] text-[clamp(1rem,1.4vw,1.18rem)] leading-[1.5] max-w-[60ch] text-pretty m-0 animate-enter" style={{ animationDelay: 'calc(60ms * 5)' }}>
              Real learning through real projects with real-time AI guidance.
              Students build actual websites, apps, and brands.
            </p>
            <div className="flex flex-wrap gap-[14px] mt-[8px] justify-center animate-enter" style={{ animationDelay: 'calc(60ms * 6)' }}>
              <div className="grid justify-items-center gap-[12px] relative">
                <Link
                  to="/signup"
                  className="inline-flex relative items-center justify-center gap-[8px] min-h-[44px] px-[24px] pr-[20px] text-[14px] font-medium text-[#0f0f0f] bg-white border border-[#ffffff24] rounded-pill transition-colors duration-fast hover:bg-[#ffffffe6]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
                  </svg>
                  <span>Download MacOS</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-start w-full max-w-[880px] min-w-0 min-h-0 animate-enter" style={{ animationDelay: 'calc(60ms * 7)', gridArea: 'shot' }}>
            <div className="aspect-video bg-[#ffffff04] border border-[#ffffff24] rounded-3xl flex-1 w-full min-h-0 relative overflow-hidden shadow-frame">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg width="48" height="48" viewBox="0 0 28 28" fill="none" className="mx-auto mb-3 opacity-50">
                    <rect width="28" height="28" rx="7" fill="#6366F1"/>
                    <text x="14" y="19" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Geist, sans-serif">V</text>
                  </svg>
                  <p className="text-[#ffffff7a] text-sm">Your AI learning journey starts here</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center text-center gap-[20px] py-[56px] px-0 pb-[24px]">
          <p className="text-[17px] font-medium text-[#ffffffa6] tracking-[0.02em]">Trusted by founders at</p>
          <div className="flex flex-wrap justify-center gap-[22px] max-[640px]:gap-[14px]">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="w-[80px] h-[80px] max-[640px]:w-[64px] max-[640px]:h-[64px] rounded-4xl bg-[#141414cc] border border-[#ffffff14] flex items-center justify-center text-[#ffffff7a] text-xs font-medium shadow-avatar hover:-translate-y-0.5 transition-transform duration-fast" style={{ borderRadius: '18px', maxWidth: '640px' }}>
                Logo {i}
              </div>
            ))}
          </div>
        </section>

        <section id="features" data-observe className="mt-42 scroll-mt-[100px]"
          style={{
            opacity: visibleSections.has('features') ? 1 : 0,
            transform: visibleSections.has('features') ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity .6s cubic-bezier(.25,.46,.45,.94), transform .6s cubic-bezier(.25,.46,.45,.94)',
          }}
        >
          <div className="flex flex-col items-center gap-[14px] max-w-feature mx-auto mb-[72px] text-center">
            <p className="text-[#ffffffb8] text-[clamp(1rem,1.4vw,1.18rem)] font-medium tracking-[-0.01em]">Features</p>
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-medium tracking-[-0.045em] leading-[1.05]">Everything you need to learn with AI</h2>
          </div>

          <div className="grid items-start gap-24 max-md:gap-8 max-sm:gap-6 max-w-[900px] lg:grid-cols-[0.9fr_1.1fr] max-lg:grid-cols-1">
            <div className="max-[900px]:hidden">
              <div className="aspect-[4/3] w-full sticky top-[100px] overflow-hidden rounded-8xl border border-[#ffffff14] shadow-card"
                style={{ background: 'radial-gradient(circle at 30% 15%, #ffffff0d, transparent 55%), #ffffff04' }}>
                {features.map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex items-center justify-center p-[36px] transition-all duration-[360ms] ease-smooth"
                    style={{
                      opacity: activeFeature === i ? 1 : 0,
                      transform: activeFeature === i ? 'translateY(0)' : 'translateY(8px)',
                    }}
                  >
                    <div className="aspect-[9/19.5] h-full max-h-full bg-[#060606] border border-[#ffffff14] rounded-7xl overflow-hidden shadow-mini-screen flex items-center justify-center"
                      style={{ aspectRatio: '9/19.5' }}
                    >
                      <span className="text-[#ffffff7a] text-xs">Feature {i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {features.map((feature, i) => (
                <FeatureRow
                  key={i}
                  feature={feature}
                  index={i}
                  activeIndex={activeFeature}
                  onToggle={() => setActiveFeature(activeFeature === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" data-observe className="mt-42 scroll-mt-[100px]"
          style={{
            opacity: visibleSections.has('pricing') ? 1 : 0,
            transition: 'opacity .6s cubic-bezier(.25,.46,.45,.94), transform .6s cubic-bezier(.25,.46,.45,.94)',
          }}
        >
          <div className="flex flex-col items-center gap-[14px] max-w-feature mx-auto mb-[72px] text-center">
            <p className="text-[#ffffffb8] text-[clamp(1rem,1.4vw,1.18rem)] font-medium tracking-[-0.01em]">Pricing</p>
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-medium tracking-[-0.045em] leading-[1.05]">Simple, transparent pricing</h2>
          </div>

          <div className="grid gap-[16px] w-full max-w-pricing mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className="relative rounded-2xl transition-all duration-280"
                style={{
                  background: plan.featured
                    ? 'linear-gradient(#ffffff16, #ffffff08, #ffffff03)'
                    : 'linear-gradient(#ffffff0b, #ffffff04, #ffffff01)',
                  boxShadow: plan.featured
                    ? '0 8px 32px -4px #000000b3'
                    : '0 4px 24px -4px #0000008c, inset 0 1px #ffffff05',
                  transform: 'translateY(0)',
                  opacity: 1,
                  animation: visibleSections.has('pricing') ? '.55s forwards pricing-card-in' : 'none',
                  animationDelay: `${i * 80 + 50}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px -6px #000000a6, inset 0 1px #ffffff0a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = plan.featured
                    ? '0 8px 32px -4px #000000b3'
                    : '0 4px 24px -4px #0000008c, inset 0 1px #ffffff05';
                }}
              >
                <div className="flex flex-col gap-[22px] p-[28px_26px] relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[1.0625rem] font-semibold tracking-[-0.01em]">{plan.name}</span>
                    {plan.featured && (
                      <span className="h-[22px] px-[9px] inline-flex items-center rounded-pill bg-[#ffffff1a] text-[.6875rem] font-semibold tracking-[0.06em] uppercase">
                        Popular
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[clamp(2.25rem,2.8vw,2.75rem)] font-bold tracking-[-0.05em] leading-[1]">{plan.price}</span>
                    <span className="text-[#ffffffb8] ml-1">{plan.description}</span>
                  </div>
                  <button
                    className={`w-full h-[40px] rounded-pill text-[.9375rem] font-medium flex items-center justify-center gap-[8px] border-0 relative overflow-hidden transition-all duration-normal ${
                      plan.featured
                        ? 'text-[#0a0a0a]' : 'text-white bg-[#ffffff0d] hover:bg-[#ffffff17]'
                    }`}
                    style={plan.featured ? { background: 'linear-gradient(#fff, #d8d8d8)' } : {}}
                  >
                    {plan.cta}
                  </button>
                  <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, #ffffff1a, transparent)' }} />
                  <ul className="flex flex-col gap-[12px] list-none m-0 p-0">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-[10px] text-[#ffffffb8] text-[.875rem]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white flex-none">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faqs" data-observe className="mt-42 scroll-mt-[100px]"
          style={{
            opacity: visibleSections.has('faqs') ? 1 : 0,
            transition: 'opacity .6s cubic-bezier(.25,.46,.45,.94), transform .6s cubic-bezier(.25,.46,.45,.94)',
          }}
        >
          <div className="flex flex-col items-center gap-[14px] max-w-feature mx-auto mb-[56px] text-center">
            <p className="text-[#ffffffb8] text-[clamp(1rem,1.4vw,1.18rem)] font-medium tracking-[-0.01em]">FAQ</p>
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-medium tracking-[-0.045em] leading-[1.05]">Frequently asked questions</h2>
          </div>

          <div className="flex flex-col w-full max-w-faq mx-auto border-t border-[#ffffff14]">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-[#ffffff14]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full justify-between items-center gap-[24px] max-[640px]:gap-[16px] py-[26px] px-[4px] max-[640px]:py-[22px] bg-transparent border-0 cursor-pointer text-inherit font-inherit"
                  style={{ color: openFaq === i ? '#fff' : '#ffffff8c' }}
                >
                  <span className="text-[1.0625rem] max-[640px]:text-[1rem] font-medium tracking-[-0.005em] leading-[1.4] text-left">{faq.q}</span>
                  <div className="w-[18px] h-[18px] relative flex-none" style={{ color: openFaq === i ? '#ffffffd9' : '#ffffff73' }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[14px] h-[1.5px] rounded-[1px] bg-current" />
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1.5px] h-[14px] rounded-[1px] bg-current transition-transform duration-280 ease-smooth ${openFaq === i ? 'rotate-45' : ''}`} />
                  </div>
                </button>
                <div className="grid transition-all duration-[320ms] ease-smooth" style={{ gridTemplateRows: openFaq === i ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <p className={`text-[#fff9] text-[1rem] max-[640px]:text-[.95rem] leading-[1.65] max-w-[70ch] px-[4px] pb-[28px] max-[640px]:pb-[22px] transition-all duration-[260ms] ease-smooth ${openFaq === i ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid text-center justify-items-center gap-[20px] mt-[92px] py-[28px] px-0 pb-[56px]">
          <div className="text-[clamp(2.1rem,3.25vw,3.2rem)] font-medium tracking-[-0.055em] leading-[1.04]">
            <span className={`block transition-all duration-[700ms] ease-smooth ${visibleSections.has('faqs') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}>
              Ready to command AI?
            </span>
            <span className={`block transition-all duration-[700ms] ease-smooth delay-[120ms] ${visibleSections.has('faqs') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'}`}>
              Start building today.
            </span>
          </div>
          <div className={`transition-all duration-[700ms] delay-[320ms] ${visibleSections.has('faqs') ? 'opacity-100' : 'opacity-0'}`}>
            <Link
              to="/signup"
              className="inline-flex relative items-center justify-center min-h-[44px] px-[24px] gap-[8px] text-[14px] font-medium text-[#0f0f0f] bg-white border border-[#ffffff24] rounded-pill hover:bg-[#ffffffe6] transition-all duration-fast"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
              </svg>
              Download MacOS
            </Link>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-[36px] px-[24px] py-24 relative mt-auto" style={{ paddingTop: '64px', paddingBottom: 'calc(32px + env(safe-area-inset-bottom))' }}>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#ffffff14]" />

        <div className="w-full max-w-content mx-auto">
          <div className="grid items-start gap-24" style={{ gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,2fr)' }}>
            <div className="flex flex-col gap-[14px] max-w-[280px]">
              <a href="/" className="opacity-[.92] inline-flex items-center gap-[10px] w-fit px-0">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="flex-none">
                  <rect width="28" height="28" rx="7" fill="#6366F1"/>
                  <text x="14" y="19" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Geist, sans-serif">V</text>
                </svg>
                <span className="text-[15px] font-semibold tracking-[-0.01em]">Vibe Mentor</span>
              </a>
              <p className="text-[#ffffff7a] text-[.9375rem] leading-[1.5] m-0">
                Teaching the next generation to command AI, not depend on it.
              </p>
            </div>
            <div className="grid gap-20 max-[1100px]:gap-[32px] max-[640px]:gap-[24px]"
              style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
            >
              {[
                { title: 'Product', links: ['Features', 'Pricing', 'FAQ', 'Changelog'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
                { title: 'Resources', links: ['Documentation', 'Tutorials', 'Community', 'Support'] },
                { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'Licenses'] },
              ].map((col) => (
                <div key={col.title} className="flex flex-col gap-[14px]">
                  <span className="text-[.6875rem] font-semibold tracking-[0.12em] uppercase text-[#ffffff7a]">{col.title}</span>
                  {col.links.map((link) => (
                    <a key={link} href="#" className="text-[.9375rem] text-[#ffffffb8] hover:text-white transition-colors duration-fast">{link}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#ffffff0f] flex justify-between items-center gap-[20px] pt-[24px] mt-[36px]">
            <span className="text-[.8125rem] text-[#ffffff7a]">&copy; 2026 Vibe Mentor. All rights reserved.</span>
            <div className="flex items-center gap-[28px]">
              <a href="#" className="text-[.8125rem] text-[#ffffff7a] hover:text-white transition-colors duration-fast">Privacy</a>
              <a href="#" className="text-[.8125rem] text-[#ffffff7a] hover:text-white transition-colors duration-fast">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
