import './bootstrap';
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

const projects = [
    {
        title: 'Restaurante coreano Moon',
        description:
            'Web de restaurante coreano con menú, reservas y diseño centrado en la experiencia del cliente.',
        tech: ['Blade', 'PHP', 'CSS', 'JavaScript'],
        link: 'https://github.com/oniikuroo/tfg',
    },
    {
        title: 'La Favela Lounge Bar',
        description: 'Landing profesional para lounge bar con secciones de ambiente, carta y contacto.',
        tech: ['Blade', 'PHP'],
        link: 'https://github.com/oniikuroo/lafavela',
    },
];

const App = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ type: 'idle', message: '' });
    const csrfToken = useMemo(() => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : '';
    }, []);

    useEffect(() => {
        const elements = document.querySelectorAll('[data-reveal]');
        if (!('IntersectionObserver' in window)) {
            elements.forEach((el) => el.classList.add('is-visible'));
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ type: 'loading', message: 'Enviando mensaje...' });
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(formState),
            });

            if (!response.ok) {
                const data = await response.json();
                const message = data?.message || 'No se pudo enviar el mensaje.';
                setStatus({ type: 'error', message });
                return;
            }

            setFormState({ name: '', email: '', message: '' });
            setStatus({ type: 'success', message: 'Mensaje enviado. Gracias por contactar.' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Error de conexión. Inténtalo de nuevo.' });
        }
    };

    return (
        <div className="page">
            <nav className="nav reveal" data-reveal>
                <div className="logo">Enrique Ramallo</div>
                <div className="nav-links">
                    <a href="#inicio">Inicio</a>
                    <a href="#sobre-mi">Sobre mí</a>
                    <a href="#proyectos">Proyectos</a>
                    <a href="#contacto">Contacto</a>
                </div>
            </nav>

            <section id="inicio" className="hero reveal" data-reveal>
                <div>
                    <h1>Full-stack Developer especializado en experiencias web premium.</h1>
                    <p>
                        Construyo productos digitales con Laravel y frontend moderno. Me enfoco en rendimiento,
                        detalles y una estética minimalista de alto nivel.
                    </p>
                    <div className="hero-actions">
                        <a className="button" href="#proyectos">
                            Ver proyectos
                        </a>
                        <a className="button secondary" href="#contacto">
                            Hablemos
                        </a>
                    </div>
                </div>
                <div className="hero-card">
                    <span>Disponibilidad</span>
                    <strong>Freelance y colaboraciones</strong>
                    <p>Basado en España. Disponible para proyectos web con impacto.</p>
                    <span>Stack principal</span>
                    <strong>Laravel · React · Vite</strong>
                </div>
            </section>

            <section id="sobre-mi" className="section reveal" data-reveal>
                <div className="section-header">
                    <h2>Sobre mí</h2>
                    <p>
                        Soy Enrique Ramallo, desarrollador full-stack enfocado en Laravel. Trabajo productos con
                        precisión visual y una experiencia fluida, cuidando el detalle desde el backend hasta la UI.
                    </p>
                </div>
                <div className="grid">
                    <div className="card">
                        <h3>Desarrollo backend</h3>
                        <p>
                            APIs limpias, seguridad y rendimiento. Laravel es mi base para construir productos
                            robustos y escalables.
                        </p>
                    </div>
                    <div className="card">
                        <h3>Frontend minimalista</h3>
                        <p>
                            Interfaces sobrias, con microdetalles y jerarquías claras, inspiradas en productos premium.
                        </p>
                    </div>
                    <div className="card">
                        <h3>Colaboración</h3>
                        <p>
                            Comunicación clara, visión de producto y entrega puntual. Me adapto a equipos o trabajo
                            autónomo.
                        </p>
                    </div>
                </div>
            </section>

            <section id="proyectos" className="section reveal" data-reveal>
                <div className="section-header">
                    <h2>Proyectos seleccionados</h2>
                    <p>Dos proyectos reales en producción, enfocados en experiencia visual y funcionalidad.</p>
                </div>
                <div className="grid">
                    {projects.map((project) => (
                        <div className="card" key={project.title}>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="tag-list">
                                {project.tech.map((tech) => (
                                    <span key={tech} className="tag">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <a className="button secondary" href={project.link} target="_blank" rel="noreferrer">
                                Ver repositorio
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section id="contacto" className="section reveal" data-reveal>
                <div className="section-header">
                    <h2>Contacto</h2>
                    <p>Cuéntame tu idea. Respondo en 24/48h para proyectos y colaboraciones.</p>
                </div>
                <div className="contact">
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formState.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formState.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="message">Mensaje</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formState.message}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-footer">
                            <button className="button" type="submit">
                                Enviar mensaje
                            </button>
                            {status.message && <span className="status">{status.message}</span>}
                        </div>
                    </form>
                    <div className="hero-card">
                        <span>Email</span>
                        <strong>enriqueramallo04@gmail.com</strong>
                        <span>LinkedIn</span>
                        <a href="https://www.linkedin.com/in/enrique-ramallo-vilches-290089365" target="_blank" rel="noreferrer">
                            www.linkedin.com/in/enrique-ramallo-vilches-290089365
                        </a>
                        <span>Enfoque</span>
                        <strong>Productos web premium</strong>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <span>© 2026 Enrique Ramallo. Todos los derechos reservados.</span>
                <span>Laravel · React · Vite</span>
            </footer>
        </div>
    );
};

const rootElement = document.getElementById('app');
if (rootElement) {
    createRoot(rootElement).render(<App />);
}
