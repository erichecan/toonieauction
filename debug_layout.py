import asyncio
from playwright.async_api import Page, expect, async_playwright

async def debug_homepage_layout(page: Page, url: str):
    await page.goto(url)
    print(f"Navigated to: {url}")

    # Capture a full-page screenshot
    screenshot_path = "homepage_layout_debug.png"
    await page.screenshot(path=screenshot_path, full_page=True)
    print(f"Full page screenshot saved to: {screenshot_path}")

    elements_to_check = [
        ("body", "body"),
        ("content_for_layout_wrapper", "div[style*='--background-color:']"),
        ("main_shopify_sections_container", ".shopify-section"), # General Shopify section
        ("main_section_class", ".section"),
        ("main_container_class", ".container"),
        ("featured_collection_homepage_content", ".homepage_content") # Specific to featured collection section
    ]

    for name, selector in elements_to_check:
        try:
            element = await page.query_selector(selector)
            if element:
                print(f"\n--- Computed Styles for: {name} ({selector}) ---")
                computed_styles = await page.evaluate(f"""
                    (selector) => {{
                        const el = document.querySelector(selector);
                        if (!el) return null;
                        const style = window.getComputedStyle(el);
                        return {{
                            display: style.display,
                            position: style.position,
                            width: style.width,
                            maxWidth: style.maxWidth,
                            marginLeft: style.marginLeft,
                            marginRight: style.marginRight,
                            textAlign: style.textAlign,
                            justifyContent: style.justifyContent,
                            alignItems: style.alignItems,
                            paddingLeft: style.paddingLeft,
                            paddingRight: style.paddingRight,
                        }};
                    }}
                """, selector)
                if computed_styles:
                    for prop, value in computed_styles.items():
                        print(f"  {prop}: {value}")
                else:
                    print(f"  Element '{name}' found but could not get computed styles.")
            else:
                print(f"\n--- Element '{name}' ({selector}) not found on the page. ---")
        except Exception as e:
            print(f"\n--- Error checking '{name}' ({selector}): {e} ---")

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch() # headless=False for visual debugging
        page = await browser.new_page()
        await debug_homepage_layout(page, "https://toonieauction.com/?pb=0")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main()) 