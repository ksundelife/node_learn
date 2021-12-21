#!/home/ksusha/.nvm/versions/node/v14.0.0/bin/node

const fs = require('fs');
const colors = require('colors');
const yargs = require('yargs');
const path = require('path');
const inquirer = require('inquirer');
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt');
const { option } = require('yargs');

inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

const homeDir = process.env.HOME;
const executionDir = process.cwd();

const isFile = (filename) => fs.lstatSync(filename).isFile();
const fileList = fs.readdirSync(executionDir).filter(isFile);

const options = yargs
	.positional('d', {
		describe: 'Path to directory',
		default: process.cwd(),
	})
	.positional('p', {
		describe: 'Pattern',
		default: '',
	}).argv;

if (options.d !== process.cwd()){
	dirStepForUserPath(options.d);
} else {
	inquirer.prompt([{
		name: 'start',
		type: 'list',
		message: 'Где хотите искать файл: ',
		choices: ['Выбрать файл из текущей директории.', 'Ввести путь до файла'],
	}]).then(
		({ start }) => {
			if (start === 'Выбрать файл из текущей директории.') {
				fileFromCurrentDir();
			} else {
				handlerPathFromUser();
			}
		}
	);
}

function fileFromCurrentDir(){
	inquirer.prompt([{
		name: 'fileName',
		type: 'list',
		message: 'Выбирите файл: ',
		choices: fileList,
	}]).then(
		({ fileName }) => {
			const fullPath = path.join(executionDir, fileName);
			const data = fs.readFileSync(fullPath, 'utf-8');
			if(option.p === '') {
				console.log(data);
			} else checkingOptions(data);
		}
	);
}

function handlerPathFromUser(){
	inquirer.prompt([{
		name: 'pathFromUser',
		type: 'input',
		message: 'Введите путь до каталога или файла: ',
	}]).then(
		({ pathFromUser }) => {

			if (!fs.existsSync(pathFromUser)) {
				console.log(colors.red(`Указанный каталог или файл: '${pathFromUser}' не существует!`));
				return;
			}

			if (isFile(pathFromUser)) {
				const fullPath = path.resolve(homeDir, pathFromUser);
				const data = fs.readFileSync(fullPath, 'utf-8');
				if (option.p === '') {
					console.log(data);
				} else checkingOptions(data);
			} else {
				const resolvePathFromUser = path.resolve(homeDir, pathFromUser);
				const stepDir = path.relative(executionDir, resolvePathFromUser);
				dirStepForUserPath(stepDir);
			}
		}
	);
}

function dirStepForUserPath(pathFromUser) {
	inquirer
		.prompt([{
			root: pathFromUser,
			type: 'file-tree-selection',
			name: 'file',
			message: 'Выбирите файл: ',
		}])
		.then(
			({ file }) => {
			if (isFile(file)) {
				const data = fs.readFileSync(file, 'utf-8');
				if (option.p === '') {
					console.log(data);
				} else checkingOptions(data);
			} else {
				console.log(colors.red('Упс - это директория! Чтобы посмотреть содержимое директории: на клавиатуре нажмите стрелочку вправо! Чтобы прочитать файл - нажмите Enter!'));
			}
		});
}

function checkingOptions(data) {
	if (options.p === '') console.log(data);
	else {
		if (options._.length > 0){
			let searchStr = options._.join(' ');
			const regExp = new RegExp(searchStr, 'igm');
			console.log(colors.yellow(`ПОИСК: "${options.p} ${searchStr}"`));

			if (data.match(regExp) === null){
				console.log(colors.red('Вхождений не найдено!'))
			} else console.log(data.match(regExp));
		} else {
			const regExp = new RegExp(options.p, 'igm');
			if (data.match(regExp) === null) {
				console.log(colors.red('Вхождений не найдено!'))
			} else console.log(data.match(regExp));
		}
	}
}