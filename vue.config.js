const NODE_ENV = process.env.NODE_ENV !== 'production'
var path = require('path')
let url = NODE_ENV ? 'test' : 'webchat'
module.exports = {
    publicPath: './',
    //构建输出目录
    outputDir: 'dist',
    //静态资源目录(js,css,img,fonts)
    assetsDir: 'assets',
    configureWebpack: config => {
        require('vux-loader').merge(config, {
            options: {},
            plugins: ['vux-ui']
        })
    },
    // chainWebpack: config => {
    //     const oneOfsMap = config.module.rule('less').oneOfs.store
    //     oneOfsMap.forEach(item => {
    //         item
    //             .use('sass-resources-loader')
    //             .loader('sass-resources-loader')
    //             .options({
    //                 // Provide path to the file with resources
    //                 resources: './src/assets/less/common.less',
    //             })
    //             .end()
    //     })
    // },
    // pluginOptions: {
    //     'style-resources-loader': {//定义全局公用less文件
    //         preProcessor: 'less',
    //         patterns: [
    //             注意：试过不能使用别名路径
    //             path.resolve(__dirname, './src/assets/less/common.less'),
    //         ]
    //     }
    // },

    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
        types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    }
    ,
    //const url = 'https://wechat.lexbst.com/bst-project'
    //const url = 'http://test.lexbst.com/bst-project'
    // const url = 'http://localhost:8082/';
    devServer: {
        port: '8081',
        open: true,
        https: false,
        proxy: {
            '/api': {
                target: `http://test.lexbst.com/bst-project/index.php`,  // target host
                ws: true,  // proxy websockets 
                changeOrigin: true,  // needed for virtual hosted sites
                pathRewrite: {
                    '^/api': ''  // rewrite path
                }
            }
        }
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: []
        }
    }
}
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, 'src/styles/variable.less'), // 需要全局导入的less
            ],
        })
}