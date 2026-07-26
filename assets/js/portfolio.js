/*
 * Portfolio interactions and non-destructive markup enhancement.
 * Repository path: /assets/js/portfolio.js
 */

(function () {
  "use strict";

  var sectionClassNames = [
    "section--contact",
    "section--profile",
    "section--objective",
    "section--skills",
    "section--education",
    "section--projects"
  ];

  function switchLang(lang) {
    var selectedLanguage = lang === "fr" ? "fr" : "en";

    document.querySelectorAll(".lang").forEach(function (element) {
      element.classList.toggle(
        "active",
        element.classList.contains(selectedLanguage)
      );
    });

    document.querySelectorAll(".language-button").forEach(function (button) {
      var isActive = button.dataset.language === selectedLanguage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    document.documentElement.lang = selectedLanguage;
    localStorage.setItem("preferredLang", selectedLanguage);
  }

  function setInitialLang() {
    var preferredLang = localStorage.getItem("preferredLang");
    switchLang(preferredLang === "fr" ? "fr" : "en");
  }

  function enhanceSidebar() {
    var sidebarHeader = document.querySelector(
      ".wrapper > header, body > header, header"
    );
    var switcher = document.querySelector(".language-switcher");

    if (!sidebarHeader || !switcher) {
      return;
    }

    if (!sidebarHeader.querySelector(".portfolio-profile-image")) {
      var profileImg = document.createElement("img");
      profileImg.src = switcher.dataset.profileSrc;
      profileImg.alt = "Alexis Balestra";
      profileImg.className = "portfolio-profile-image";
      sidebarHeader.prepend(profileImg);
    }

    var sidebarSubtitle = sidebarHeader.querySelector("p");

    if (sidebarSubtitle && !sidebarSubtitle.dataset.portfolioSubtitle) {
      var subEN = document.createElement("span");
      subEN.className = "lang en";
      subEN.innerText = "EURECOM STUDENT";

      var subFR = document.createElement("span");
      subFR.className = "lang fr";
      subFR.innerText = "ÉTUDIANT À EURECOM";

      sidebarSubtitle.replaceChildren(subEN, subFR);
      sidebarSubtitle.dataset.portfolioSubtitle = "true";
    }
  }

  function createSectionGroups(languageContainer) {
    if (languageContainer.dataset.portfolioEnhanced) {
      return;
    }

    var children = Array.from(languageContainer.children);
    var currentSection = null;
    var sectionIndex = -1;

    children.forEach(function (child) {
      if (child.tagName === "H3") {
        sectionIndex += 1;
        currentSection = document.createElement("section");
        currentSection.className =
          "portfolio-section " + (sectionClassNames[sectionIndex] || "");

        languageContainer.insertBefore(currentSection, child);
        currentSection.appendChild(child);
      } else if (currentSection) {
        currentSection.appendChild(child);
      }
    });

    languageContainer
      .querySelectorAll(".portfolio-section > hr")
      .forEach(function (rule) {
        rule.remove();
      });

    languageContainer
      .querySelectorAll(".portfolio-section")
      .forEach(function (section) {
        var directChildren = Array.from(section.children);

        directChildren.forEach(function (child) {
          var nextElement = child.nextElementSibling;
          var beginsEntry =
            child.tagName === "P" &&
            child.querySelector(":scope > strong");

          if (
            beginsEntry &&
            nextElement &&
            nextElement.tagName === "UL"
          ) {
            var card = document.createElement("article");
            card.className = "entry-card";

            section.insertBefore(card, child);
            card.appendChild(child);
            card.appendChild(nextElement);
          }
        });
      });

    languageContainer.dataset.portfolioEnhanced = "true";
  }

  function enhanceLinks() {
    document
      .querySelectorAll('.portfolio-shell a[href^="http"]')
      .forEach(function (link) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    enhanceSidebar();

    document
      .querySelectorAll(".portfolio-shell > .lang")
      .forEach(createSectionGroups);

    enhanceLinks();
    setInitialLang();
  });

  window.switchLang = switchLang;
})();
