const yargs = require('yargs')
const fontIcon = require('./index')

// noinspection BadExpressionStatementJS
yargs
    .usage('$0 [args]')
    .command(
        '*',
        'Generate webfonts & tokens, with svg files; for prod build, filter by content & tokenRegExp',
        (args) => {
            return args
                .option('init', {
                  type: 'boolean',
                  alias: 'i',
                  describe: 'To initialize the default momentum-constructor-font-icon.config.js'
                })
        },
        async (args) => {
            const { init } = args
            init ? await fontIcon.init() : await fontIcon.build()  
        },
    )
    .help()
    .argv