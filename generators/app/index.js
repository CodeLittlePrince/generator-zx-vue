const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const path = require('path')
const fs = require('fs')

module.exports = class extends Generator {
  initializing() {
    // 打印欢迎语
    this.log(
      yosay(`Welcome to the shining ${chalk.cyan('generator-zx-vue')} generator!`)
    )
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
        default: '',
      },
      // {
      //   type: 'confirm',
      //   name: 'includeVuex',
      //   message: 'Would you like to include Vuex in your project?',
      //   default: false,
      // }
    ]
    return this.prompt(prompts).then(answers => {
      this.name = answers.name
      this.description = answers.description
      // this.includeVuex = answers.includeVuex
      this.log(chalk.green('name: ', this.name))
      this.log(chalk.green('description: ', this.description))
      // this.log(chalk.green('includeVuex: ', this.includeVuex))
    })
  }

  writing() {
    // 复制普通文件
    // https://github.com/sboudrias/mem-fs-editor
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      {
        name: this.name
      },
      {},
      { globOptions:
        {
          dot: true
        }
      }
    )
    // 根据用户选择，决定是否安装vuex
    if (this.includeVuex) {
      const pkgJson = {
        name: this.name,
        description: this.description,
        // dependencies: {
        //   vuex: '^3.0.1'
        // }
      }
      // Extend or create package.json file in destination path
      this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
    }
  }

  install() {
    this.npmInstall()
  }

  end() {
    this.log(chalk.green('Construction completed!'))
  }
}
