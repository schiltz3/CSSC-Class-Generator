import { Builder, By, Capabilities, until } from 'selenium-webdriver';
import chrome, { Options } from 'selenium-webdriver/chrome';

// const path = 'E:/git/CSSC-Class-Generator/chromedriver_win32_105/chromedriver.exe'
// chromedriver for chrome version 104
const path = 'E:/git/CSSC-Class-Generator/chromedriver_win32_104/chromedriver.exe'
const service = new chrome.ServiceBuilder(path);

let capabilities = new Capabilities();
capabilities.setPageLoadStrategy("eager");

let options = new Options();
options.headless();

const driver = new Builder()
    .withCapabilities(capabilities)
    .setChromeOptions(options)
    .forBrowser('chrome')
    .setChromeService(service)
    .build();

export interface Class {
    number: string,
    title: string,
}

// TODO: Swap to headless chrome
export async function get_classes(semester: string, major: string) {
    let classes_obj: Class[] = []

    try {
        await driver.get('https://catalog.uwm.edu/course-search');

        const semesters = await driver.findElements(By.css("option"));
        semesters.forEach(async (item) => {
            let text = await item.getText()
            if (text.startsWith(semester)) {
                await item.click();
            }
        });

        await driver.findElement(By.css("option[value='" + major + "']")).click();

        await driver.findElement(By.id("search-button")).click();

        // Allow results to load
        await driver.wait(until.elementsLocated(By.className("result result--group-start")))

        const classes = await driver.findElements(By.className("result result--group-start"));
        classes.forEach(async (item) => {
            const number = (await item.findElement(By.className("result__code")).getText()).split(" ")[1]
            const title = await item.findElement(By.className("result__title")).getText()
            var _class: Class = {
                number: number,
                title: title
            }
            classes_obj.push(_class)
        });

    } finally {
        await driver.sleep(1000)
        await driver.quit();
        return classes_obj
    }
};