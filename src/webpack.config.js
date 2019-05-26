var webpack = require('webpack')  //因为用到webpack，所以要require
var path = require('path')    //path为了方便把url拼装到一起

module.exports = {
    mode:'production',
    entry: path.join(__dirname,'js/app/index.js'),//为了更精准的找到url
    output: {
        path: path.join(__dirname,'../public/js'),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]//把 css 抽离出来生成一个文件...从后往前执行
            },
            {
                test: /\.(png|svg|jpg|gif)$/,   
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    resolve: {
        alias: {//require的文件
            jquery: path.join(__dirname, "js/lib/jquery-2.0.3.min.js"), //当require时，以jquery开头的，自动找到这个。
            mod: path.join(__dirname, "js/mod"),
            less: path.join(__dirname, "less")
        }
    },
    plugins: [ //使用这个插件可以把所有模块都放入js中，不用require就可直接使用
        new webpack.ProvidePlugin({
            $: "jquery"
        })
    ]
}