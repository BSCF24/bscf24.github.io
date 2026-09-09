import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import teamData from "../src/data/team.json";
import initiativesData from "../src/data/initiatives.json";

const astroDistDir = path.resolve("dist");

function getHtmlFiles(dir: string, base = ""): string[] {
  if (!fs.existsSync(dir)) return [];
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.join(base, item.name);
    if (item.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath, relPath));
    } else if (item.name.endsWith(".html")) {
      results.push(relPath);
    }
  }
  return results;
}

describe("BSCF Site Regression & Build Tests", () => {
  it("should have build output directory ready", () => {
    expect(fs.existsSync(astroDistDir)).toBe(true);
  });

  describe("Route Integrity", () => {
    const astroHtmlFiles = getHtmlFiles(astroDistDir).sort();

    it("should build core static pages", () => {
      const coreRoutes = [
        "index.html",
        "about/index.html",
        "contact/index.html",
        "initiatives/index.html",
        "news/index.html",
        "team/index.html",
        "youth-network/index.html"
      ];
      for (const route of coreRoutes) {
        expect(fs.existsSync(path.join(astroDistDir, route)), "Missing route: " + route).toBe(true);
      }
    });

    it("should generate all initiative and team member pages", () => {
      // 7 core pages + all initiatives + founder + all core team members
      const expectedMinPages = 7 + initiativesData.length + 1 + teamData.coreTeam.length;
      expect(astroHtmlFiles.length).toBeGreaterThanOrEqual(expectedMinPages);
    });
  });

  describe("Static Assets", () => {
    it("should have CNAME and .nojekyll in dist root", () => {
      expect(fs.existsSync(path.join(astroDistDir, "CNAME"))).toBe(true);
      expect(fs.readFileSync(path.join(astroDistDir, "CNAME"), "utf8").trim()).toBe("bscf.dev");
      expect(fs.existsSync(path.join(astroDistDir, ".nojekyll"))).toBe(true);
    });

    it("should have bundled CSS in dist/_astro/", () => {
      const astroFiles = fs.readdirSync(path.join(astroDistDir, "_astro"));
      const cssBundles = astroFiles.filter(file => file.endsWith(".css"));
      expect(cssBundles.length).toBeGreaterThanOrEqual(1);
    });

    it("should have all policy PDFs in /contents/pdfs/", () => {
      const pdfs = [
        "Anti-Corruption Policy BSCF.pdf",
        "Anti-Sexual Harassment Policy BSCF.pdf",
        "Child Protection Policy BSCF.pdf",
        "Conflict of Interest Policy & Declaration BSCF.pdf",
        "Data Protection Policy BSCF.pdf",
        "Financial Management Policy BSCF.pdf",
        "Gender Equality Policy BSCF.pdf",
        "HR Policy BSCF.pdf"
      ];
      for (const pdf of pdfs) {
        expect(fs.existsSync(path.join(astroDistDir, "contents", "pdfs", pdf)), "Missing PDF: " + pdf).toBe(true);
      }
    });

    it("should have all partner logos in src/assets/images/pc/", () => {
      const partnerImgs = [
        "16.png", "13.png", "15.png", "12.png", "11.png", "9.png",
        "shajgoj.png", "lightcastle.svg", "shestem.svg", "yfp.svg",
        "3.png", "6.png", "5.png", "shomokal.svg", "8.png", "17.png"
      ];
      for (const img of partnerImgs) {
        expect(fs.existsSync(path.join("src", "assets", "images", "pc", img)), "Missing Partner Logo: " + img).toBe(true);
      }
    });
  });

  describe("Common Elements Across All Pages", () => {
    const pages = getHtmlFiles(astroDistDir);

    for (const pageFile of pages) {
      it(`[${pageFile}] should contain required meta, fonts, header, and footer`, () => {
        const html = fs.readFileSync(path.join(astroDistDir, pageFile), "utf8");
        const $ = cheerio.load(html);

        expect($("title").text().trim().length).toBeGreaterThan(0);
        expect($("meta[name=\"description\"]").attr("content")?.length).toBeGreaterThan(0);

        expect($("meta[property=\"og:url\"]").attr("content")).toBeDefined();
        expect($("meta[property=\"og:title\"]").attr("content")).toBeDefined();
        expect($("meta[property=\"og:description\"]").attr("content")).toBeDefined();
        expect($("meta[name=\"twitter:card\"]").attr("content")).toBe("summary_large_image");
        expect($("meta[property=\"twitter:domain\"]").attr("content")).toBe("bscf.dev");

        expect($("link[href*=\"fonts.googleapis.com\"]").length).toBeGreaterThan(0);
        expect($("link[rel=\"icon\"]").attr("href")).toBe("/favicon.svg");

        expect($("header").length).toBe(1);
        expect($(".logo-link img").attr("src")).toMatch(/logo.*\.svg/);
        const navLinks = $(".nav li a").map((_, el) => $(el).text().trim()).get();
        expect(navLinks).toContain("HOME");
        expect(navLinks).toContain("ABOUT");
        expect(navLinks).toContain("TEAM");
        expect(navLinks).toContain("INITIATIVES");
        expect(navLinks).toContain("NEWS");
        expect(navLinks).toContain("YOUTH NETWORK");
        expect(navLinks).toContain("CONTACT US");

        expect($("footer.footer-container").length).toBe(1);
        expect($(".footer-about .footer-logo").attr("src")).toMatch(/logo.*\.svg/);
        expect($(".footer-bottom").text()).toContain("Bangladesh Socio-Cultural Forum");
        expect($(".footer-bottom").text()).toContain("BSCF Tech Team");
      });
    }
  });

  describe("Home Page Specifics (/)", () => {
    it("should have 5 hero slides, 16 partner logos, and about section", () => {
      const html = fs.readFileSync(path.join(astroDistDir, "index.html"), "utf8");
      const $ = cheerio.load(html);

      expect($(".hero-slider .slide").length).toBe(5);
      expect($(".hero-title").text()).toContain("Empowering Youth");
      expect($(".partner-item").length).toBe(16);
      expect($(".about-lead").text()).toContain("BSCF is an independent, non-political platform");
    });
  });

  describe("About Page Specifics (/about/)", () => {
    it("should render About BSCF story, Vision and Mission", () => {
      const html = fs.readFileSync(path.join(astroDistDir, "about", "index.html"), "utf8");
      const $ = cheerio.load(html);

      expect($(".archive-title").text()).toBe("About BSCF");
      expect($(".block-title").eq(0).text()).toBe("Our Vision");
      expect($(".block-title").eq(1).text()).toBe("Our Mission");
      expect($(".block-text").length).toBe(4);
    });
  });

  describe("Contact Page Specifics (/contact/)", () => {
    it("should render 4 contact cards and decode script", () => {
      const html = fs.readFileSync(path.join(astroDistDir, "contact", "index.html"), "utf8");
      const $ = cheerio.load(html);

      expect($(".contact-card").length).toBe(4);
      expect($(".card-title").map((_, el) => $(el).text()).get()).toEqual([
        "Facebook", "LinkedIn", "Email", "Events"
      ]);
      expect(html).toContain("YnNjZjI0QGdtYWlsLmNvbQ==");
      expect(html).toContain("MDE3MTQ3OTMwMzI=");
    });
  });

  describe("News Page Specifics (/news/)", () => {
    it("should render news items with preview or shimmer", () => {
      const html = fs.readFileSync(path.join(astroDistDir, "news", "index.html"), "utf8");
      const $ = cheerio.load(html);

      expect($(".archive-title").text()).toBe("News");
      const newsCards = $(".project-card.news-card");
      expect(newsCards.length).toBeGreaterThanOrEqual(10);
      expect($(".card-link").eq(0).text()).toBe("Visit Website →");
    });
  });

  describe("Initiatives Index (/initiatives/)", () => {
    it("should render filter buttons and all initiative cards", () => {
      const html = fs.readFileSync(path.join(astroDistDir, "initiatives", "index.html"), "utf8");
      const $ = cheerio.load(html);

      expect($(".archive-title").text()).toBe("All Initiatives");
      expect($(".filter-btn").length).toBeGreaterThanOrEqual(4);
      expect($(".filter-btn[data-filter=\"all\"]").length).toBe(1);

      const items = $(".item-card");
      expect(items.length).toBe(initiativesData.length);
    });
  });

  describe("Individual Initiative Pages (/initiatives/<slug>/)", () => {
    for (const initiative of initiativesData) {
      it(`[${initiative.slug}] should render title, share buttons, body and gallery`, () => {
        const filePath = path.join(astroDistDir, "initiatives", initiative.slug, "index.html");
        expect(fs.existsSync(filePath), "Missing initiative page for " + initiative.slug).toBe(true);

        const html = fs.readFileSync(filePath, "utf8");
        const $ = cheerio.load(html);

        expect($(".project-title").text().trim().length).toBeGreaterThan(0);
        expect($(".share-buttons a").length).toBe(3);
        expect($("#copyBtn").length).toBe(1);
        expect($(".project-body").text().trim().length).toBeGreaterThan(0);
      });
    }
  });

  describe("Team Directory (/team/)", () => {
    it("should render Founder highlight and all Core team members", () => {
      const html = fs.readFileSync(path.join(astroDistDir, "team", "index.html"), "utf8");
      const $ = cheerio.load(html);

      expect($(".archive-title").text()).toBe("Our Team");
      expect($(".founder-special").length).toBe(1);
      expect($(".founder-special h4").text()).toBe(teamData.founder.name);
      expect($(".members-grid .team-member").length).toBe(teamData.coreTeam.length);
    });
  });

  describe("Individual Team Member Pages (/team/<slug>/)", () => {
    const allMembers = [teamData.founder, ...teamData.coreTeam];

    for (const member of allMembers) {
      it(`[${member.slug}] should render name, role, photo, bio and contact details`, () => {
        const filePath = path.join(astroDistDir, "team", member.slug, "index.html");
        expect(fs.existsSync(filePath), "Missing team page for " + member.slug).toBe(true);

        const html = fs.readFileSync(filePath, "utf8");
        const $ = cheerio.load(html);

        expect($(".archive-title").text().trim().length).toBeGreaterThan(0);
        expect($(".member-role").text().trim().length).toBeGreaterThan(0);
        expect($(".member-image-frame img").attr("src")?.length).toBeGreaterThan(0);
        expect($(".bio-content").text().trim().length).toBeGreaterThan(0);
      });
    }
  });

  describe("Youth Network (/youth-network/)", () => {
    it("should render cover, Chief Coordinator, Coordinators, and Join CTA", () => {
      const html = fs.readFileSync(path.join(astroDistDir, "youth-network", "index.html"), "utf8");
      const $ = cheerio.load(html);

      expect($(".cover-title").text()).toContain("Youth");
      expect($(".single-chief").length).toBe(1);
      expect($(".single-chief h4").text()).toBe("Priyanka Adhikary");
      expect($(".youth-network-grid .youth-network-card-wrap").length).toBe(5);
      expect($(".btn-premium").attr("href")).toContain("docs.google.com/forms");
    });
  });
});
