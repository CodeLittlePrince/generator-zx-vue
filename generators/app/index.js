const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

module.exports = class extends Generator {
  initializing() {
    // 打印欢迎语
    this.log(
      yosay(`Welcome to the shining ${chalk.cyan('generator-zx-vue')} generator!`)
    );
  }

  prompting() {
    // 让用户选择是否需要包含vuex
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Name of project:',
        default: path.basename(process.cwd())
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
        default: ''
      },
      {
        type: 'list',
        name: 'ieVersion',
        message: 'Which version of IE would you like to support?',
        choices: [
          {
            name: 'IE 9',
            value: '9'
          },
          {
            name: 'IE 10',
            value: '10'
          },
          {
            name: 'IE 11 or higher',
            value: '11'
          }
        ]
      },
      {
        type: 'confirm',
        name: 'includeVuex',
        message: 'Would you like to include Vuex in your project?',
        default: true
      }
    ];
    return this.prompt(prompts).then(answers => {
      this.name = answers.name;
      this.description = answers.description;
      this.ieVersion = answers.ieVersion;
      this.includeVuex = answers.includeVuex;
      this.log(chalk.green('name: ', this.name));
      this.log(chalk.green('description: ', this.description));
      this.log(chalk.green('ieVersion: ', this.ieVersion));
      this.log(chalk.green('includeVuex: ', this.includeVuex));
      // 处理ie version
      this.ieVersionSupport = '';
      switch (this.ieVersion) {
        case '9':
          this.ieVersionSupport = 'ie >= 9';
          break;
        case '10':
          this.ieVersionSupport = 'ie >= 10';
          break;
        default:
          this.ieVersionSupport = 'ie >= 11';
      }
    });
  }

  writing() {
    // 复制普通文件
    // https://github.com/sboudrias/mem-fs-editor
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      {
        name: this.name,
        ieVersion: this.ieVersionSupport
      },
      {},
      {
        globOptions: {
          // https://github.com/isaacs/node-glob
          dot: true,
          ignore: ['**/files-for-add-vuex/**'],
          gitignore: false
        }
      }
    );
    // 处理package.json
    const pkgJson = {
      name: this.name,
      description: this.description
    };
    // 根据用户选择，决定是否安装vuex
    if (this.includeVuex) {
      // 处理package.json
      pkgJson.dependencies = {
        vuex: '^3.0.1'
      };
      // 覆盖含有vuex调用的文件（从src/files-for-add-vuex中提取）
      // 1.src/index.js
      this.fs.copy(
        this.templatePath('src/files-for-add-vuex/index.js'),
        this.destinationPath('src/index.js')
      );
      // 2.src/views/home/index.vue
      this.fs.copy(
        this.templatePath('src/files-for-add-vuex/views/home/index.vue'),
        this.destinationPath('src/views/home/index.vue')
      );
      // 3. 把store拿出来(src/store)
      this.fs.copy(
        this.templatePath('src/files-for-add-vuex/store'),
        this.destinationPath('src/store')
      );
    }
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    // 因为husky原理是在安装的时候去.git文件夹中的hooks做修改
    // 所以在安装之前，需要确认git是否已经安装
    // 如果不存在git，则init一下
    // 否则直接安装
    if (!fs.existsSync('.git')) {
      spawn('git', ['init']);
    }
    this.npmInstall();
  }

  end() {
    this.log(chalk.green('Construction completed!'));
  }
};
