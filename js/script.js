/* =========================================================
   Ezinwanneamaka Foundation - Clean JavaScript
   What this file does:
   1. Hides the preloader
   2. Opens and closes the video modal
   3. Handles newsletter Google Form redirect
   4. Handles cookie consent
   5. Loads Google Analytics only after cookie consent
   6. Animates impact numbers
========================================================= */


/* ---------- 1. Preloader ---------- */
window.addEventListener("load", function () {
    const preloader = document.getElementById("preloader");

    if (preloader) {
        setTimeout(function () {
            preloader.classList.add("hide");
        }, 500);
    }
});


/* ---------- 2. Video modal ---------- */
document.addEventListener("DOMContentLoaded", function () {
    const videoModal = document.getElementById("videoModal");
    const videoFrame = document.getElementById("videoFrame");

    if (!videoModal || !videoFrame) return;

    videoModal.addEventListener("show.bs.modal", function (event) {
        const button = event.relatedTarget;
        const videoURL = button ? button.getAttribute("data-src") : "";

        if (videoURL) {
            videoFrame.src = videoURL + "?autoplay=1";
        }
    });

    videoModal.addEventListener("hidden.bs.modal", function () {
        videoFrame.src = "";
    });
});


/* ---------- 3. Newsletter form ---------- */
let newsletterSubmitted = false;

function handleNewsletterSubmit() {
    newsletterSubmitted = true;
}

document.addEventListener("DOMContentLoaded", function () {
    const subscribeForm = document.getElementById("subscribeForm");
    const hiddenIframe = document.getElementById("hidden_iframe");

    if (!subscribeForm || !hiddenIframe) return;

    subscribeForm.addEventListener("submit", handleNewsletterSubmit);

    hiddenIframe.addEventListener("load", function () {
        if (newsletterSubmitted) {
            window.location.href = "thank-you.html";
        }
    });
});


/* ---------- 4. Google Analytics ---------- */
function loadGoogleAnalytics() {
    if (window.analyticsLoaded) return;

    window.analyticsLoaded = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-903VWWS4HM";
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", "G-903VWWS4HM");
}


/* ---------- 5. Cookie banner ---------- */
function acceptCookies() {
    localStorage.setItem("cookiesAccepted", "yes");

    const banner = document.getElementById("cookie-banner");

    if (banner) {
        banner.style.display = "none";
    }

    loadGoogleAnalytics();
}

document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("cookie-banner");

    if (localStorage.getItem("cookiesAccepted") === "yes") {
        if (banner) {
            banner.style.display = "none";
        }

        loadGoogleAnalytics();
    }
});


/* ---------- 6. Counter animation ---------- */
document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll('[data-toggle="counter-up"]');

    if (!counters.length) return;

    counters.forEach(function (counter) {
        counter.dataset.target = counter.textContent.trim();
        counter.textContent = "0";
    });

    function startCounter(counter) {
        const target = Number(counter.dataset.target);
        let current = 0;
        const duration = 2000;
        const stepTime = 20;
        const increment = target / (duration / stepTime);

        const timer = setInterval(function () {
            current += increment;

            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.ceil(current);
            }
        }, stepTime);
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    counters.forEach(function (counter) {
        observer.observe(counter);
    });
});