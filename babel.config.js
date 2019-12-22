module.exports = {
    presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-typescript"],
    plugins: [{ optimizeForSpeed: true }],
    ignore: ["node_modules", "dist"],
};
