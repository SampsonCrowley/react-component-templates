module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts"
  ],
  resolver: "jest-pnp-resolver",
  setupFiles: [
    "react-app-polyfill/jsdom"
  ],
  testRegex: "src\\/.+\\.(spec|test)\\.[jt]sx?$",
  testEnvironment: "jsdom",
  testURL: "http://lvh.me",
  transform: {
    ".+\\.[jt]sx?$": "<rootDir>/node_modules/babel-jest",
    ".+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "(?!\\.([jt]sx?|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(?![jt]sx?)$",
    "^.+\\.module\\.s?[ac]ss$"
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^react-native$": "react-native-web",
    "^.+\\.module\\.s?[ca]ss$": "identity-obj-proxy"
  },
  moduleFileExtensions: [
    "web.js",
    "js",
    "web.ts",
    "ts",
    "web.tsx",
    "tsx",
    "json",
    "web.jsx",
    "jsx",
    "node"
  ]
}
