import csv
import asyncio
from playwright.async_api import async_playwright
import pandas as pd
from datetime import datetime
import time
import random

class PriceScraper:
    def __init__(self):
        self.results = []
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        }

    async def search_amazon(self, page, product_title):
        try:
            # 访问 Amazon
            await page.goto('https://www.amazon.com')
            
            # 等待搜索框加载
            await page.wait_for_selector('#twotabsearchtextbox')
            
            # 输入搜索词
            await page.fill('#twotabsearchtextbox', product_title)
            await page.press('#twotabsearchtextbox', 'Enter')
            
            # 等待搜索结果加载
            await page.wait_for_selector('[data-component-type="s-search-result"]')
            
            # 获取第一个商品的价格
            price_element = await page.query_selector('.a-price .a-offscreen')
            if price_element:
                price_text = await price_element.text_content()
                return price_text.strip()
            return "Not found"
        except Exception as e:
            print(f"Amazon search error for {product_title}: {str(e)}")
            return "Error"

    async def search_ebay(self, page, product_title):
        try:
            # 访问 eBay
            await page.goto('https://www.ebay.com')
            
            # 等待搜索框加载
            await page.wait_for_selector('#gh-ac')
            
            # 输入搜索词
            await page.fill('#gh-ac', product_title)
            await page.press('#gh-ac', 'Enter')
            
            # 等待搜索结果加载
            await page.wait_for_selector('.s-item__price')
            
            # 获取第一个商品的价格
            price_element = await page.query_selector('.s-item__price')
            if price_element:
                price_text = await price_element.text_content()
                return price_text.strip()
            return "Not found"
        except Exception as e:
            print(f"eBay search error for {product_title}: {str(e)}")
            return "Error"

    async def search_walmart(self, page, product_title):
        try:
            # 访问 Walmart
            await page.goto('https://www.walmart.com')
            
            # 等待搜索框加载
            await page.wait_for_selector('#global-search-input')
            
            # 输入搜索词
            await page.fill('#global-search-input', product_title)
            await page.press('#global-search-input', 'Enter')
            
            # 等待搜索结果加载
            await page.wait_for_selector('[data-item-id]')
            
            # 获取第一个商品的价格
            price_element = await page.query_selector('[data-automation-id="product-price"]')
            if price_element:
                price_text = await price_element.text_content()
                return price_text.strip()
            return "Not found"
        except Exception as e:
            print(f"Walmart search error for {product_title}: {str(e)}")
            return "Error"

    async def process_product(self, page, product_title):
        # 添加随机延迟，避免被反爬
        await asyncio.sleep(random.uniform(2, 5))
        
        amazon_price = await self.search_amazon(page, product_title)
        await asyncio.sleep(random.uniform(2, 5))
        
        ebay_price = await self.search_ebay(page, product_title)
        await asyncio.sleep(random.uniform(2, 5))
        
        walmart_price = await self.search_walmart(page, product_title)
        
        return {
            'Title': product_title,
            'Amazon Price': amazon_price,
            'eBay Price': ebay_price,
            'Walmart Price': walmart_price,
            'Timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    async def scrape_prices(self, input_csv):
        # 读取输入 CSV 文件
        df = pd.read_csv(input_csv)
        product_titles = df['Title'].unique().tolist()
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent=self.headers['User-Agent']
            )
            page = await context.new_page()
            
            for title in product_titles:
                if pd.isna(title):
                    continue
                    
                result = await self.process_product(page, title)
                self.results.append(result)
                print(f"Processed: {title}")
                
                # 每处理 5 个商品保存一次结果
                if len(self.results) % 5 == 0:
                    self.save_results()
            
            await browser.close()
            
        # 最后保存一次结果
        self.save_results()

    def save_results(self):
        # 将结果保存为 CSV
        output_filename = f'price_results_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        df = pd.DataFrame(self.results)
        df.to_csv(output_filename, index=False)
        print(f"Results saved to {output_filename}")

async def main():
    scraper = PriceScraper()
    await scraper.scrape_prices('products_export.csv')

if __name__ == "__main__":
    asyncio.run(main()) 