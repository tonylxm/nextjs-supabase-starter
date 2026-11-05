import { describe, expect, it } from "vitest";
import { isPublicPath } from "./routes";

describe("isPublicPath", () => {
  it("allows the home, login and auth callback routes", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/login")).toBe(true);
    expect(isPublicPath("/auth/callback")).toBe(true);
  });

  it("allows the files crawlers and link previews fetch", () => {
    expect(isPublicPath("/robots.txt")).toBe(true);
    expect(isPublicPath("/sitemap.xml")).toBe(true);
    expect(isPublicPath("/opengraph-image")).toBe(true);
    expect(isPublicPath("/twitter-image")).toBe(true);
  });

  it("protects everything else by default", () => {
    expect(isPublicPath("/account")).toBe(false);
    expect(isPublicPath("/login-help")).toBe(false);
    expect(isPublicPath("/authors")).toBe(false);
  });
});
