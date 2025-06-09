import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';
import { chromium } from 'playwright';

const INPUT_CSV = 'products_export.csv';
const OUTPUT_CSV = 'products_with_prices.csv';

// 读取商品标题
function readProductTitles(inputFile) {
  return new Promise((resolve, reject) => {
    const titles = [];
    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (row) => {
        if (row['Title'] && !titles.includes(row['Title'])) {
          titles.push(row['Title']);
        }
      })
      .on('end', () => {
        resolve(titles);
      })
      .on('error', reject);
  });
}

// 读取所有行，后续写回
function readAllRows(inputFile) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

async function searchAmazon(page, title) {
  try {
    await page.goto('https://www.amazon.com', { timeout: 60000 });
    await page.fill('#twotabsearchtextbox', title);
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-component-type="s-search-result"]', { timeout: 60000 });
    const price = await page.locator('.a-price .a-offscreen').first().textContent();
    // 点击第一个商品，进入详情页
    await page.locator('[data-component-type="s-search-result"]').first().click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    // 抓取描述（例如，在 #productDescription 或 #feature-bullets 中）
    const description = await page.locator('#productDescription, #feature-bullets').textContent().catch(() => '');
    // 抓取商品尺寸（例如，在 #detailBullets_feature_div 中，或通过正则匹配）
    const sizeText = await page.locator('#detailBullets_feature_div, #prodDetails').textContent().catch(() => '');
    const sizeMatch = sizeText.match(/size\s*:?\s*([^,;]+)/i);
    const productSize = sizeMatch ? sizeMatch[1].trim() : '';
    console.log("Amazon 抓取字段:", { price, description, productSize });
    return { price: price ? price.trim() : '', description, productSize };
  } catch (e) {
    console.log("Amazon 抓取错误:", e);
    return { price: '', description: '', productSize: '' };
  }
}

async function searchEbay(page, title) {
  try {
    await page.goto('https://www.ebay.com', { timeout: 60000 });
    await page.fill('#gh-ac', title);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.s-item__price', { timeout: 60000 });
    const price = await page.locator('.s-item__price').first().textContent();
    // 点击第一个商品，进入详情页
    await page.locator('.s-item__link').first().click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    // 抓取描述（例如，在 #itemDescription 中）
    const description = await page.locator('#itemDescription').textContent().catch(() => '');
    // 抓取商品尺寸（例如，在 .ux-labels-values__labels 中，或通过正则匹配）
    const sizeText = await page.locator('.ux-labels-values__labels, .ux-labels-values__values').textContent().catch(() => '');
    const sizeMatch = sizeText.match(/size\s*:?\s*([^,;]+)/i);
    const productSize = sizeMatch ? sizeMatch[1].trim() : '';
    console.log("eBay 抓取字段:", { price, description, productSize });
    return { price: price ? price.trim() : '', description, productSize };
  } catch (e) {
    console.log("eBay 抓取错误:", e);
    return { price: '', description: '', productSize: '' };
  }
}

async function searchWalmart(page, title) {
  try {
    await page.goto('https://www.walmart.com', { timeout: 60000 });
    await page.fill('input[aria-label="Search Walmart.com"]', title);
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-item-id]', { timeout: 60000 });
    // Walmart 价格选择器可能有变化，尝试多种方式
    const price = await page.locator('[data-automation-id="product-price"], span[class*=price]').first().textContent();
    // 点击第一个商品，进入详情页
    await page.locator('[data-item-id]').first().click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    // 抓取描述（例如，在 [data-automation-id="product-description"] 中）
    const description = await page.locator('[data-automation-id="product-description"]').textContent().catch(() => '');
    // 抓取商品尺寸（例如，在 [data-automation-id="product-specifications"] 中，或通过正则匹配）
    const sizeText = await page.locator('[data-automation-id="product-specifications"]').textContent().catch(() => '');
    const sizeMatch = sizeText.match(/size\s*:?\s*([^,;]+)/i);
    const productSize = sizeMatch ? sizeMatch[1].trim() : '';
    console.log("Walmart 抓取字段:", { price, description, productSize });
    return { price: price ? price.trim() : '', description, productSize };
  } catch (e) {
    console.log("Walmart 抓取错误:", e);
    return { price: '', description: '', productSize: '' };
  }
}

async function searchTemu(page, title) {
  try {
    await page.goto('https://www.temu.com', { timeout: 60000 });
    // 假设搜索框的 aria-label 为 "Search Temu"
    await page.fill('input[aria-label="Search Temu"]', title);
    await page.keyboard.press('Enter');
    await page.waitForSelector('[data-item-id]', { timeout: 60000 });
    const price = await page.locator('[data-automation-id="product-price"], span[class*=price]').first().textContent();
    // 点击第一个商品，进入详情页
    await page.locator('[data-item-id]').first().click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
    // 抓取描述（例如，在 [data-automation-id="product-description"] 中）
    const description = await page.locator('[data-automation-id="product-description"]').textContent().catch(() => '');
    // 抓取商品尺寸（例如，在 [data-automation-id="product-specifications"] 中，或通过正则匹配）
    const sizeText = await page.locator('[data-automation-id="product-specifications"]').textContent().catch(() => '');
    const sizeMatch = sizeText.match(/size\s*:?\s*([^,;]+)/i);
    const productSize = sizeMatch ? sizeMatch[1].trim() : '';
    console.log("Temu 抓取字段:", { price, description, productSize });
    return { price: price ? price.trim() : '', description, productSize };
  } catch (e) {
    console.log("Temu 抓取错误:", e);
    return { price: '', description: '', productSize: '' };
  }
}

async function searchGoogle(page, title) {
  try {
    await page.goto('https://www.google.com', { timeout: 60000 });
    await page.fill('input[name="q"]', title + " buy");
    await page.keyboard.press('Enter');
    await page.waitForSelector('a[href]', { timeout: 60000 });
    // 过滤掉 Amazon、eBay、Walmart、Temu 的链接，抓取第一个独立站链接
    const links = await page.$$('a[href]');
    let indyLink = null;
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.includes('amazon.com') && !href.includes('ebay.com') && !href.includes('walmart.com') && !href.includes('temu.com')) {
        indyLink = href;
        break;
      }
    }
    if (indyLink) {
      await page.goto(indyLink, { timeout: 60000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
      // 抓取价格（假设独立站价格在 span[class*=price] 中）
      const price = await page.locator('span[class*=price]').first().textContent().catch(() => '');
      // 抓取描述（假设描述在 meta[name="description"] 中，或页面中某 div 中）
      const description = await page.locator('meta[name="description"]').getAttribute('content').catch(() => '');
      // 抓取商品尺寸（假设尺寸在页面某 div 中，或通过正则匹配）
      const sizeText = await page.locator('div:has-text("size")').textContent().catch(() => '');
      const sizeMatch = sizeText.match(/size\s*:?\s*([^,;]+)/i);
      const productSize = sizeMatch ? sizeMatch[1].trim() : '';
      console.log("Google 抓取字段:", { price, description, productSize });
      return { price: price ? price.trim() : '', description, productSize };
    } else {
      console.log("Google 未找到独立站链接");
      return { price: '', description: '', productSize: '' };
    }
  } catch (e) {
    console.log("Google 抓取错误:", e);
    return { price: '', description: '', productSize: '' };
  }
}

async function scrapePrices(titles) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const results = {};
  // 只抓取第一个商品，方便调试
  const title = titles[0];
  console.log(`正在抓取: ${title}`);
  const amazon = await searchAmazon(page, title);
  console.log("Amazon 抓取结果:", amazon);
  const ebay = await searchEbay(page, title);
  console.log("eBay 抓取结果:", ebay);
  const walmart = await searchWalmart(page, title);
  console.log("Walmart 抓取结果:", walmart);
  const temu = await searchTemu(page, title);
  console.log("Temu 抓取结果:", temu);
  const google = await searchGoogle(page, title);
  console.log("Google 抓取结果:", google);
  results[title] = { amazon, ebay, walmart, temu, google };
  await browser.close();
  fs.writeFileSync("output.md", JSON.stringify(results, null, 2));
  console.log("抓取结果已写入 output.md");
  return results;
}

async function main() {
  const [titles, allRows] = await Promise.all([
    readProductTitles(INPUT_CSV),
    readAllRows(INPUT_CSV)
  ]);
  const priceMap = await scrapePrices(titles);
  // 构造输出
  const csvWriter = createObjectCsvWriter({
    path: OUTPUT_CSV,
    header: [
      ...Object.keys(allRows[0]),
      { id: 'Amazon Price', title: 'Amazon Price' },
      { id: 'Amazon Description', title: 'Amazon Description' },
      { id: 'Amazon Product Size', title: 'Amazon Product Size' },
      { id: 'eBay Price', title: 'eBay Price' },
      { id: 'eBay Description', title: 'eBay Description' },
      { id: 'eBay Product Size', title: 'eBay Product Size' },
      { id: 'Walmart Price', title: 'Walmart Price' },
      { id: 'Walmart Description', title: 'Walmart Description' },
      { id: 'Walmart Product Size', title: 'Walmart Product Size' },
      { id: 'Temu Price', title: 'Temu Price' },
      { id: 'Temu Description', title: 'Temu Description' },
      { id: 'Temu Product Size', title: 'Temu Product Size' },
      { id: 'Google Price', title: 'Google Price' },
      { id: 'Google Description', title: 'Google Description' },
      { id: 'Google Product Size', title: 'Google Product Size' }
    ]
  });

  const outputRows = allRows.map(row => {
    const title = row['Title'];
    const amazon = priceMap[title]?.amazon || { price: '', description: '', productSize: '' };
    const ebay = priceMap[title]?.ebay || { price: '', description: '', productSize: '' };
    const walmart = priceMap[title]?.walmart || { price: '', description: '', productSize: '' };
    const temu = priceMap[title]?.temu || { price: '', description: '', productSize: '' };
    const google = priceMap[title]?.google || { price: '', description: '', productSize: '' };
    return {
      ...row,
      'Amazon Price': amazon.price,
      'Amazon Description': amazon.description,
      'Amazon Product Size': amazon.productSize,
      'eBay Price': ebay.price,
      'eBay Description': ebay.description,
      'eBay Product Size': ebay.productSize,
      'Walmart Price': walmart.price,
      'Walmart Description': walmart.description,
      'Walmart Product Size': walmart.productSize,
      'Temu Price': temu.price,
      'Temu Description': temu.description,
      'Temu Product Size': temu.productSize,
      'Google Price': google.price,
      'Google Description': google.description,
      'Google Product Size': google.productSize
    };
  });

  await csvWriter.writeRecords(outputRows);
  console.log(`已写入 ${OUTPUT_CSV}`);
}

main(); 