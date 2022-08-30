import { get_classes, get_major_codes, get_semesters, setup } from "./selenium";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { resolve } from "path";

function saveData(filename: string, data: any) {
  let dir = resolve(__dirname + "\\..\\data");
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
  writeFile(resolve(dir + "\\" + filename + ".json"), JSON.stringify(data), {
    encoding: "utf8",
  });
}

const semester = "Fall";
const major_code = "COMPSCI";
const driver_path =
  "E:/git/CSSC-Class-Generator/chromedriver_win32_104/chromedriver.exe";

let driver = setup(driver_path);

get_semesters(driver).then((semesters) => {
  saveData("Semesters", semesters);
});

driver = setup(driver_path);
get_major_codes(driver).then((codes) => {
  saveData("Major Codes", codes);
});

driver = setup(driver_path);
get_classes(driver, semester, major_code).then((classes) => {
  saveData(major_code + "-" + semester + "-Class-List", classes);
});
