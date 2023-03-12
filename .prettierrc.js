module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 90,
  importOrderSortSpecifiers: true,
  importOrderSeparation: true,
  importOrder: ['<THIRD_PARTY_MODULES>', '^modules/(.*)$', '^[./]'],
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
}
