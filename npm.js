// npm
// 1) It helps to reuse our code in other projects
// 2) It helps to use code of other developers
// 3) We can share our solutions with other developers
// we use packages , modules and dependencies al almost mean same
// in node_modules we have dependencies
// some dependencies itself have more dependencies like bootstrap
// see package.json to know the dependencies we installed

// npm - global command comes with node
// npm --version
// localdependancy- use it only in this project
// npm i <packageName>     eg: npm i lodash
// globaldependancy- use it in any project
// npm install -g <packageName>

// First package
// package.json- manifest file(stores important info about project or package)
// manual approach(create package.json in root,create properties etc..)
// npm init(step by step, press enter to skip)
// npm init -y(everything default)
// except nodemodules all will be sent as if their is no nodemodule they can't run by simply taking code from repositry
// if we do npm install we get all dependencies
// for getting dev dependencies    npm i nodeman -D
// to start with nodeman type start:nodeman filename in script of package.json 
// for uninstalling npm uninstall package
const _=require("lodash")
const items=[1,[2,[3,[4,[5]]]]]
const newitems=_.flattenDeep(items)
console.log(newitems)
