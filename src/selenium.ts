import { Builder, By, Capabilities, ThenableWebDriver, until } from 'selenium-webdriver';
import chrome, { Options } from 'selenium-webdriver/chrome';


export interface Class {
    number: string,
    title: string,
}

export function setup(driver_path: string) {
    // const path = 'E:/git/CSSC-Class-Generator/chromedriver_win32_105/chromedriver.exe'
    // chromedriver for chrome version 104
    const service = new chrome.ServiceBuilder(driver_path);

    let capabilities = new Capabilities();
    capabilities.setPageLoadStrategy("eager");

    let options = new Options();
    // options.headless();

    const driver = new Builder()
        .withCapabilities(capabilities)
        .setChromeOptions(options)
        .forBrowser('chrome')
        .setChromeService(service)
        .build();
    return driver
}

export async function get_semester() {

}
export async function get_majors() {

}

async function get_class_info(course: WebElement) {

}

// TODO: Swap to headless chrome
export async function get_classes(driver: ThenableWebDriver, semester: string, major: string) {
    let classes_obj: Class[] = []

    try {
        await driver.get('https://catalog.uwm.edu/course-search');

        const [semesters, subject, search_button] = await Promise.all([
            driver.findElements(By.css("option")),
            driver.findElement(By.css("option[value='" + major + "']")),
            driver.findElement(By.id("search-button"))
        ])

        semesters.forEach(async (item) => {
            let text = await item.getText()
            if (text.startsWith(semester)) {
                await item.click();
            }
        });

        await subject.click();
        await search_button.click();

        // Allow results to load
        await driver.wait(until.elementsLocated(By.className("result result--group-start")))

        const classes = await driver.findElements(By.className("result result--group-start"));
        classes.forEach(async (item) => {
            const number = await item.findElement(By.className("result__code")).getText()
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