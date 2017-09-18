const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const calc = require("postcss-calc");
const mqpacker = require("css-mqpacker");
const cssnano = require('cssnano');
const notifier = require('node-notifier');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');


//LOADER *RULE* - JS
const javascript = {
	test: /\.(js)$/,
	use: [{
		loader: 'babel-loader',
		options: {
			presets: ['es2015']
		}
	}],
};



//LOADER *RULES* - CSS/SASS
const postcss = {
	loader: 'postcss-loader',
	options: {
		sourceMap: true,
		plugins() {
			return [
				autoprefixer({
					browsers: 'last 3 versions'
				}),
				calc(), //turns calc(10px + 20px) to 30px... optimization
				mqpacker(), //puts all media quires into one
				cssnano({
					zindex: false
				}) //minifiy
			];
		}
	}
};

const styleLoad = {
	loader: 'style-loader',
	options: {
		sourceMap: true
	}
}

const cssLoader = {
	loader: 'css-loader',
	options: {
		sourceMap: true
	}
}

const sassLoader = {
	loader: 'sass-loader',
	options: {
		sourceMap: true
	}
}

const styles_dev = {
	test: /\.(scss)$/,
	use: ExtractTextPlugin.extract({
		fallback: 'style-loader',
		//resolve-url-loader may be chained before sass-loader if necessary 
		use: [styleLoad, postcss, sassLoader]
	})
};

const styles_prod = {
	test: /\.(scss)$/,
	use: ExtractTextPlugin.extract({
		fallback: 'style-loader',
		//resolve-url-loader may be chained before sass-loader if necessary 
		use: [cssLoader, postcss, sassLoader]
	})
};



//LOADER *RULES* - FONT
const fonts = {
	test: /\.(eot|svg|ttf|woff|woff2)$/,
	loader: 'file-loader?name=fonts/[name].[ext]'
}

//LOADER *RULES* - HTML

const html = {
	test: /\.(html)$/,
	use: [{
		loader: 'html-loader',
		options: {

		}
	}]
}


//LOADER *RULES* - Images 
const images = {
	test: /\.(png|jpg|gif|svg)$/,
	use: [{
		loader: 'file-loader?name=images/[name].[ext]'
	}]
}

// Error Handler

const onError = (err) => {
	notifier.notify({
		title: 'MarkBot:',
		message: 'Hey onBrander, looks like webpack hit an error 😫. Check the terminal for details.',
		wait: true
	});
}



// The Final Module Export
module.exports = (env) => {
	let styles;
	env.prod ? styles = styles_prod : styles = styles_dev;
	return {
		context: resolve(__dirname),
		entry: './src/index.js',
		output: {
			path: resolve(__dirname, 'build'),
			filename: 'scripts.bundle.js',
			publicPath: '/build/'
		},
		devtool: 'source-map',
		module: {
			rules: [
				javascript,
				styles,
				html,
				images,
				fonts
			]
		},
		plugins: [
			new ExtractTextPlugin('style.css'),
			new WebpackBuildNotifierPlugin({
				title: "MarkBot",
				suppressWarning: true,
				suppressSuccess: false,
				onClick: function () {
					return;
				},
				messageFormatter: function (obj, string) {
					console.log(obj, string);
					return `😡, we hit an error: ${string}. Check the terminal for details!`
				}
			})
		],
		watch: true,
		stats: {
			children: false
		},
		devServer: {
			proxy: {
				port: 3000,
				'**': {
					target: 'google.ca',
					secure: true,
					changeOrigin: true,
				}
			}
		}
	};
};




//Git reminder 
setInterval(function () {
	notifier.notify({
		title: 'MarkBot:',
		message: 'It\'s been quite a while, you should probably commit',
		wait: true
	});
}, 1200000)