/*
 * Email address, kept out of the HTML and out of plain text in the JS bundle so simple scrapers
 * (which read HTML or grep for "name@domain") can't harvest it. It is assembled only in the browser.
 *
 * To change the address, put the reversed user and reversed domain below,
 * e.g. "jane.doe@example.com" -> ['eod.enaj', 'moc.elpmaxe'].
 */
const REVERSED = ['hskadrahda', 'moc.liamg'];

const unreverse = s => s.split('').reverse().join('');

/** The real address. Call only in the browser (event handlers / effects), never during render on the server. */
export const getEmail = () => `${unreverse(REVERSED[0])}@${unreverse(REVERSED[1])}`;

/** Open the visitor's mail app. */
export const openEmail = () => {
  window.location.href = `mailto:${getEmail()}`;
};
