const puppeteer = module.require('puppeteer');

var isHeadless = true;

module.exports = async( username, password ) => {
    const browser = await puppeteer.launch({headless: isHeadless});
    const page    = await browser.newPage();
    await page.goto('https://sistemas.ufal.br/academico/login.seam');

    await page.type('[id="loginForm:username"]', username);
    await page.type('[id="loginForm:password"]', password);
    await page.click('[id="loginForm:entrar"]');
    await page.waitForNavigation();

    var url = page.url();

    await browser.close();

    return url;
};

