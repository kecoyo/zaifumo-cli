# Zaifumo-Cli

A scaffolding command line tool for applications.

### Installing

    npm install -g zaifumo-cli
    zaifumo help

### Usage

If you run the tool without any arguments, this is what prints out:

    Usage:
      zaifumo <command> [options]



    Commands:

      zaifumo create <name> [options]  Create an application from a template.
      zaifumo ljpack [src] [dest]      Packaging ljlx applications.
      zaifumo template <src> <dest>    Create directories and files based on the module.


    Options:

      -h, --help            output usage information
      -V, --version         output the version number


    Examples:

      zaifumo create demo

      zaifumo ljpack src/build src/package

      zaifumo template src/FooBar src/ScrollView
