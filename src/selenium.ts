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

// async function get_class_info(course: WebElement) {

// }

// TODO: Swap to headless chrome
export async function get_classes(driver: ThenableWebDriver, semester: string, subject: string) {
    let courses_list: Class[] = []

    try {
        await driver.get('https://catalog.uwm.edu/course-search');

        const [semester_elements, subject_element, search_button_element] = await Promise.all([
            driver.findElements(By.css("option")),
            driver.findElement(By.css("option[value='" + subject + "']")),
            driver.findElement(By.id("search-button"))
        ])

        semester_elements.forEach(async (semester_element) => {
            let text = await semester_element.getText()
            if (text.startsWith(semester)) {
                await semester_element.click();
            }
        });

        await subject_element.click();
        await search_button_element.click();

        // Allow results to load
        const course_elements = await driver.wait(until.elementsLocated(By.className("result result--group-start")))

        //waits
        course_elements.forEach(async (course_element) => {
            const [number, title] = await Promise.all([
                course_element.findElement(By.className("result__code")).getText(),
                course_element.findElement(By.className("result__title")).getText()
            ])
            var course: Class = {
                number: number,
                title: title
            }
            courses_list.push(course)
        });

    } finally {
        await driver.sleep(1000)
        await driver.quit();
        return courses_list
    }
};