const User = module.require('../../models/user');
const puppeteer = module.require('puppeteer');

module.exports = {
    collectData: async (username, password) => {

         const browser = await puppeteer.launch();
         console.log('Headless browser launched');

         const page = await browser.newPage();
         await page.goto('https://sistemas.ufal.br/academico/login.seam');
         console.log('Entering sistemas.ufal.br')

         await page.type('[id="loginForm:username"]', username);
         await page.type('[id="loginForm:password"]', password);
         await page.click('[id="loginForm:entrar"]');
         console.log('Logging in with', username, password);

         var url = page.url().split('?');
         console.log(url);

         if (url.length > 1) {
             var cid = url[1].split('=');

             await page.goto(`https://sistemas.ufal.br/academico/matricula/visualizar.seam?cid=${cid[1]}`);
             await page.screenshot({
                 path: 'screenshot.png'
             });

             //Gets student name
             var name = await page.evaluate( () =>
               document.querySelector('[id="j_id10"]')
               .textContent
               .split('(')[0]
               .slice(2, -1)
             );

             await browser.close();

             var newUser = new User({
                 username: username,
                 password: password,
                 name: name,
                 registration: '0000'
             });

             return await newUser;

        } else {
             await browser.close();
             return await null;
        }
    }
}
