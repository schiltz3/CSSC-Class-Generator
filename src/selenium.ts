import { Builder, By, Capabilities, ThenableWebDriver, until, WebElement, WebElementCondition } from 'selenium-webdriver';
import chrome, { Options } from 'selenium-webdriver/chrome';


export interface Class {
    code: string,
    title: string,
    info: string
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

async function get_class_info(course_element: WebElement): Promise<string> {
    const description_element = await course_element.findElement(By.className("section__content"));
    return await description_element.getText()
}

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
        for (let course_element_i in course_elements) {
            let course_element = course_elements[course_element_i]

            const [number, title] = await Promise.all([
                course_element.findElement(By.className("result__code")).getText(),
                course_element.findElement(By.className("result__title")).getText()
            ])

            await course_element.click();

            //wait for panel to load
            const content_element = await driver.wait(until.elementLocated(By.className("panel panel--2x panel--kind-details panel--visible")));

            const info = await get_class_info(content_element)
            console.log(info)

            var course: Class = {
                code: number,
                title: title,
                info: info
            }
            courses_list.push(course)
        }

    } finally {
        // await driver.sleep(1000)
        await driver.quit();
        return courses_list
    }
};