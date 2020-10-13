module.exports = function(wallaby) {
	return {
		// tell wallaby to use automatic configuration
		autoDetect: true,

		files: [
			{ pattern: 'src/**/*.ts*', load: false },
			'!src/**/*.test.ts',
			'!semantic/**/*',
			'!node_modules/**/*'
		],

		tests: [ 'src/**/*.test.ts' ],

		testFramework: 'jest',

		env: { type: 'node' }
	};
};
