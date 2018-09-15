const BabiliPlugin = require('babili-webpack-plugin');
const CriticalPlugin = require('webpack-plugin-critical').CriticalPlugin;

export default (config, env, helpers) => {
	//Remove uglify plugin and add BabiliPlugin
	let uglify = helpers.getPluginsByName(config, 'UglifyJsPlugin')[0];

	if (uglify) {
		config.plugins.splice(uglify.index, 1);
		config.plugins.push(new BabiliPlugin({}, { sourceMap: false }));
	}

	if (env.isProd) {
		// config.plugins.push(
		// 	new CriticalPlugin({
		// 		src: 'index.html',
		// 		inline: false,
		// 		minify: false,
		// 		dest: 'index.html'
		// 	})
		// );
	}

	// Disabled CSS modules
	let styles = helpers.getLoadersByName(config, 'css-loader');
	styles[0].loader.options.modules = false;
};
