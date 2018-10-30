/**
 * @file 小说通用工具函数
 * @author JennyL
 * @author liujing
 */
import {Constant} from './constant-config'
let nextWindow = window.MIP.viewer.page.targetWindow

export const getJsonld = (currentWindow) => {
  // 获取<head>中声明的mip-shell-xiaoshuo 配置。
  // 每个页面不同，如上一页链接，当前章节名
  let jsonld = currentWindow.document.head.querySelector("script[type='application/ld+json']")
  let jsonldConf
  try {
    jsonldConf = JSON.parse(jsonld.innerText).mipShellConfig
    if (!jsonldConf) {
      throw new Error('mip-shell-xiaoshuo配置错误，请检查头部 application/ld+json mipShellConfig')
    }
  } catch (e) {
    console.error(e)
  }
  return jsonldConf
}

/**
 * 获取当前页面的iframe
 *
 * @returns {window} 当前iframe的window
 */
export const getCurrentWindow = () => {
  let pageId = window.MIP.viewer.page.currentPageId
  let pageInfo = window.MIP.viewer.page.getPageById(pageId)
  return pageInfo.targetWindow
}

/**
 * 获取下一个的iframe的window
 *
 * @returns {window} 当前下一个iframe的window
 */
export const getNextWindow = () => {
  return nextWindow
}

/**
 * 获取上一个的iframe的window
 *
 * @returns {window} 当前上一个iframe的window
 */
export const getPreWindow = () => {
  let pageId = window.MIP.viewer.page.currentPageId
  let pageInfo = window.MIP.viewer.page.getPageById(pageId)
  return pageInfo.targetWindow
}

/**
 * 获取上级可scroll的元素
 *
 * @private getClosestScrollElement
 * @param {Object} element 目标元素
 */
function getClosestScrollElement (element) {
  while (element && !element.getAttribute('mip-shell-scrollboundary')) {
    if (MIP.util.css(element, 'overflow-y') === 'auto' && element.clientHeight < element.scrollHeight) {
      return element
    }
    element = element.parentNode
  }
  return null
}

/**
 * 滚动边界处理
 */
export const scrollBoundary = () => {
  let touchStartEvent
  let {
    rect,
    css
  } = MIP.util
  // 收集body child元素 并进行包裹
  let scrollaBoundaryTouch = document.createElement('div')
  let offsetHeight
  let bodyPaddingTop
  let body = document.body
  let touchTarget
  let stopProFun = e => e.stopPropagation()

  scrollaBoundaryTouch.setAttribute('mip-shell-scrollboundary', true);
  [].slice.call(body.children).forEach(child => {
    if (/^(SCRIPT|IFRAME|MIP-SHELL|MIP-DATA)/.test(child.nodeName)) {
      return
    }
    scrollaBoundaryTouch.appendChild(child)
  })
  body.appendChild(scrollaBoundaryTouch)

  // 添加事件处理
  scrollaBoundaryTouch.addEventListener('touchstart', e => {
    touchStartEvent = e
    // 内滚 兼容处理
    touchTarget = getClosestScrollElement(e.target)
    if (touchTarget) {
      touchTarget.addEventListener('touchmove', stopProFun)
    }
  })

  scrollaBoundaryTouch.addEventListener('touchmove', e => {
    let touchRect = e.targetTouches[0]
    let startTouchReact = touchStartEvent.targetTouches[0]

    // 兼容模式处理
    offsetHeight = document.compatMode === 'BackCompat'
      ? document.body.clientHeight
      : document.documentElement.clientHeight

    bodyPaddingTop = bodyPaddingTop || parseInt(css(body, 'paddingTop'), 10)
    let scrollTop = body.scrollTop || rect.getScrollTop()
    let scrollHeight = rect.getElementRect(scrollaBoundaryTouch).height + bodyPaddingTop

    // 到达顶部时 && 是向下滚动操作
    // 到达底部时 && 并且 向上滚动操作
    let isprevent = (
      touchRect.pageY >= startTouchReact.pageY &&
      touchRect.clientY > startTouchReact.clientY &&
      scrollTop < 5) ||
      (
        touchRect.pageY < startTouchReact.pageY &&
        scrollTop + offsetHeight >= scrollHeight
      )
    if (isprevent) {
      e.preventDefault()
    }
    e.stopPropagation()
  })

  scrollaBoundaryTouch.addEventListener('touchend', () => {
    if (touchTarget) {
      touchTarget.removeEventListener('touchmove', stopProFun)
    }
  })
}
/**
 * 判断元素是否含有某个类
 */
function hasClass( elements,cName ){
  return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断
};
/**
 * 添加类
 */
function addClass(elements,cName){
  if (!hasClass(elements,cName)) {
    elements.className += " " + cName
  }
}
/**
 * 获取iframe
 */
export const getCurrentIframe = (iframe,url) =>{
  if(!iframe[1] || !iframe[1].contentWindow || !iframe[1].contentWindow.MIP) return
  const $el = iframe[1]
  // console.log($el.getAttribute("prerender"))
  nextWindow = $el.contentWindow.MIP.viewer.page.targetWindow
  if($el.dataset.pageId === url){
    const currentIframeDocument = $el.contentWindow.document
    $el.style.display = "block"
    $el.style.position = "static"
    $el.style.opacity = 1
    $el.style.height = $el.contentWindow.document.body.clientHeight + 400 + "px"
    console.log($el.contentWindow.document.body.clientHeight)
    console.log($el.style.height)
    $el.style.overflowY = "auto"
    const item = currentIframeDocument.querySelector('.mip-shell-xiaoshuo-container')
    if (item) {
      item.classList.add('show-xiaoshuo-container')
    }
    if ($el.isPrerender || ($el && $el.getAttribute('prerender') === '1')) {
      $el.contentWindow.postMessage({
        name: window.name,
        event: Constant.MESSAGE_PAGE_ACTIVE
      },'*')
      $el.isPrerender = false
      $el.removeAttribute('prerender')
    }
  }
}
/**
 * init iframe
 */
export const initNextIframe = () => {
  let pageId = window.MIP.viewer.page.children[1].pageId
  let iframe = window.MIP.viewer.page.getIFrame(pageId)

  return iframe
}









