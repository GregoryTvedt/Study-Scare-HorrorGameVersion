module.exports = {
  packagerConfig: {
    asar: true,
    ignore:[
        /^\/src\/.*\.ts$/,
        /^\/\.git/,
        /tsconfig\.json/,
        /forge\.config\.js/
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
  ],
};
