import React from 'react';

const FileTextSVG = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);


interface AuthLayoutProps {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
  maxWidth?: string;
}

export default function AuthLayout({ children, title, subtitle, maxWidth = "max-w-md" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side: Hero (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-secondary">
        <img 
          src="/auth-hero.png" 
          alt="Auth Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-center h-full max-w-2xl">
          <div className="flex items-center gap-4 mb-12 group">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.4)] transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <FileTextSVG className="text-slate-950 w-7 h-7" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-white">
              Invoice<span className="text-primary">Gen</span>
            </h2>
          </div>
          
          <h1 className="text-6xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            Streamline your <br />
            <span className="text-primary font-outline">Invoicing</span> <br />
            effortlessly.
          </h1>
          
          <p className="text-xl text-white/70 font-medium leading-relaxed max-w-md">
            The ultimate tool for modern businesses to manage clients, track expenses, and generate professional invoices in seconds.
          </p>
          
          <div className="mt-16 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-secondary bg-surface overflow-hidden hover:translate-y-[-4px] transition-transform duration-300 shadow-xl">
                    <img src={`https://i.pravatar.cc/150?u=auth${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-bold">Trusted by 2,500+ users</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 text-primary fill-primary" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 relative bg-background">
        {/* Mobile Logo */}
        <div className="md:hidden absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <FileTextSVG className="text-secondary w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Invoice<span className="text-primary">Gen</span>
          </h2>
        </div>
        
        <div className={`w-full ${maxWidth} animate-slideUp`}>
          <div className="mb-12 text-center pt-16 md:pt-0">
            <h2 className="text-5xl font-black tracking-tighter mb-4 text-foreground leading-tight mx-auto">
              {title}
            </h2>
            <p className="text-muted font-semibold text-lg max-w-sm mx-auto">
              {subtitle}
            </p>
          </div>
          
          <div className="relative group">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
