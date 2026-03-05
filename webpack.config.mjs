import * as path from 'path'
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

import config from '../../webpack.plugin.config.mjs'

export default () => config({
    name: 'encoding-auto-detect',
    dirname: __dirname,
    rules: [
        {
            test: /\.ts$/,
            use: [
                {
                    loader: '@ngtools/webpack',
                    options: {
                        compilerOptions: {
                            skipLibCheck: true,
                            allowJs: true,
                            // Disable all TypeScript checks
                            noEmit: false,
                            noEmitOnError: false,
                            sourceMap: false,
                            declaration: false,
                        }
                    }
                }
            ]
        }
    ]
})
