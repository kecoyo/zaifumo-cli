# Overview

A scaffolding command line tool for Meteor applications.

`underscore-cli`

# Installing Zaifumo-Cli

    npm install -g zaifumo-cli
    zaifumo help

# Documentation

### Usage

If you run the tool without any arguments, this is what prints out:

    Usage:
      zaifumo <command> [--in <filename>|--data <JSON>|--nodata] [--infmt <format>] [--out <filename>] [--outfmt <format>] [--quiet] [--strict] [--color] [--text] [--trace] [--coffee] [--js]



    Commands:

      help [command]      Print more detailed help and examples for a specific command
      type                Print the type of the input data: {object, array, number, string, boolean, null, undefined}
      print               Output the data without any transformations. Can be used to pretty-print JSON data.
      pretty              Output the data without any transformations. Can be used to pretty-print JSON data. (defaults output format to 'pretty')
      run <exp>           Runs arbitrary JS code. Use for CLI Javascripting.
      process <exp>       Run arbitrary JS against the input data.  Expression Args: (data)
      extract <field>     Extract a field from the input data.  Also supports field1.field2.field3
      map <exp>           Map each value from a list/object through a transformation expression whose arguments are (value, key, list).'
      reduce <exp>        Boil a list down to a single value by successively combining each element with a running total.  Expression args: (total, value, key, list)
      reduceRight <exp>   Right-associative version of reduce. ie, 1 + (2 + (3 + 4)). Expression args: (total, value, key, list)
      select <jselexp>    Run a 'JSON Selector' query against the input data. See jsonselect.org.
      find <exp>          Return the first value for which the expression Return a truish value.  Expression args: (value, key, list)
      filter <exp>        Return an array of all values that make the expression true.  Expression args: (value, key, list)
      reject <exp>        Return an array of all values that make the expression false.  Expression args: (value, key, list)
      flatten             Flattens a nested array (the nesting can be to any depth). If you pass '--shallow', the array will only be flattened a single level.
      pluck <key>         Extract a single property from a list of objects
      keys                Retrieve all the names of an object's properties.
      values              Retrieve all the values of an object's properties.
      extend <object>     Override properties in the input data.
      defaults <object>   Fill in missing properties in the input data.
      any <exp>           Return 'true' if any of the values in the input make the expression true.  Expression args: (value, key, list)
      all <exp>           Return 'true' if all values in the input make the expression true.  Expression args: (value, key, list)
      isObject            Return 'true' if the input data is an object with named properties
      isArray             Return 'true' if the input data is an array
      isString            Return 'true' if the input data is a string
      isNumber            Return 'true' if the input data is a number
      isBoolean           Return 'true' if the input data is a boolean, ie {true, false}
      isNull              Return 'true' if the input data is the 'null' value
      isUndefined         Return 'true' if the input data is undefined
      template <filename> Process an zaifumo template and print the results. See 'help template'


    Options:

      -h, --help            output usage information
      -V, --version         output the version number
      -i, --in <filename>   The data file to load.  If not specified, defaults to stdin.
      --infmt <format>      The format of the input data. See 'help formats'
      -o, --out <filename>  The output file.  If not specified, defaults to stdout.
      --outfmt <format>     The format of the output data. See 'help formats'
      -d, --data <JSON>     Input data provided in lieu of a filename
      -n, --nodata          Input data is 'undefined'
      -q, --quiet           Suppress normal output.  'console.log' will still trigger output.
      --strict              Use strict JSON parsing instead of more lax 'eval' syntax.  To avoid security concerns, use this with ANY data from an external source.
      --color               Colorize output
      --text                Parse data as text instead of JSON. Sets input and output formats to 'text'
      --trace               Print stack traces when things go wrong
      --coffee              Interpret expression as CoffeeScript. See http://coffeescript.org/
      --js                  Interpret expression as JavaScript. (default is "auto")


    Examples:

      zaifumo map --data '[1, 2, 3, 4]' 'value+1'
      # [2, 3, 4, 5]

      zaifumo map --data '{"a": [1, 4], "b": [2, 8]}' '_.max(value)'
      # [4, 8]

      echo '{"foo":1, "bar":2}' | zaifumo map -q 'console.log("key = ", key)'
      # "key = foo\nkey = bar"

      zaifumo pluck --data "[{name : 'moe', age : 40}, {name : 'larry', age : 50}, {name : 'curly', age : 60}]" name
      # ["moe", "larry", "curly"]

      zaifumo keys --data '{name : "larry", age : 50}'
      # ["name", "age"]

      zaifumo reduce --data '[1, 2, 3, 4]' 'total+value'
      # 10
