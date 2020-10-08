import 'source-map-support/register'

import { Handler } from 'aws-lambda'
import { Chrome } from './modules/browser'

export const handler: Handler = async (_event, _context, callback) => {
  const chrome = new Chrome()
  const url = 'https://ipinfo.io/'

  let content: string[]
  try {
    await chrome.launch({ headless: true, useTor: true })
    const page = await chrome.browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })
    await page.waitForSelector('.json-widget-entry')
    content = await page.$$eval('.json-widget-entry', (elems: any) => {
      return elems.map((el: any) =>
        (el.textContent as string).replace(/\n|\s/g, '')
      )
    })
  } catch (e) {
    console.error(e, e.stack)
    return callback(e, null)
  } finally {
    await chrome.close()
  }

  return callback(null, content)
}
