import puppeteer, { Browser, Page, ElementHandle } from 'puppeteer';

describe('Article Management E2E', () => {
  let browser: Browser;
  let page: Page;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
  });

  afterEach(async () => {
    await page.close();
  });

  async function login(email: string, password: string): Promise<void> {
    await page.goto(`${baseUrl}/auth/login`);
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  }

  describe('Admin Article Management', () => {
    beforeEach(async () => {
      await login('admin@test.com', 'password123');
    });

    it('should create a new article', async () => {
      // Navigate to new article page
      await page.goto(`${baseUrl}/admin/articles/new`);
      await page.waitForSelector('input[name="title"]');

      // Fill in article details
      await page.type('input[name="title"]', 'E2E Test Article');
      await page.type('textarea[name="summary"]', 'This is a test article created by E2E test');
      
      // Wait for TinyMCE editor to load
      await page.waitForSelector('.tox-edit-area');
      await page.evaluate(() => {
        (window as any).tinymce.activeEditor.setContent('Test article content created by E2E test');
      });

      // Select category
      await page.select('select[name="category"]', 'BLOG');

      // Upload test image
      const uploadInput = await page.$('input[type="file"]') as ElementHandle<HTMLInputElement>;
      if (uploadInput) {
        await uploadInput.uploadFile('public/images/placeholder.jpg');
      }

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for redirect to articles list
      await page.waitForNavigation();
      expect(page.url()).toBe(`${baseUrl}/admin/articles`);

      // Verify article appears in list
      const articleTitle = await page.waitForSelector('text/E2E Test Article');
      expect(articleTitle).toBeTruthy();
    });

    it('should edit an existing article', async () => {
      // Navigate to articles list
      await page.goto(`${baseUrl}/admin/articles`);
      
      // Click edit button for first article
      await page.waitForSelector('[data-testid="edit-article-button"]');
      await page.click('[data-testid="edit-article-button"]');

      // Wait for edit form to load
      await page.waitForSelector('input[name="title"]');

      // Update title
      await page.evaluate(() => {
        const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
        titleInput.value = '';
      });
      await page.type('input[name="title"]', 'Updated E2E Test Article');

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for redirect to articles list
      await page.waitForNavigation();
      expect(page.url()).toBe(`${baseUrl}/admin/articles`);

      // Verify updated title appears in list
      const updatedTitle = await page.waitForSelector('text/Updated E2E Test Article');
      expect(updatedTitle).toBeTruthy();
    });

    it('should delete an article', async () => {
      // Navigate to articles list
      await page.goto(`${baseUrl}/admin/articles`);
      
      // Get initial article count
      const initialCount = await page.$$eval(
        '[data-testid="article-item"]',
        (items: Element[]): number => items.length
      );

      // Click delete button for first article
      await page.waitForSelector('[data-testid="delete-article-button"]');
      await page.click('[data-testid="delete-article-button"]');

      // Confirm deletion in modal
      await page.waitForSelector('[data-testid="confirm-delete-button"]');
      await page.click('[data-testid="confirm-delete-button"]');

      // Wait for article to be removed
      await page.waitForFunction(
        (expectedCount: number): boolean => {
          return document.querySelectorAll('[data-testid="article-item"]').length === expectedCount - 1;
        },
        {},
        initialCount
      );

      // Verify article count decreased
      const finalCount = await page.$$eval(
        '[data-testid="article-item"]',
        (items: Element[]): number => items.length
      );
      expect(finalCount).toBe(initialCount - 1);
    });
  });

  describe('Public Article Viewing', () => {
    it('should display published articles on the home page', async () => {
      await page.goto(baseUrl);
      
      // Wait for articles to load
      await page.waitForSelector('[data-testid="article-grid"]');
      
      // Verify articles are displayed
      const articles = await page.$$('[data-testid="article-item"]');
      expect(articles.length).toBeGreaterThan(0);
    });

    it('should navigate to article detail page', async () => {
      await page.goto(baseUrl);
      
      // Click first article
      await page.waitForSelector('[data-testid="article-item"]');
      const articleTitle = await page.$eval(
        '[data-testid="article-item"] h2',
        (el: Element): string => el.textContent || ''
      );
      await page.click('[data-testid="article-item"]');

      // Verify navigation to detail page
      await page.waitForSelector('h1');
      const detailTitle = await page.$eval(
        'h1',
        (el: Element): string => el.textContent || ''
      );
      expect(detailTitle).toBe(articleTitle);
    });

    it('should filter articles by category', async () => {
      await page.goto(`${baseUrl}/blog`);
      
      // Click category filter
      await page.waitForSelector('[data-testid="category-filter"]');
      await page.select('[data-testid="category-filter"]', 'REVIEW');

      // Wait for filtered results
      await page.waitForSelector('[data-testid="article-grid"]');
      
      // Verify all displayed articles are reviews
      const categories = await page.$$eval(
        '[data-testid="article-category"]',
        (elements: Element[]): string[] => 
          elements.map((el: Element): string => el.textContent || '')
      );
      expect(categories.every((category: string): boolean => category === 'REVIEW')).toBe(true);
    });
  });
});