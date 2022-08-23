import { get_classes } from './selenium';
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
const major = "COMPSCI"
// get_classes(year, major)
get_classes(semester, major).then((classes) => {
    saveData(major + "-" + semester + "-Class-List", classes)
})