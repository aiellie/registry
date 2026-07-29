/**
 * Injected into proxied and same-origin preview documents to give the browser
 * chrome a small, message-based control surface. Everything the toolbar drives
 * (link interception, find-in-page, zoom, print, annotation) is handled here
 * and reported back over `postMessage`.
 *
 * Inbound  `{ source: "web-preview-host", type, … }`
 * Outbound `{ source: "web-preview", type, … }`
 */
export function webPreviewBridgeCode(targetUrl: string) {
  const serialised = JSON.stringify(targetUrl)
  return `(function(){
  var target = ${serialised};
  var HOST = "web-preview-host";
  function post(m){ try { parent.postMessage(m, "*") } catch (e) {} }
  function send(type, data){ var m = data || {}; m.source = "web-preview"; m.type = type; post(m) }

  /* ---------------------------------------------------------------- links */

  document.addEventListener("click", function(event){
    if (annotating) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
    var anchor = event.target && event.target.closest && event.target.closest("a[href]");
    if (!anchor) return;
    var href = anchor.href;
    if (!/^https?:/i.test(href)) return;
    if (anchor.target && anchor.target !== "_self") return;
    event.preventDefault();
    send("navigate", { url: href });
  }, true);

  /* ----------------------------------------------------------------- find */

  var ranges = [], activeIndex = 0, supportsHighlight = !!(window.CSS && CSS.highlights && window.Highlight);

  if (supportsHighlight) {
    var findStyle = document.createElement("style");
    findStyle.textContent =
      "::highlight(wp-find){background:rgba(255,140,26,.38);color:#000}" +
      "::highlight(wp-find-active){background:#ff8c1a;color:#000}";
    document.documentElement.appendChild(findStyle);
  }

  function textNodes(){
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node){
        var parent = node.parentElement;
        if (!parent || parent.closest("script,style,noscript,[data-wp-overlay]")) return NodeFilter.FILTER_REJECT;
        return node.nodeValue && node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var out = [], n;
    while ((n = walker.nextNode())) out.push(n);
    return out;
  }

  function paintFind(){
    if (!supportsHighlight) return;
    CSS.highlights.delete("wp-find");
    CSS.highlights.delete("wp-find-active");
    if (!ranges.length) return;
    var active = ranges[activeIndex - 1];
    var rest = ranges.filter(function(r){ return r !== active });
    if (rest.length) CSS.highlights.set("wp-find", new Highlight(...rest));
    if (active) {
      CSS.highlights.set("wp-find-active", new Highlight(active));
      var host = active.startContainer.parentElement;
      if (host && host.scrollIntoView) host.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  function runFind(query){
    ranges = [];
    activeIndex = 0;
    if (query && supportsHighlight) {
      var needle = query.toLowerCase();
      var nodes = textNodes();
      for (var i = 0; i < nodes.length; i++) {
        var hay = (nodes[i].nodeValue || "").toLowerCase();
        var at = hay.indexOf(needle);
        while (at !== -1) {
          var range = document.createRange();
          range.setStart(nodes[i], at);
          range.setEnd(nodes[i], at + needle.length);
          ranges.push(range);
          at = hay.indexOf(needle, at + needle.length);
        }
      }
      if (ranges.length) activeIndex = 1;
    }
    paintFind();
    send("find:results", { total: ranges.length, active: activeIndex, supported: supportsHighlight });
  }

  function stepFind(delta){
    if (!ranges.length) return;
    activeIndex = ((activeIndex - 1 + delta + ranges.length) % ranges.length) + 1;
    paintFind();
    send("find:results", { total: ranges.length, active: activeIndex, supported: supportsHighlight });
  }

  /* ------------------------------------------------------------- annotate */

  var annotating = false, outline = null, tip = null, pins = null;

  function overlay(tag, css){
    var el = document.createElement(tag);
    el.setAttribute("data-wp-overlay", "");
    el.style.cssText = css;
    return el;
  }

  function ensureOverlays(){
    if (outline) return;
    outline = overlay("div", "position:fixed;z-index:2147483646;pointer-events:none;border:2px solid #2c68f2;background:rgba(44,104,242,.20);border-radius:2px;display:none;box-sizing:border-box");
    tip = overlay("div", "position:fixed;z-index:2147483647;pointer-events:none;display:none;width:242px;box-sizing:border-box;background:#fff;color:#101729;border:1px solid #e2e3e4;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.10);padding:8px 10px;font:14px/20px Geist,ui-sans-serif,system-ui,sans-serif");
    pins = overlay("div", "position:fixed;inset:0;z-index:2147483645;pointer-events:none");
    /* Element children of <html> outside <body> are not rendered. */
    var host = document.body || document.documentElement;
    host.appendChild(outline);
    host.appendChild(tip);
    host.appendChild(pins);
  }

  function describe(el){
    var rect = el.getBoundingClientRect();
    var style = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      color: style.color,
      font: style.fontSize + " " + style.fontFamily,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
    };
  }

  function tipRow(label, value, mono, alignEnd){
    var row = document.createElement("div");
    row.style.cssText = "display:grid;grid-template-columns:68px minmax(0,1fr);gap:0;align-items:center";
    var key = document.createElement("span");
    key.textContent = label;
    key.style.color = "#7d7d7d";
    var content = document.createElement("span");
    content.textContent = value;
    content.style.cssText = "min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" +
      (mono ? ";font-family:ui-monospace,SFMono-Regular,Menlo,monospace" : "") +
      (alignEnd ? ";text-align:right" : "");
    row.appendChild(key);
    row.appendChild(content);
    tip.appendChild(row);
  }

  function onAnnotateMove(event){
    if (!annotating) return;
    var el = document.elementFromPoint(event.clientX, event.clientY);
    if (!el || el.hasAttribute("data-wp-overlay")) return;
    var info = describe(el);
    outline.style.display = "block";
    outline.style.top = info.rect.top + "px";
    outline.style.left = info.rect.left + "px";
    outline.style.width = info.rect.width + "px";
    outline.style.height = info.rect.height + "px";
    tip.style.display = "block";
    tip.textContent = "";
    tipRow(info.tag, info.width + "x" + info.height, true, true);
    tipRow("color", info.color, true, false);
    tipRow("font", info.font, true, false);
    var below = info.rect.top + info.rect.height + 8;
    tip.style.top = (below + tip.offsetHeight > innerHeight ? Math.max(8, info.rect.top - tip.offsetHeight - 8) : below) + "px";
    tip.style.left = Math.max(8, Math.min(info.rect.left, innerWidth - tip.offsetWidth - 8)) + "px";
  }

  function onAnnotateClick(event){
    if (!annotating) return;
    event.preventDefault();
    event.stopPropagation();
    var el = document.elementFromPoint(event.clientX, event.clientY);
    if (!el || el.hasAttribute("data-wp-overlay")) return;
    var pin = overlay("div", "position:absolute;width:24px;height:24px;margin:-12px 0 0 -12px;border:2px solid #fff;border-radius:999px;background:#3a83f7;box-sizing:border-box;box-shadow:0 2px 8px rgba(0,0,0,.25)");
    pin.style.top = event.clientY + "px";
    pin.style.left = event.clientX + "px";
    pins.appendChild(pin);
    send("annotate:select", { element: describe(el), x: event.clientX, y: event.clientY });
  }

  function setAnnotating(next){
    annotating = !!next;
    ensureOverlays();
    document.documentElement.style.cursor = annotating ? "crosshair" : "";
    if (!annotating) {
      outline.style.display = "none";
      tip.style.display = "none";
    }
  }

  document.addEventListener("mousemove", onAnnotateMove, true);
  document.addEventListener("click", onAnnotateClick, true);

  /* -------------------------------------------------------------- inbound */

  addEventListener("message", function(event){
    var data = event.data;
    if (!data || data.source !== HOST) return;
    if (data.type === "find") runFind(data.query || "");
    else if (data.type === "find:step") stepFind(data.delta || 1);
    else if (data.type === "zoom") document.documentElement.style.zoom = (data.zoom || 100) / 100;
    else if (data.type === "print") { try { print() } catch (e) {} }
    else if (data.type === "annotate") setAnnotating(data.enabled);
    else if (data.type === "annotate:clear" && pins) pins.textContent = "";
  });

  send("loaded", { url: target });
})()`
}
