function rem(doc, win, designSize, htmlFontSize) {
  var docEl = doc.documentElement,
    isIOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    dpr = isIOS ? Math.min(win.devicePixelRatio, 3) : 1,
    dpr = window.top === window.self ? dpr : 1, 
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
  docEl.dataset.dpr = dpr
  var recalc = function() {
    var width = docEl.clientWidth
    if (width / dpr > designSize) {
      width = designSize * dpr
    }
    docEl.dataset.width = width
    docEl.dataset.percent = htmlFontSize * (width / designSize)
    var fontSize = htmlFontSize * (width / designSize)
    let minFontSize = 90
    var agent = navigator.userAgent.toLowerCase()

    if (agent.match(/MicroMessenger/i) == 'micromessenger') {
      minFontSize = 62
    }
    if (fontSize < minFontSize) {
      fontSize = minFontSize
    }
    docEl.style.fontSize = fontSize + 'px'
  }
  recalc()
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
}
