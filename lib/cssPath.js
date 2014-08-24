//TODO: if name attr set

var getCSSPath = function(elem, detail) {
  var detail = detail || {};
  var path = '', nextElem = elem;

  if (detail.withAttrs) {
    path += convertAttrsToCSS(elem);
  }
  if (detail.withIndex) {
    path += ':nth-child(' + getSiblingIndex(elem) + ')';
  }

  if (elem.getAttribute('id'))
    return '#' + elem.getAttribute('id');

  while (nextElem) {
    var parent = nextElem.parentNode;

    if (parent == document) {
      if (!detail.withClass) {
        return getCSSPath(elem, {withClass : true});
      }
      if (!detail.withAttrs) {
        return getCSSPath(elem, {withClass : true, withAttrs : true});
      }
      if (!detail.withIndex) {
        return getCSSPath(elem, {withClass : true, withAttrs : true, withIndex : true});
      }
      return "unable to find a unique CSS path: (" + path + ")";
    }

    var subPath = nextElem.tagName;

    if (nextElem.className && detail.withClass)
      subPath += '.' + [].slice.call(nextElem.classList).map(String).join('.');

    (elem != nextElem) && (subPath += ' > ');
    path = subPath + path;

    if (document.querySelectorAll(path).length == 1) {
      return path;
    }
    if (!document.querySelectorAll(path).length) {
      throw Error("no matches for elem: " + elem + " path: " + path);
    }

    nextElem = parent;
  }

  return path;

  function getSiblingIndex(elem) {
    var index = 1, prevNode;
    while(prevNode = elem.previousSibling) {
      (prevNode.nodeType == 1) && index++;
      elem = elem.previousSibling;
    }
    return index;
  }

  function convertAttrsToCSS(elem) {
    var ignoreList = ['class'];
    var attrs = [].slice.call(elem.attributes).filter(function(attr) {
      return ignoreList.indexOf(attr.nodeName) < 0
    });
    return attrs.map(function(a){
      return ['[',a.nodeName,'="',a.nodeValue,'"]'].join('');
    }).join('');
  }
};

//test all elements on a page
[].slice.call(document.querySelectorAll('*')).forEach(function(e) {console.log(e);console.log(getCSSPath(e))});