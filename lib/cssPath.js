//TODO: if name attr set

var getCSSPath = function(elem, options) {
  var options = options || {};
  var indexed = options.indexed, withAttrs = options.withAttrs;
  var path = '';

  if (withAttrs) {
    path += convertAttrsToCSS(elem);
  }
  if (indexed) {
    path += ':nth-child(' + getSiblingIndex(elem) + ')';
  }

  var nextElem = elem;

  if (elem.getAttribute('id')) return '#' + elem.getAttribute('id');

  while (nextElem) {
    var parent = nextElem.parentNode;

    if (parent == document) {
      if (!withAttrs) {
        return getCSSPath(elem, {withAttrs : true});
      }
      if (!indexed) {
        return getCSSPath(elem, {withAttrs : true, indexed : true});
      }
      return "unable to find a unique CSS path: (" + path + ")";
    }

    var subPath = nextElem.tagName;
    nextElem.className && (subPath += '.' + nextElem.className.replace(/\s/g, '.'));
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
    var index = 1;
    while(elem.previousSibling) {
      index++;
      elem = elem.previousSibling;
    }
    return index;
  }

  function convertAttrsToCSS(elem) {
    return [].slice.call(elem.attributes).map(
      function(a){return ['[',a.nodeName,'="',a.nodeValue,'"]'].join('')}).join('');
  }
};

//test all elements on a page
[].slice.call(document.querySelectorAll('*')).forEach(function(e) {console.log(e);console.log(getCSSPath(e))});