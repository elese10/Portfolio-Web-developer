const root = document.documentElement;
root.classList.add("js");
const progress = document.querySelector(".scroll-progress");
const links = document.querySelectorAll(".site-nav a:not(.nav-contact)");

//scroll bar progress

const updateProg = () => {
    const max = root.scrollHeight - innerHeight;
    progress.style.setProperty("--progress", max > 0 ? scrollY / max : 0);
};
addEventListener("scroll", updateProg, {passive:true});
addEventListener("resize", updateProg);
updateProg();

//Dinamic links
const setCurrent = id => {
    links.forEach(link => {
        const active = link.hash === `#${id}`;
        link.classList.toggle("is-current", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    })
}
const observer = new IntersectionObserver(
    entries => entries.forEach(entry => entry.isIntersecting && setCurrent(entry.target.id)),
    {rootMargin: "-40% 0px -55% 0px"}
);
links.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section) observer.observe(section);
});

//entrance animations
const splitWords = el => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text
        .split(/\s+/)
        .map((word, i) => `<span class="word" aria-hidden="true"><span style="--i:${i}">${word}</span></span>`)
        .join(" ");
};
document.querySelectorAll("[data-split]").forEach(splitWords);
document.querySelectorAll(".projects-grid > [data-reveal]").forEach((el, i) => el.style.setProperty("--i", i));

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
    });
}, { threshold: 0.2 });
document.querySelectorAll("[data-reveal], [data-split]").forEach(el => revealObserver.observe(el));

//animated mini shell

const shellScript = [
    { cmd: "pwd", out: ["/home/ezequiel/mini-shell"] },
    { cmd: "ls", out: ["main.c  parser.c  exec.c  Makefile"] },
    { cmd: "echo fork + exec", out: ["fork + exec"] },
    { cmd: "ls | wc -l", out: ["4"] },
    { cmd: "exit", out: ["bye"] }
];

const initShell = () => {
    const body = document.querySelector(".terminal-body");
    if (!body) return;
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    const addOutput = text => {
        const p = document.createElement("p");
        p.className = "out";
        p.textContent = text;
        body.append(p);
    };

    const addPrompt = () => {
        const p = document.createElement("p");
        p.innerHTML = '<span class="prompt">mini-shell$</span> <span class="cmd"></span><i class="cursor"></i>';
        body.append(p);
        return p;
    };

    if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
        shellScript.forEach(({ cmd, out }) =>{
            const p = addPrompt();
            p.querySelector(".cmd").textContent = cmd;
            p.querySelector(".cursor").remove();
            out.forEach(addOutput);
        });
        return;
    }
    //stop animation when the terminal is not visible
    let visible = false;
    let wake;
    new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake?.();
    }).observe(body);
    const ready = () => (visible ? Promise.resolve() : new Promise(resolve => (wake = resolve)));
    const run = async () => {
        for (;;) {
            body.replaceChildren();
            for (const { cmd, out } of shellScript) {
                const p = addPrompt();
                const cmdEl = p.querySelector(".cmd");
                await sleep(500);
                for (const char of cmd) {
                    await ready();
                    cmdEl.textContent += char;
                    await sleep(70 + Math.random() * 60);
                }
                await sleep(350);
                p.querySelector(".cursor").remove();
                for (const text of out) {
                    await sleep(120);
                    addOutput(text);
                }
                await sleep(600);
            }
            await sleep(2200);
        }
    };
    run();
}
initShell();

// Magnetic buttons (mouse only and reducen motion)
if (matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
    document.querySelectorAll(".button:not([aria-disabled]), .nav-contact, .social-links a").forEach(el => {
        el.addEventListener("pointermove", event => {
            const rect = el.getBoundingClientRect();
            const x = (event.clientX - rect.left - rect.width / 2) * 0.2;
            const y = (event.clientY - rect.top - rect.height / 2) * 0.3;
            el.style.translate = `${x}px ${y}px`;
        });
        el.addEventListener("pointerleave", () => (el.style.translate = ""));
    });
}

const projectsData = {
    gamedata: {
        number: "PROYECTO / 01",
        title: "GameData",
        tagline: "Encontrá tu próximo juego favorito.",
        description:
            "Una biblioteca para explorar videojuegos, consultar información, leer reseñas y organizar colecciones personales.",

        challenge:
            "Organizar juegos, valoraciones y listas personales en un solo lugar, permitiendo que cada usuario gestione su propia biblioteca.",

        approach:
            "Catálogo consultable, sistema de usuarios, reseñas y tres listas personales: favoritos, deseos y juegos que ya tenés.",

        tech: "PHP · MySQL · JavaScript",

        image: "assets/images/gamedata_img.png",

        repo: "https://github.com/elese10",

        note:
            "Proyecto académico desarrollado en equipo. Aplicación web con persistencia de datos y funcionalidades sociales."
    },

    sobremesa: {
        number: "PROYECTO / 02",
        title: "Sobremesa",
        tagline: "El truco, con toda la mesa a mano.",
        description:
            "Una experiencia web para jugar al truco, trasladando la lógica del juego de cartas a una interfaz digital.",

        challenge:
            "Llevar el juego de cartas a una mesa digital clara, contemplando sus reglas, turnos y sistema de puntuación.",

        approach:
            "Una interfaz para representar partidas, gestionar puntajes y aplicar la lógica necesaria para desarrollar el juego.",

        tech: "HTML · CSS · JavaScript",

        image: "assets/images/sobremesa_img.png",

        repo: "https://github.com/elese10",

        note:
            "Proyecto personal de práctica. Desarrollo enfocado en lógica de programación e interacción con JavaScript."
    },

    minishell: {
        number: "IDEA / EN PREPARACIÓN / 03",
        title: "Mini shell",
        tagline: "Una idea para explorar el terminal desde cero.",
        description:
            "Un proyecto en C para comprender cómo funciona una terminal y cómo interactúa con el sistema operativo.",

        challenge:
            "Definir un alcance pequeño y aprender cómo se procesan comandos y se ejecutan procesos en sistemas Unix.",

        approach:
            "Desarrollar progresivamente un intérprete de comandos utilizando conceptos de C y llamadas al sistema POSIX.",

        tech: "C · Terminal · Sistemas",

        image: null,

        repo: null,

        note:
            "Idea en preparación. Proyecto todavía sin iniciar y sin repositorio disponible."
    }
};

const projectModal = document.querySelector("#project-modal");
const modalContent = projectModal.querySelector(".modal-content");
const modalPreview = document.querySelector("#modal-preview");
const modalNumber = document.querySelector("#modal-number");
const modalTitle = document.querySelector("#modal-title");
const modalTagline = document.querySelector("#modal-tagline");
const modalDescription = document.querySelector("#modal-description");
const modalChallenge = document.querySelector("#modal-challenge");
const modalApproach = document.querySelector("#modal-approach");
const modalTech = document.querySelector("#modal-tech");
const modalRepository = document.querySelector("#modal-repository");
const modalNote = document.querySelector("#modal-note");
const closeModalButton = document.querySelector("[data-close-modal]");
let previousFocus = null;
const renderProject = projectId => {
    const project = projectsData[projectId];
    if (!project) return;
    modalNumber.textContent = project.number;
    modalTitle.textContent = project.title;
    modalTagline.textContent = project.tagline;
    modalDescription.textContent = project.description;
    modalChallenge.textContent = project.challenge;
    modalApproach.textContent = project.approach;
    modalTech.textContent = project.tech;
    modalNote.textContent = project.note;
    modalPreview.className = "modal-preview";
    if (project.image) {
        const image = document.createElement("img");
        image.src = project.image;
        image.alt = `Vista previa de ${project.title}`;
        image.loading = "eager";
        modalPreview.replaceChildren(image);
    } else {
        modalPreview.classList.add("modal-preview--terminal");
        modalPreview.innerHTML = `
            <div class="terminal">
                <div class="terminal-bar">
                    <span></span>
                    <span></span>
                    <span></span>
                    <b>mini-shell</b>
                </div>

                <div class="terminal-body">
                    <p><span class="prompt">mini-shell$</span> pwd</p>
                    <p class="out">/home/ezequiel/mini-shell</p>

                    <p><span class="prompt">mini-shell$</span> ls</p>
                    <p class="out">main.c parser.c exec.c Makefile</p>

                    <p><span class="prompt">mini-shell$</span> echo fork + exec</p>
                    <p class="out">fork + exec</p>

                    <p><span class="prompt">mini-shell$</span> <i class="cursor"></i></p>
                </div>
            </div>
        `;
    }
    if (project.repo) {
        modalRepository.href = project.repo;
        modalRepository.hidden = false;
    } else {
        modalRepository.hidden = true;
        modalRepository.removeAttribute("href");
    }
};


/* Open modal */

const openProjectModal = projectId => {
    if (!projectsData[projectId]) return;

    previousFocus = document.activeElement;

    renderProject(projectId);

    projectModal.hidden = false;
    projectModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
        projectModal.classList.add("is-open");
        modalContent.focus();
    });
};


/* Close modal */

const closeProjectModal = () => {
    if (projectModal.hidden) return;

    projectModal.classList.remove("is-open");

    projectModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    setTimeout(() => {
        projectModal.hidden = true;
        previousFocus?.focus();
    }, 250);
};

document.querySelectorAll("[data-project]").forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();

        const projectId = button.dataset.project;

        openProjectModal(projectId);
    });
});

closeModalButton.addEventListener("click", closeProjectModal);
projectModal.addEventListener("click", event => {
    if (event.target === projectModal) {
        closeProjectModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !projectModal.hidden) {
        closeProjectModal();
    }
});