/**
 * Copyright (c) 2016 hustcc
 * License: MIT
 * Version: v3.0.0
 * https://github.com/hustcc/timeago.js
 */

import {
  ar,
  be,
  bg,
  ca,
  da,
  de,
  el,
  en,
  enShort,
  es,
  eu,
  fi,
  fr,
  he,
  hu,
  inBG,
  inHI,
  inID,
  it,
  ja,
  ko,
  ml,
  nbNO,
  nl,
  nnNO,
  pl,
  ptBR,
  ro,
  ru,
  sv,
  ta,
  th,
  tr,
  uk,
  vi,
  zhCN,
  zhTW
} from './timeago-locales'

const locales = {}

// second, minute, hour, day, week, month, year(365 days)
const SEC_ARRAY = [60, 60, 24, 7, 365 / 7 / 12, 12]
const SEC_ARRAY_LEN = 6

// format Date / string / timestamp to Date instance.
function toDate (input) {
  if (input instanceof Date) {
    return input
  };
  if (!isNaN(input)) {
    return new Date(toInt(input))
  }
  if (/^\d+$/.test(input)) {
    return new Date(toInt(input))
  }
  input = (input || '').trim().replace(/\.\d+/, '') // remove milliseconds
    .replace(/-/, '/').replace(/-/, '/')
    .replace(/(\d)T(\d)/, '$1 $2').replace(/Z/, ' UTC') // 2017-2-5T3:57:52Z -> 2017-2-5 3:57:52UTC
    .replace(/([+-]\d\d):?(\d\d)/, ' $1$2') // -04:00 -> -0400
  return new Date(input)
}

// change f into int, remove decimal. Just for code compression
function toInt (f) {
  return parseInt(f, 10)
}

// format the diff second to *** time ago, with setting locale
function formatDiff (diff, locale) {
  // if locale is not exist, use defaultLocale.
  // if defaultLocale is not exist, use build-in `en`.
  // be sure of no error when locale is not exist.
  locale = locales[locale] ? locale : 'zhCN'
  // if (! locales[locale]) locale = defaultLocale;
  let i = 0
  const agoin = diff < 0 ? 1 : 0 // timein or timeago
  const totalSec = diff = Math.abs(diff)

  for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY_LEN; i++) {
    diff /= SEC_ARRAY[i]
  }
  diff = toInt(diff)
  i *= 2

  if (diff > (i === 0 ? 9 : 1)) {
    i += 1
  }
  return locales[locale](diff, i, totalSec)[agoin].replace('%s', diff)
}

// calculate the diff second between date to be formated an now date.
function diffSec (date) {
  const nowDate = new Date()
  return (nowDate - toDate(date)) / 1000
}

/**
 * timeago: the function to get `timeago` instance.
 * - nowDate: the relative date, default is new Date().
 * - defaultLocale: the default locale, default is en. if your set it, then the `locale` parameter of format is not needed of you.
 **/
export function timeago (date, locale) {
  return formatDiff(diffSec(date), locale)
}

/**
 * register: register a new language locale
 * - locale: locale name, e.g. en / zh_CN, notice the standard.
 * - localeFunc: the locale process function
 **/
timeago.register = function (locale, localeFunc) {
  locales[locale] = localeFunc
}

timeago.register('ar', ar)
timeago.register('be', be)
timeago.register('bg', bg)
timeago.register('ca', ca)
timeago.register('da', da)
timeago.register('de', de)
timeago.register('el', el)
timeago.register('en', en)
timeago.register('enShort', enShort)
timeago.register('es', es)
timeago.register('eu', eu)
timeago.register('fi', fi)
timeago.register('fr', fr)
timeago.register('he', he)
timeago.register('hu', hu)
timeago.register('inBG', inBG)
timeago.register('inHI', inHI)
timeago.register('inID', inID)
timeago.register('it', it)
timeago.register('ja', ja)
timeago.register('ko', ko)
timeago.register('ml', ml)
timeago.register('nbNO', nbNO)
timeago.register('nl', nl)
timeago.register('nnNO', nnNO)
timeago.register('pl', pl)
timeago.register('ptBR', ptBR)
timeago.register('ro', ro)
timeago.register('ru', ru)
timeago.register('sv', sv)
timeago.register('ta', ta)
timeago.register('th', th)
timeago.register('tr', tr)
timeago.register('uk', uk)
timeago.register('vi', vi)
timeago.register('zhCN', zhCN)
timeago.register('zhTW', zhTW)
