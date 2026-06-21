import fs from 'fs';
import iconv from 'iconv-lite';

const LOG_FILE = 'discordData.csv';

/** 発言ログをShift_JISのCSVに追記する(従来のwriteF相当)。 */
export function writeCsvLog(text: string): void {
  const line = iconv.encode(`${text.replace(/\n/g, '')}\n`, 'Shift_JIS');
  fs.appendFile(LOG_FILE, line, (err) => {
    if (err) console.error(err);
  });
}
