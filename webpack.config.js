var path = require('path');
var webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // 入口
  //entry: "./index.js",
	entry:{ //配置入口文件，有几个写几个
		index: './src/js/page/index.js',
		resource: './src/js/page/resource.js'
	},
  // 输出的文件名
  output: {
	//path:__dirname+'/src/dist/',
	path:path.join(__dirname, 'src/dist'),
    filename: 'js/[name].js',
	publicPath: "/",
	chunkFilename: 'js/[id].chunk.js'
  },
  externals:{
  'jquery':'window.jQuery',
  'artTemplate':'window.template'
 },
  devServer: {
	 contentBase: __dirname+'/src/', //本地服务器所加载的页面所在的目录
	 historyApiFallback: true, //不跳转
	 inline: true //实时刷新
  },

  module: {
	  rules: [{
			  test: require.resolve('jquery'),
			  use: [{
				  loader: 'expose-loader',
				  options: 'jQuery'
			  },{
				  loader: 'expose-loader',
				  options: '$'
			  }]
		},
		{
			test: /\.(less|css)$/,
			use: ExtractTextPlugin.extract({
			  use:[ 'css-loader','less-loader'],
			  fallback: 'style-loader'
			})
		},
		  {
			  test: /\.html$/,
			  loader: 'html-withimg-loader'
		  },
		//{
		//	test: /\.(jpg|jpeg|png|gif)$/i,   //拷贝图片
		//	use: {
		//	  loader: 'file-loader',
		//	  options: {
		//		name: '[name]?[hash:8].[ext]',
		//		outputPath:'./img/'
		//	  }
		//	}
		//  },
		
		  {
			  test:  /.(jpg|png|gif|svg)$/,
			  //use: 'url-loader?limit=1&name=[path][name].[ext]&outputPath=images/&publicPath=output/',
			  use: 'url-loader?limit=1&name=[name].[ext]&outputPath=images/',
		  },
		  {
			  test:/\.(woff|svg|eot|ttf)\??.*$/,
			  /*test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,*/
			  use: 'url-loader?name=iconfont/[name].[hash:7].[ext]'

		  }
		  //,{
			//  test: /\.html$/,
			//  loader: "art-template-loader",
			//  options: {
			//	  extname: '.html',
			//	  // art-template options (if necessary)
			//	  // @see https://github.com/aui/art-template
			//  }
		  //}
		  //{test: /.js$/, use: ['babel-loader']},
        //{test: /.css$/, use: ['style-loader', 'css-loader','less-loader']},/*解析css, 并把css添加到html的style标签里*/
         //{test: /.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader',use: 'css-loader','less-loader'})}/*解析css, 并把css变成文件通过link标签引入*/
        //{test: /.(jpg|png|gif|svg)$/, use: ['url-loader?limit=8192&name=./[name].[ext]']},/*解析图片*/
        //{test: /.less$/, use: ['style-loader', 'css-loader', 'less-loader']}/*解析less, 把less解析成浏览器可以识别的css语言*/
	   ]
	},
	plugins: [
	// 添加我们的插件 会自动生成一个html文件
	new webpack.optimize.CommonsChunkPlugin({
		name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
		chunks: ['index','resource'], //提取哪些模块共有的部分
		minChunks: 3 // 提取至少3个模块共有的部分
	}),
	new ExtractTextPlugin('css/[name].css'),
    new HtmlwebpackPlugin({
		filename: './index.html',
		template:'./src/html/index.html',
		chunks: ['vendors', 'index']
    }),
	new HtmlwebpackPlugin({
		filename: './resource.html',
		template:'./src/html/resource.html',
		chunks: ['vendors', 'resource']
	})
  ]
};