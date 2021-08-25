module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/tofu/' : '/',
	pwa: {
		name: 'ToFu',
		themeColor: '#ffffff',
		msTileColor: '#ffffff',
		appleMobileWebAppCapable: 'yes',
		appleMobileWebAppStatusBarStyle: '#ffffff'
	},
	css: {
		loaderOptions: {
			sass: {
				prependData: `
					@import "@/Styles/Variables.scss";
					@import "@/Styles/Mixins.scss";
					@import "@/Styles/Keyframes.scss";
				`
			}
		}
	}
};
