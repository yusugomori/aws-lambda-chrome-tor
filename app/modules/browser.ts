import 'source-map-support/register'

import chromium from 'chrome-aws-lambda'
import { Browser } from 'puppeteer-core'
import { IS_LOCAL } from '../env'
import os from './os'
import Tor from '../modules/tor'

declare var navigator
declare var window
declare var Notification

const PORT = 9050

export const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5)' +
  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'

let path: string = ''
switch (os) {
  case 'win':
    path = 'C:\\Program Files (x86)\\Google\\Chrome\\Application'
    break
  case 'mac':
    path = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    break
}

export interface LaunchOptions {
  headless?: boolean
  useTor?: boolean
}

export class Chrome {
  browser?: Browser
  tor: Tor | undefined

  async launch({ headless, useTor }: LaunchOptions) {
    headless = headless === false ? false : true
    let { args } = chromium
    if (useTor) {
      this.tor = new Tor(PORT)
      await this.tor.launch()
      args.push(`--proxy-server=socks5://127.0.0.1:${PORT}`)
    }

    this.browser = await chromium.puppeteer.launch({
      args,
      defaultViewport: chromium.defaultViewport,
      executablePath: IS_LOCAL ? path : await chromium.executablePath,
      headless,
      ignoreHTTPSErrors: true,
    })
  }

  async close() {
    if (this.tor) {
      this.tor.close()
    }
    if (this.browser != null) {
      await this.browser.close()
    }
  }

  async preventBotDetection(page: any) {
    await page.setUserAgent(UA)
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      })
    })
    await page.evaluateOnNewDocument(() => {
      window.navigator.chrome = {
        app: {},
        webstore: {},
        runtime: {},
      }
    })
    await page.evaluateOnNewDocument(() => {
      const originalQuery = window.navigator.permissions.query
      window.Notification = window.Notification || { permission: 'default' }
      return (window.navigator.permissions.query = (parameters) =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters))
    })
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1],
      })
    })
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'languages', {
        get: () => ['ja-JP', 'ja'],
      })
    })
  }
}
