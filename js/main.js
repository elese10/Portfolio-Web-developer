const root = document.documentElement;
const progress = document.querySelector(".scroll-progress");
const links = document.querySelectorAll(".ite-nav a:not(.nav-contact)");

//scroll bar progress

const updateProg = () => {
    const max = root.scrollHeight - innerHeight;
    progress.style.setProperty("--progress", max > 0 ? scrollY / max : 0);
};
addEventListener("scroll", updateProg, {passive:true});
addEventListener("resize", updateProg);