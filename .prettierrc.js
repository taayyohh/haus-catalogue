module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 90,
  importOrderSortSpecifiers: true,
  importOrderSeparation: true,
  importOrder: [
    '^modules/(.*)$',
    '^[./]',
  ],
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
}
