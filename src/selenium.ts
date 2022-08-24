import { Builder, By, Capabilities, ThenableWebDriver, until, WebElement } from 'selenium-webdriver';
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
    options.headless();
    // Must set size in headless mode to stop failing after first iteration when trying to click element
    options.addArguments("--window-size=1400x1000")

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

export async function get_major_codes(driver: ThenableWebDriver) {
    let subjects: string[] = []
    try {
        await driver.get('https://catalog.uwm.edu/course-search');
        const subject_element = await driver.findElement(By.css("#crit-subject"));
        const subject_elements = await subject_element.findElements(By.xpath(".//option"));
        for (let subject of subject_elements) {
            const code = await subject.getAttribute("value")
            driver.sleep(1)
            subjects.push(code)
        }
    } finally {
        await driver.quit();
        return subjects
    }
}

async function get_class_info(course_element: WebElement): Promise<string> {
    const description_element = await course_element.findElement(By.className("section__content"));
    return await description_element.getText()
}

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
        console.info("Discovered: " + course_elements.length + " courses")

        let course_count = 0
        for (let course_element of course_elements) {

            const [number, title, result_link] = await Promise.all([
                course_element.findElement(By.className("result__code")).getText(),
                course_element.findElement(By.className("result__title")).getText(),
                course_element.findElement(By.xpath(".//a"))
            ])

            await course_element.click();

            const content_element = await driver.wait(until.elementLocated(By.className("panel panel--2x panel--kind-details panel--visible")));

            // Wait until ajax has loaded the class info
            // ajax does not reload the entire page, so this must be done manually
            let link = ""
            do {
                link = await result_link.getAttribute("class");
                await driver.sleep(25)
            } while (link != "result__link result__link--viewing")

            const info = await get_class_info(content_element)

            var course: Class = {
                code: number,
                title: title,
                info: info
            }
            courses_list.push(course)
            console.info(++course_count)
        }

    } finally {
        await driver.quit();
        return courses_list
    }
};