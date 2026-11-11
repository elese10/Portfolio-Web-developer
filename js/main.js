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