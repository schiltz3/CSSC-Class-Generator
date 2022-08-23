import { get_classes, setup } from './selenium';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';


function saveData(filename: string, data: any) {
    let dir = resolve(__dirname + "\\..\\data")
    if (!existsSync(dir)) {
        mkdirSync(dir);
    }
    writeFile(resolve(dir + "\\" + filename + ".json"), JSON.stringify(data), {
        encoding: 'utf8',
    });
}


// getData();
const semester = "Fall"
const major_code = "COMPSCI"
// get_classes(year, major)
const driver_path = 'E:/git/CSSC-Class-Generator/chromedriver_win32_104/chromedriver.exe'
const driver = setup(driver_path)

get_classes(driver, semester, major_code).then((classes) => {
    saveData(major_code + "-" + semester + "-Class-List", classes)
})