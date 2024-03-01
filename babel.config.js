module.exports = api => {
  const isTest = api.env('test');
	
  return {
		plugins:isTest
		?[
			"@babel/plugin-transform-modules-commonjs"
		]
		:[
		],
    presets:isTest 
		?[
			"@babel/preset-typescript"
		]
		:[
			"next/babel"
		]
  };
};
