import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

/**
 * Sample TestDriver tests for the PC Xpress app (this repo).
 *
 * Target URL resolution order:
 *   1. TD_BASE_URL   — set this to your deployed/production URL (recommended in CI)
 *   2. fallback      — http://localhost:3000 (a locally running `next dev`/`next start`)
 *
 * The PC Xpress app is a Next.js site with a public marketing area
 * (home, prebuilt PCs, build-a-pc, repair-a-device) and an internal
 * /dashboard admin area. There is no authentication, so these smoke
 * tests exercise real user journeys without credentials.
 */
const BASE_URL = (process.env.TD_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

describe("PC Xpress — public marketing site", () => {
  it("loads the homepage with hero and featured PCs", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: `${BASE_URL}/` });
    await testdriver.wait(3000);

    const heroVisible = await testdriver.assert(
      "the PC Xpress homepage is shown with a hero section about PC repairs or custom builds"
    );
    expect(heroVisible).toBeTruthy();

    const featuredVisible = await testdriver.assert(
      "a 'Featured Custom PC' section with at least one product card is visible on the page"
    );
    expect(featuredVisible).toBeTruthy();
  });

  it("browses the prebuilt PCs catalog and filters by category", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: `${BASE_URL}/prebuilt-pcs` });
    await testdriver.wait(3000);

    const catalogVisible = await testdriver.assert(
      "a catalog of prebuilt PCs is shown, with product cards that include names and prices"
    );
    expect(catalogVisible).toBeTruthy();

    // The catalog exposes category filter chips: All / Gaming / Creator / Office.
    const gamingFilter = await testdriver.find("the 'Gaming' category filter button");
    await gamingFilter.click();
    await testdriver.wait(1500);

    const filtered = await testdriver.assert(
      "the catalog now shows Gaming prebuilt PCs (product cards are still visible after filtering)"
    );
    expect(filtered).toBeTruthy();
  });

  it("opens a prebuilt PC product detail page", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: `${BASE_URL}/prebuilt-pcs` });
    await testdriver.wait(3000);

    const firstProduct = await testdriver.find(
      "the first prebuilt PC product card in the catalog"
    );
    await firstProduct.click();
    await testdriver.wait(2500);

    const detailVisible = await testdriver.assert(
      "a product detail page is shown with a product name, price, and specifications or highlights"
    );
    expect(detailVisible).toBeTruthy();
  });
});

describe("PC Xpress — repair booking wizard", () => {
  it("walks through the first step of the repair wizard", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: `${BASE_URL}/repair-a-device` });
    await testdriver.wait(3000);

    const wizardVisible = await testdriver.assert(
      "the 'Book a Repair' page is shown with a step to select a device type"
    );
    expect(wizardVisible).toBeTruthy();

    // Step 1 of the wizard is choosing a device (e.g. Laptop / Desktop / Phone).
    const deviceOption = await testdriver.find(
      "a device type option to select for repair (such as Laptop or Desktop)"
    );
    await deviceOption.click();
    await testdriver.wait(1500);

    const advanced = await testdriver.assert(
      "the wizard advanced past device selection to a brand or issue selection step"
    );
    expect(advanced).toBeTruthy();
  });
});

describe("PC Xpress — admin dashboard", () => {
  it("shows the dashboard overview with stats and recent repairs", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: `${BASE_URL}/dashboard` });
    await testdriver.wait(3000);

    const dashboardVisible = await testdriver.assert(
      "an admin dashboard is shown with summary stat cards (such as revenue or repair counts) and charts"
    );
    expect(dashboardVisible).toBeTruthy();
  });
});
