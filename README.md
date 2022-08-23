# CSSC-Class-Generator

Currently hard coded to get the list of Fall classes for COMPSCI

Comment out `options.headless();` on line 13 in `selenium.ts` to watch the actions take place in browser


### Accepted arguemtns
Function `get_classes` takes two args: 

`semester: string` : "Spring", "Summer", "Fall" or "UWinteriM"

`major: string` : All caps words before hyphen ex: 

![Screenshot 2022-08-23 110832](https://user-images.githubusercontent.com/45466247/186207935-d3046d6b-6c5a-4e4c-bd2d-adeb703f1ac7.png)


### How to run
install all packages then run: `tcx ts-node ./src/index.tx`


###TODO:
dynamically download correct chrome driver
