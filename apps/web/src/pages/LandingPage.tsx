import { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        weight: '',
        height: '',
        gender: '',
        goal: '',
        plan: '',
        experienceLevel: '',
        availability: '',
        medicalConditions: '',
        contactPreference: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            await fetch(`${apiUrl}/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    age: formData.age,
                    weight: formData.weight,
                    height: formData.height,
                    gender: formData.gender,
                    goal: formData.goal,
                    plan: formData.plan,
                    experience_level: formData.experienceLevel,
                    availability: formData.availability,
                    medical_conditions: formData.medicalConditions,
                    contact_preference: formData.contactPreference,
                }),
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit form', error);
            alert('Error al enviar el formulario. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-background-dark text-white font-body overflow-x-hidden selection:bg-primary selection:text-background-dark">
            {/* ========== NAVIGATION ========== */}
            <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-background-dark/70 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-primary text-3xl group-hover:rotate-12 transition-transform">◆</span>
                        <span className="font-display font-bold text-xl tracking-wide text-white">YEIMI RAMIREZ</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#inicio" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Inicio</a>
                        <a href="#servicios" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Servicios</a>
                        <a href="#programas" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Programas</a>
                        <a href="#testimonios" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors">Sobre Mí</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/auth/login"
                            className="hidden md:flex items-center justify-center h-10 px-6 rounded-full border border-primary/50 text-primary hover:bg-primary hover:text-background-dark transition-all duration-300 text-sm font-bold"
                        >
                            Login
                        </Link>
                        <button
                            onClick={() => { setShowForm(true); document.getElementById('inscripcion')?.scrollIntoView({ behavior: 'smooth' }); }}
                            className="hidden md:flex items-center justify-center h-10 px-6 rounded-full bg-gradient-to-r from-primary to-secondary text-background-dark text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
                        >
                            Unirse
                        </button>
                    </div>
                </div>
            </nav>

            {/* ========== HERO ========== */}
            <header id="inicio" className="relative min-h-screen pt-24 pb-12 px-6 flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-nebula-gradient pointer-events-none -z-10" />
                <div className="absolute inset-0 opacity-30 pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                <div className="max-w-7xl w-full mx-auto relative z-10">
                    <div className="border border-primary/30 rounded-3xl p-6 md:p-12 relative backdrop-blur-[2px]">
                        {/* Corner decorations */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-primary" />
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-primary" />
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-primary" />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-primary" />

                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                            <div className="flex-1 text-center lg:text-left space-y-8">
                                <div>
                                    <h2 className="text-secondary text-sm font-medium tracking-[0.2em] uppercase mb-4 animate-pulse">Transformación y Bienestar</h2>
                                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white mb-2">
                                        COACH <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary" style={{ textShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}>
                                            YEIMI RAMIREZ
                                        </span>
                                    </h1>
                                </div>
                                <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                                    Eleva tu físico y mentalidad a través de un enfoque basado en la ciencia, diseñado para el individuo moderno y disciplinado. Tu transformación comienza hoy.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                    <button
                                        onClick={() => { setShowForm(true); document.getElementById('inscripcion')?.scrollIntoView({ behavior: 'smooth' }); }}
                                        className="h-14 px-8 rounded-lg bg-gradient-to-r from-primary to-secondary text-background-dark font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <span>Empieza Tu Transformación</span>
                                        <span>→</span>
                                    </button>
                                    <a href="#testimonios" className="h-14 px-8 rounded-lg border border-primary/40 text-primary font-medium text-lg hover:bg-primary/10 transition-colors flex items-center justify-center">
                                        Ver Casos de Éxito
                                    </a>
                                </div>
                            </div>

                            <div className="flex-1 w-full max-w-lg lg:max-w-xl relative">
                                <div className="relative rounded-t-full rounded-b-3xl overflow-hidden border-2 border-white/10 shadow-2xl shadow-primary/10 aspect-[3/4] group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10 opacity-60" />
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCF6j-0e-HEIHeYPZU-VkGRZI1dVuwsTzJnz0ao7uUZ_lg5Xz1e8IUDeoTBnT5DznZ6kM3WaKqDNiqTg8zDAqIz1X95B0qlviKCv2ylecmkpOKL4Xg1d4cInpC_iFLvSRvobGj_cPt7p98dFYWn2mywKoomM8bZt0LztRrmKEuVv5x9XzUXNwaR5iA48KGdws5CKM-dZ6wY_TFD9z-EetT3hmL7FP0LDHjeUe7PsB4l73M3ZTgWcR8VWRJ_eavwEAdHdKHur_RBFZqG")' }}
                                    />
                                    <div className="absolute bottom-6 left-6 right-6 z-20 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-4">
                                        <div className="bg-primary/20 p-2 rounded-full text-primary text-2xl">💪</div>
                                        <div>
                                            <p className="text-xs text-secondary uppercase tracking-wider">Enfoque Actual</p>
                                            <p className="font-display text-white font-semibold">Fuerza y Movilidad</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ========== PROGRESS SECTION ========== */}
            <section id="servicios" className="py-20 px-6 bg-surface-dark/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="text-xl">📊</span>
                            <span className="text-sm font-bold uppercase tracking-wider">Resultados Basados en Datos</span>
                        </div>
                        <h3 className="font-display text-4xl md:text-5xl font-bold">Progreso Que Puedes Ver</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Rastreamos más que solo el peso. Monitoreamos la composición corporal, ganancias de fuerza y salud metabólica para asegurar que estás construyendo el tejido correcto.
                        </p>
                        <div className="flex gap-8 pt-4">
                            <div>
                                <p className="text-3xl font-display font-bold text-white">+12%</p>
                                <p className="text-sm text-gray-400">Masa Muscular</p>
                            </div>
                            <div>
                                <p className="text-3xl font-display font-bold text-white">-8%</p>
                                <p className="text-sm text-gray-400">Grasa Corporal</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full bg-card-glass border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-secondary text-sm mb-1">Análisis de 6 Meses</p>
                                <p className="text-2xl font-bold font-display">Peso vs. Masa Muscular</p>
                            </div>
                            <div className="flex gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-primary" />
                                    <span className="text-gray-300">Músculo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-gray-600" />
                                    <span className="text-gray-300">Peso</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-64 relative">
                            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                                {[0, 50, 100, 150, 200].map(y => (
                                    <line key={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4" x1="0" x2="500" y1={y} y2={y} />
                                ))}
                                <path d="M0,80 C100,80 150,90 250,110 C350,130 400,140 500,145" fill="none" stroke="#6b7280" strokeWidth="2" />
                                <defs>
                                    <linearGradient id="muscleGradient" x1="0%" x2="100%">
                                        <stop offset="0%" style={{ stopColor: '#d4af37', stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: '#e2b4bd', stopOpacity: 1 }} />
                                    </linearGradient>
                                    <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#d4af37" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#d4af37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <path d="M0,150 C100,140 150,100 250,80 C350,60 400,30 500,20 V200 H0 Z" fill="url(#areaGradient)" />
                                <path d="M0,150 C100,140 150,100 250,80 C350,60 400,30 500,20" fill="none" stroke="url(#muscleGradient)" strokeLinecap="round" strokeWidth="4" />
                                <circle cx="0" cy="150" fill="#1a0b2e" r="4" stroke="#d4af37" strokeWidth="2" />
                                <circle cx="250" cy="80" fill="#1a0b2e" r="4" stroke="#d4af37" strokeWidth="2" />
                                <circle cx="500" cy="20" fill="#d4af37" r="6" stroke="#fff" strokeWidth="2" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== PRICING ========== */}
            <section id="programas" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">Invierte en Ti</span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Elige Tu Programa</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Basic */}
                        <div className="group relative p-8 rounded-2xl bg-card-glass backdrop-blur-md border border-white/10 transition-all duration-300 hover:border-primary hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-white font-bold text-xl tracking-wider mb-2">BÁSICO</h3>
                                <div className="flex items-baseline gap-1 text-primary">
                                    <span className="text-sm font-light">RD$</span>
                                    <span className="text-4xl font-display font-bold">1,200</span>
                                    <span className="text-sm text-gray-400">/mes</span>
                                </div>
                            </div>
                            <div className="space-y-4 mb-8 flex-grow">
                                {['Plan de Entrenamiento Estándar', 'Acceso a la Comunidad', 'Guía de Video Mensual'].map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-primary text-lg">✓</span>
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => { setFormData(prev => ({ ...prev, plan: 'BÁSICO' })); setShowForm(true); document.getElementById('inscripcion')?.scrollIntoView({ behavior: 'smooth' }); }}
                                className="w-full py-3 rounded-lg border border-white/20 hover:bg-white/5 text-white font-medium transition-colors"
                            >
                                Seleccionar Básico
                            </button>
                        </div>

                        {/* Intermediate */}
                        <div className="group relative p-8 rounded-2xl bg-card-glass backdrop-blur-md border border-white/10 transition-all duration-300 hover:border-primary hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="text-primary opacity-50 group-hover:opacity-100 transition-opacity text-xl">⭐</span>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-white font-bold text-xl tracking-wider mb-2">INTERMEDIO</h3>
                                <div className="flex items-baseline gap-1 text-primary">
                                    <span className="text-sm font-light">RD$</span>
                                    <span className="text-4xl font-display font-bold">2,000</span>
                                    <span className="text-sm text-gray-400">/mes</span>
                                </div>
                            </div>
                            <div className="space-y-4 mb-8 flex-grow">
                                {['Plan de Entrenamiento Personalizado', 'Guía de Macros y Nutrición', 'Chequeos Quincenales', 'Video de Corrección de Técnica'].map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-primary text-lg">✓</span>
                                        <span className="text-sm text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => { setFormData(prev => ({ ...prev, plan: 'INTERMEDIO' })); setShowForm(true); document.getElementById('inscripcion')?.scrollIntoView({ behavior: 'smooth' }); }}
                                className="w-full py-3 rounded-lg bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-background-dark font-bold transition-all duration-300"
                            >
                                Seleccionar Intermedio
                            </button>
                        </div>

                        {/* Premium */}
                        <div className="group relative p-8 rounded-2xl bg-gradient-to-b from-[#2a163d] to-[#1a0b2e] border border-primary/30 transition-all duration-300 hover:border-primary hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(212,175,55,0.25)] flex flex-col">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-background-dark text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                                MÁS POPULAR
                            </div>
                            <div className="mb-6">
                                <h3 className="text-white font-bold text-xl tracking-wider mb-2">PREMIUM 1-1</h3>
                                <div className="flex items-baseline gap-1 text-primary">
                                    <span className="text-4xl font-display font-bold">A Medida</span>
                                    <span className="text-sm text-gray-400">/precio</span>
                                </div>
                            </div>
                            <div className="space-y-4 mb-8 flex-grow">
                                {['Coaching Completo 1 a 1', 'Soporte por WhatsApp 24/7', 'Planes de Comida Personalizados', 'Llamadas de Estrategia Semanales', 'Coaching de Hábitos y Estilo de Vida'].map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="text-secondary text-lg">✦</span>
                                        <span className="text-sm text-white font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => { setFormData(prev => ({ ...prev, plan: 'PREMIUM 1-1' })); setShowForm(true); document.getElementById('inscripcion')?.scrollIntoView({ behavior: 'smooth' }); }}
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-background-dark font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300"
                            >
                                Aplicar para Premium
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== TESTIMONIAL ========== */}
            <section id="testimonios" className="py-24 px-6 bg-surface-dark border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="text-6xl text-primary mb-6 block">❝</span>
                    <h3 className="font-display text-2xl md:text-4xl font-medium leading-relaxed italic text-white mb-10">
                        "Redescubrí mi fuerza a través del enfoque científico de Yeimi. No es solo entrenamiento; es una elevación completa del estilo de vida que respeta mi tiempo y ambiciones."
                    </h3>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-primary p-1">
                            <div
                                className="w-full h-full rounded-full bg-cover bg-center"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBn8PIuSnIdZmV2tWqzKwAJuRKPPyPO7ubfH8ksRU8mqErM4wMuNWqfyxohSNqHO2hGNpAl6eOYHb3c7LnOWyBBpLiSdFnHzwYM3lFiof_cZ1n9hSEBDWzPx8azmOtMLu2Arf4cMBI3nou1iRVW5yIcUUSrI3ZLqPqHDSOa7MYgoW8tYXiTzG1I7fj3ksdnCvuHaWPz7zacJp7pdh-jEXuL6wY4FG5Mqx2b2r0ai2tSIeSzfYsfMwIdoONRh-9b14DNQzeDcLY5ed7R")' }}
                            />
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg">Sarah Jenkins</p>
                            <p className="text-secondary text-sm">Programa de Transformación • 6 Meses</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== REGISTRATION FORM ========== */}
            <section id="inscripcion" className="py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] pointer-events-none" />

                <div className="max-w-[800px] mx-auto relative z-10">
                    {!showForm ? (
                        /* CTA to open form */
                        <div className="relative rounded-3xl p-10 md:p-16 text-center border border-primary/30 bg-card-glass backdrop-blur-xl shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/50 rounded-tl-3xl" />
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/50 rounded-br-3xl" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-3xl rounded-full pointer-events-none" />
                            <div className="relative z-10 space-y-8">
                                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    ¿Lista para comenzar <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary" style={{ textShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}>
                                        tu transformación?
                                    </span>
                                </h2>
                                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                                    No esperes al "momento perfecto". El momento es ahora. Únete a un grupo exclusivo de mujeres que están redefiniendo sus límites.
                                </p>
                                <div className="pt-4">
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="px-10 py-5 rounded-full bg-gradient-to-r from-primary to-secondary text-background-dark font-bold text-xl shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
                                    >
                                        <span>Inscribirme Ahora</span>
                                        <span>→</span>
                                    </button>
                                    <p className="mt-4 text-sm text-gray-500 uppercase tracking-widest">Plazas limitadas para este mes</p>
                                </div>
                            </div>
                        </div>
                    ) : submitted ? (
                        /* Success state */
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 md:p-16 text-center shadow-2xl animate-fade-in">
                            <div className="text-6xl mb-6">🎉</div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">¡Inscripción Enviada!</h2>
                            <p className="text-gray-300 text-lg max-w-md mx-auto mb-8">
                                Gracias por tu interés. Nos pondremos en contacto contigo pronto para iniciar tu transformación.
                            </p>
                            <button
                                onClick={() => { setSubmitted(false); setShowForm(false); setFormData({ fullName: '', email: '', phone: '', age: '', weight: '', height: '', gender: '', goal: '', plan: '', experienceLevel: '', availability: '', medicalConditions: '', contactPreference: '' }); }}
                                className="px-8 py-3 rounded-lg border border-primary/40 text-primary font-medium hover:bg-primary/10 transition-colors"
                            >
                                Volver al Inicio
                            </button>
                        </div>
                    ) : (
                        /* Registration Form */
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl animate-fade-in">
                            {/* Progress */}
                            <div className="flex flex-col gap-2 mb-8">
                                <div className="flex justify-between items-center text-xs uppercase tracking-widest text-primary font-bold">
                                    <span>Inscripción</span>
                                    <span>Coach Yeimi</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-secondary w-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                </div>
                            </div>

                            {/* Form Header */}
                            <div className="text-center mb-10">
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Formulario de Inscripción</h2>
                                <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto">
                                    Completa tu perfil para diseñar un plan personalizado que se adapte a tus necesidades y estilo de vida.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                                {/* ---- Personal Data ---- */}
                                <div className="space-y-4">
                                    <h3 className="text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                        👤 Datos Personales
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Nombre completo *</span>
                                            <input name="fullName" value={formData.fullName} onChange={handleChange} required
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all w-full"
                                                placeholder="Ej. Maria Gonzalez" type="text" />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Email *</span>
                                            <input name="email" value={formData.email} onChange={handleChange} required
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all w-full"
                                                placeholder="ejemplo@correo.com" type="email" />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Teléfono (WhatsApp) *</span>
                                            <input name="phone" value={formData.phone} onChange={handleChange} required
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all w-full"
                                                placeholder="+1 (809) 000-0000" type="tel" />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Género</span>
                                            <select name="gender" value={formData.gender} onChange={handleChange}
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white outline-none transition-all w-full appearance-none cursor-pointer">
                                                <option value="" className="bg-surface-dark">Seleccionar</option>
                                                <option value="femenino" className="bg-surface-dark">Femenino</option>
                                                <option value="masculino" className="bg-surface-dark">Masculino</option>
                                                <option value="otro" className="bg-surface-dark">Otro</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                {/* ---- Fitness Profile ---- */}
                                <div className="space-y-4">
                                    <h3 className="text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                        ⚖️ Perfil Fitness
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Edad</span>
                                            <input name="age" value={formData.age} onChange={handleChange}
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all w-full"
                                                placeholder="25" type="number" />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Peso (kg)</span>
                                            <input name="weight" value={formData.weight} onChange={handleChange}
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all w-full"
                                                placeholder="60" type="number" />
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Altura (cm)</span>
                                            <input name="height" value={formData.height} onChange={handleChange}
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all w-full"
                                                placeholder="165" type="number" />
                                        </label>
                                    </div>
                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                {/* ---- Goals & Plan ---- */}
                                <div className="space-y-4">
                                    <h3 className="text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                        🎯 Objetivos y Plan
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Objetivo Principal</span>
                                            <select name="goal" value={formData.goal} onChange={handleChange}
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white outline-none transition-all w-full appearance-none cursor-pointer">
                                                <option value="" className="bg-surface-dark">Selecciona una opción</option>
                                                <option value="perder_grasa" className="bg-surface-dark">Perder grasa</option>
                                                <option value="ganar_musculo" className="bg-surface-dark">Ganar músculo</option>
                                                <option value="tonificar" className="bg-surface-dark">Tonificar</option>
                                                <option value="salud_general" className="bg-surface-dark">Salud general</option>
                                                <option value="rendimiento" className="bg-surface-dark">Rendimiento deportivo</option>
                                            </select>
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Selecciona tu Plan</span>
                                            <select name="plan" value={formData.plan} onChange={handleChange}
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white outline-none transition-all w-full appearance-none cursor-pointer">
                                                <option value="" className="bg-surface-dark">Elige un nivel</option>
                                                <option value="BÁSICO" className="bg-surface-dark">BÁSICO — RD$1,200/mes</option>
                                                <option value="INTERMEDIO" className="bg-surface-dark">INTERMEDIO — RD$2,000/mes</option>
                                                <option value="PREMIUM 1-1" className="bg-surface-dark">PREMIUM 1-1 — A Medida</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                {/* ---- Experience & Availability ---- */}
                                <div className="space-y-4">
                                    <h3 className="text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                        📋 Experiencia y Disponibilidad
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Nivel de Experiencia</span>
                                            <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white outline-none transition-all w-full appearance-none cursor-pointer">
                                                <option value="" className="bg-surface-dark">Seleccionar</option>
                                                <option value="principiante" className="bg-surface-dark">Principiante (0-6 meses)</option>
                                                <option value="intermedio" className="bg-surface-dark">Intermedio (6 meses - 2 años)</option>
                                                <option value="avanzado" className="bg-surface-dark">Avanzado (+2 años)</option>
                                            </select>
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Disponibilidad Semanal</span>
                                            <select name="availability" value={formData.availability} onChange={handleChange}
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white outline-none transition-all w-full appearance-none cursor-pointer">
                                                <option value="" className="bg-surface-dark">Seleccionar</option>
                                                <option value="2-3" className="bg-surface-dark">2-3 días por semana</option>
                                                <option value="4-5" className="bg-surface-dark">4-5 días por semana</option>
                                                <option value="6+" className="bg-surface-dark">6+ días por semana</option>
                                            </select>
                                        </label>
                                        <label className="flex flex-col gap-2">
                                            <span className="text-sm font-medium text-white/90">Preferencia de Contacto</span>
                                            <select name="contactPreference" value={formData.contactPreference} onChange={handleChange}
                                                className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white outline-none transition-all w-full appearance-none cursor-pointer">
                                                <option value="" className="bg-surface-dark">Seleccionar</option>
                                                <option value="whatsapp" className="bg-surface-dark">WhatsApp</option>
                                                <option value="email" className="bg-surface-dark">Email</option>
                                                <option value="llamada" className="bg-surface-dark">Llamada telefónica</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div className="h-px bg-white/10 w-full" />

                                {/* ---- Medical ---- */}
                                <div className="space-y-4">
                                    <label className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-white/90">Lesiones o condiciones médicas</span>
                                        <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleChange}
                                            className="bg-black/30 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all w-full resize-none"
                                            placeholder="Describe brevemente si tienes alguna lesión, alergia alimentaria o condición médica relevante..."
                                            rows={3} />
                                    </label>
                                </div>

                                {/* Submit */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="group relative w-full h-14 flex items-center justify-center rounded-xl overflow-hidden font-bold text-white shadow-[0_0_20px_-5px_rgba(212,175,55,0.5)] transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:brightness-110" />
                                        <span className="relative flex items-center gap-2 z-10 tracking-wide uppercase text-sm text-background-dark font-bold">
                                            {isSubmitting ? 'Enviando...' : 'Enviar Inscripción →'}
                                        </span>
                                    </button>
                                    <p className="text-center text-xs text-gray-500 mt-4">Al enviar este formulario aceptas nuestros términos y condiciones.</p>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            {/* ========== FOOTER ========== */}
            <footer className="bg-background-dark pt-16 pb-8 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 justify-center text-primary mb-4">
                            <span className="text-2xl">◆</span>
                            <span className="font-display font-bold text-2xl tracking-wide text-white">YEIMI RAMIREZ</span>
                        </div>
                        <p className="text-gray-400 font-light text-sm tracking-wide">IMPULSADO POR CIENCIA Y DISCIPLINA</p>
                    </div>
                    <div className="flex gap-6 mb-12">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-background-dark text-white flex items-center justify-center transition-all duration-300">
                            <span className="text-sm font-bold">IG</span>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-background-dark text-white flex items-center justify-center transition-all duration-300">
                            <span className="text-sm font-bold">TK</span>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-background-dark text-white flex items-center justify-center transition-all duration-300">
                            <span className="text-sm font-bold">✉</span>
                        </a>
                    </div>
                    <div className="w-full h-px bg-white/5 mb-8" />
                    <div className="flex flex-col md:flex-row gap-6 justify-between w-full text-xs text-gray-500">
                        <p>© 2026 Coach Yeimi Ramirez. Todos los derechos reservados.</p>
                        <div className="flex gap-6 justify-center">
                            <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
                            <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ========== WHATSAPP FLOATING BUTTON ========== */}
            <a
                href="https://wa.me/18299154459"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="fixed bottom-8 right-8 z-[100] group flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-[#b89628] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-110 transition-all duration-300 border-2 border-white/10"
            >
                <svg className="w-8 h-8 text-background-dark fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            </a>
        </div>
    );
};

export default LandingPage;
