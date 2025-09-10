const bhttp = require('bhttp')
const cheerio = require('cheerio')
const { URL } = require('url')

const siteUrl = 'http://localhost:8080'
const visited = new Set()

async function checkLink(url) {
  if (visited.has(url)) {
    return
  }
  visited.add(url)

  try {
    const response = await bhttp.get(url)
    if (response.statusCode >= 400) {
      console.error(`Broken link: ${url} (${response.statusCode})`)
      process.exit(1)
    }

    if (url.startsWith(siteUrl)) {
      const $ = cheerio.load(response.body)
      const promises = []
      $('a').each((i, link) => {
        const href = $(link).attr('href')
        if (href) {
          const nextUrl = new URL(href, url).href
          promises.push(checkLink(nextUrl))
        }
      })
      await Promise.all(promises)
    }
  } catch (error) {
    console.error(`Error checking link: ${url}`, error)
    process.exit(1)
  }
}

checkLink(siteUrl)
