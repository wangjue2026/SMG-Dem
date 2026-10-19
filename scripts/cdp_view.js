#!/usr/bin/env node
/**
 * 常驻调试浏览器辅助脚本（连接本机已开启 CDP 的 Chrome，不做启动/关闭）
 *
 * 用法：
 *   node scripts/cdp_view.js                      # 复用当前标签页，输出页面标题与可见文本摘要
 *   node scripts/cdp_view.js --reload             # 忽略缓存刷新当前页面
 *   node scripts/cdp_view.js --shot /tmp/a.png    # 截图（可配 --reload 一起用）
 *   node scripts/cdp_view.js --url <url>          # 切到指定页面（已有则复用，没有则新开）
 *   node scripts/cdp_view.js --eval "expr"        # 在页面中执行只读表达式并打印结果
 *   node scripts/cdp_view.js --width 1920 --height 1080
 *
 * 前置：Chrome 需以 --remote-debugging-port=9222 启动（见本文件顶部说明）。
 */
const puppeteer = require('puppeteer');

const DEFAULT_URL =
  'http://localhost:8765/07-%E6%96%B9%E6%A1%88%E4%B8%83/DEM-%E7%94%A8%E6%88%B7%E8%AF%A6%E6%83%85.html?type=%E7%94%A8%E6%88%B7&empId=45232&name=%E4%BD%95%E6%80%BB';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(name);
  return idx >= 0 && args[idx + 1] ? args[idx + 1] : fallback;
};
const hasFlag = name => args.includes(name);

(async () => {
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null
  });

  const explicitUrl = getArg('--url', null);
  const targetUrl = explicitUrl || DEFAULT_URL;
  const pages = await browser.pages();
  let page = explicitUrl
    ? pages.find(p => p.url() === targetUrl) || pages.find(p => p.url().includes(targetUrl.split('?')[0]))
    : pages.find(p => p.url().startsWith('http'));

  if (!page) {
    page = pages.find(p => p.url().startsWith('http')) || await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } else if (explicitUrl && page.url() !== targetUrl) {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } else if (hasFlag('--reload')) {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000, ignoreCache: true });
  }

  const width = parseInt(getArg('--width', '0'), 10);
  const height = parseInt(getArg('--height', '0'), 10);
  if (width && height) {
    await page.setViewport({ width, height });
  }

  await page.bringToFront();
  await new Promise(r => setTimeout(r, 800));

  const evalExpr = getArg('--eval', null);
  if (evalExpr) {
    const value = await page.evaluate(expr => {
      // eslint-disable-next-line no-eval
      return eval(expr);
    }, evalExpr);
    console.log(typeof value === 'string' ? value : JSON.stringify(value, null, 2));
  } else {
    const summary = await page.evaluate(() => ({
      title: document.title,
      url: location.href,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      hasAlpine: !!window.Alpine,
      textSample: document.body.innerText.replace(/\s+/g, ' ').slice(0, 120)
    }));
    console.log(JSON.stringify(summary, null, 2));
  }

  const shotPath = getArg('--shot', null);
  if (shotPath) {
    await page.screenshot({ path: shotPath });
    console.log('screenshot: ' + shotPath);
  }

  // 只断开连接，不关闭浏览器
  await browser.disconnect();
})();
