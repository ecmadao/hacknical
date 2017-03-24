const phantom = require('phantom');

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

(async function() {
    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.property('viewportSize', {width: 1024, height: 600});
    const status = await page.open('http://hacknical.com/resume/qagw8ZXyNhrGbXMHi0BfMNdvZtA=');
    console.log(`Page opened with status [${status}].`);

    await wait(7000);
    await page.render('../hacknical-qagw8ZXyNhrGbXMHi0BfMNdvZtA-resume.pdf');
    console.log(`File created at [./hacknical-ecmadao.pdf]`);

    await instance.exit();
}());
