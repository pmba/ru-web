const User = module.require('../../models/user');
const puppeteer = module.require('puppeteer');

module.exports = {
    collectData: async (username, password) => {
        try {
            const browser = await puppeteer.launch({
                'args' : [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                ]
            });
            console.log('Headless browser launched');

            const page = await browser.newPage();
            await page.goto('https://sistemas.ufal.br/academico/login.seam');
            console.log('Entering sistemas.ufal.br')

            await page.type('[id="loginForm:username"]', username);
            await page.type('[id="loginForm:password"]', password);

            await page.screenshot({
                path: 'home.png'
            });

            await Promise.all([
                page.waitForNavigation(),
                page.click('[id="loginForm:entrar"]')
            ]);

            console.log(`Logging in ${username} . . .`);

            var url = page.url().split('?');

            if (url.length > 1) {
                var cid = url[1].split('=');

                await page.screenshot({
                    path: 'logged.png'
                });

                var selector = await page.evaluate(() => document.querySelector('[name="j_id243:j_id247"]'));
                if(selector) {
                    await Promise.all([
                      page.waitForNavigation(),
                      page.click('[name="j_id243:j_id247"]')
                    ]);
                }

                await page.goto(`https://sistemas.ufal.br/academico/matricula/visualizar.seam?cid=${cid[1]}`);
                //Gets student name

                await page.screenshot({
                    path: 'details.png'
                });

                var registration = await page.evaluate(() => document.querySelector('[id="matricula"]').textContent);
                var name = await page.evaluate(() => document.querySelector('[id="nome"]').textContent);
                var course =  await page.evaluate(() => document.querySelector('[id="curso"]').textContent.split('-')[0].slice(0,-1));

                // if (registration == null) {
                //     registration = await page.evaluate(() => document.getElementById('j_id243:comboMatricula')
                //         .textContent
                //         .slice(1, 9));
                //     //.innerHTML.slice(24,32));
                // }

                await browser.close();

                var newUser = new User({
                    username: username,
                    password: password,
                    name: name,
                    registration: registration,
                    course: course,
                    wallet: 0
                });

                return newUser;

            } else {
                await browser.close();
                console.log("Incorrect CPF or PASSWORD")
                return null;
            }
        } catch (err) {
            console.log(err)
        }
    }
}
