(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var mouse = {
  x: null,
  y: null
};

var setMouseCoords = function setMouseCoords(e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
};

var getMouseCoords = function getMouseCoords() {
  return {
    x: mouse.x,
    y: mouse.y
  };
};

function initOpts(_ref) {
  var width = _ref.width,
      height = _ref.height;

  var spacing = 50;
  var maxX = width;
  var maxY = height;
  var xBlocks = Math.max(1, Math.ceil(maxX / spacing));
  var yBlocks = Math.max(1, Math.ceil(maxY / spacing));
  var endSizeX = maxX - (xBlocks - 1) * spacing;
  var endSizeY = maxY - (yBlocks - 1) * spacing;
  var blocks = xBlocks * yBlocks;

  return {
    spacing: spacing,
    maxX: maxX,
    maxY: maxY,
    xBlocks: xBlocks,
    yBlocks: yBlocks,
    endSizeX: endSizeX,
    endSizeY: endSizeY,
    blocks: blocks
  };
}

var clamp = function clamp(input, min, max) {
  return Math.min(Math.max(input, min), max);
};

var randomInArr = function randomInArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomBetween = function getRandomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var UP = 'up';
var DOWN = 'down';
var LEFT = 'left';
var RIGHT = 'right';

var UP_LEFT = 'up_left';
var UP_RIGHT = 'up_right';
var DOWN_LEFT = 'down_left';
var DOWN_RIGHT = 'down_right';

var DIR_LIST = [UP, DOWN, LEFT, RIGHT, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT];

var getRandomDirection = function getRandomDirection(node) {
  var dirsMinusExcludes = DIR_LIST.filter(function (dir) {
    return node.dirExcludes.indexOf(dir) < 0;
  });
  return randomInArr(dirsMinusExcludes);
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
  function Node(opts) {
    _classCallCheck(this, Node);

    this.coords = [opts.x, opts.y];
    this.row = opts.row;
    this.col = opts.col;
    this.siblings = [];

    this.shouldChangeDir = false;
    this.dir = null;
    this.changeDirCountdown = 0;
    this.dirExcludes = [];

    this.minX = opts.minX;
    this.maxX = opts.maxX;

    this.minY = opts.minY;
    this.maxY = opts.maxY;

    this.highlightLevel = 0;
  }

  _createClass(Node, [{
    key: 'addSibling',
    value: function addSibling(node) {
      this.siblings.push(node);
    }
  }, {
    key: 'setDir',
    value: function setDir(dir) {
      this.dir = dir;
    }
  }, {
    key: 'setHighlightLevel',
    value: function setHighlightLevel(newLevel) {
      this.highlightLevel = newLevel;
    }
  }]);

  return Node;
}();

var connectNodes = function connectNodes(nodes, opts) {
  nodes.forEach(function (node, index) {
    if (node.col !== 1 && nodes[index - 1]) {
      // to the left
      nodes[index - 1].addSibling(node);
    }

    if (nodes[index - opts.xBlocks]) {
      // to the top
      nodes[index - opts.xBlocks].addSibling(node);
    }

    if (node.col !== opts.xBlocks && nodes[index + 1]) {
      // to the right
      nodes[index + 1].addSibling(node);
    }

    if (nodes[index + opts.xBlocks]) {
      // to the bottom
      nodes[index + opts.xBlocks].addSibling(node);
    }
  });

  return nodes;
};

var checkIfNodeShouldChangeDir = function checkIfNodeShouldChangeDir(node) {
  if (node.coords[0] === node.minX || node.coords[0] === node.maxX) {
    return true;
  } else if (node.coords[1] === node.minY || node.coords[1] === node.maxY) {
    return true;
  }
  return false;
};

var getDirExcludes = function getDirExcludes(node) {
  if (node.coords[0] === node.minX) {
    return [LEFT, UP, DOWN, UP_LEFT, DOWN_LEFT];
  } else if (node.coords[0] === node.maxX) {
    return [RIGHT, UP, DOWN, UP_RIGHT, DOWN_RIGHT];
  } else if (node.coords[1] === node.minY) {
    return [LEFT, UP, RIGHT, UP_LEFT, UP_RIGHT];
  } else if (node.coords[1] === node.maxY) {
    return [LEFT, DOWN, RIGHT, DOWN_LEFT, DOWN_RIGHT];
  }

  return [];
};

function generateNodes(opts) {
  var nodes = [];

  for (var y = 1, yy = opts.yBlocks; y <= yy; y += 1) {
    var ySpacing = y === yy ? opts.endSizeY : opts.spacing;
    var minY = (y - 1) * opts.spacing;

    for (var x = 1, xx = opts.xBlocks; x <= xx; x += 1) {
      var xSpacing = x === xx ? opts.endSizeX : opts.spacing;
      var minX = (x - 1) * opts.spacing;

      nodes.push(new Node({
        col: x,
        row: y,
        x: getRandomBetween(minX, minX + xSpacing),
        y: getRandomBetween(minY, minY + ySpacing),
        minX: minX,
        maxX: minX + xSpacing,
        minY: minY,
        maxY: minY + ySpacing
      }));
    }
  }

  return nodes;
}

var moveBy = 0.05;
var changeDirCountdown = 120;

var moveNodeUpBy = function moveNodeUpBy(node) {
  node.coords[1] = clamp(node.coords[1] - moveBy, node.minY, node.maxY);
  return node;
};

var moveNodeDownBy = function moveNodeDownBy(node) {
  node.coords[1] = clamp(node.coords[1] + moveBy, node.minY, node.maxY);
  return node;
};

var moveNodeRightBy = function moveNodeRightBy(node) {
  node.coords[0] = clamp(node.coords[0] + moveBy, node.minX, node.maxX);
  return node;
};

var moveNodeLeftBy = function moveNodeLeftBy(node) {
  node.coords[0] = clamp(node.coords[0] - moveBy, node.minX, node.maxX);
  return node;
};

var moveNodeUpLeft = function moveNodeUpLeft(node) {
  node = moveNodeUpBy(node);
  node = moveNodeLeftBy(node);
  return node;
};

var moveNodeUpRight = function moveNodeUpRight(node) {
  node = moveNodeUpBy(node);
  node = moveNodeRightBy(node);
  return node;
};

var moveNodeDownLeft = function moveNodeDownLeft(node) {
  node = moveNodeDownBy(node);
  node = moveNodeLeftBy(node);
  return node;
};

var moveNodeDownRight = function moveNodeDownRight(node) {
  node = moveNodeDownBy(node);
  node = moveNodeRightBy(node);
  return node;
};

var moveNodeDirSwitch = function moveNodeDirSwitch(node, dir) {
  switch (dir) {
    case UP:
      node.setDir(UP);
      node = moveNodeUpBy(node);
      break;
    case DOWN:
      node.setDir(DOWN);
      node = moveNodeDownBy(node);
      break;
    case LEFT:
      node.setDir(LEFT);
      node = moveNodeLeftBy(node);
      break;
    case RIGHT:
      node.setDir(RIGHT);
      node = moveNodeRightBy(node);
      break;
    case UP_LEFT:
      node.setDir(UP_LEFT);
      node = moveNodeUpLeft(node);
      break;
    case UP_RIGHT:
      node.setDir(UP_RIGHT);
      node = moveNodeUpRight(node);
      break;
    case DOWN_LEFT:
      node.setDir(DOWN_LEFT);
      node = moveNodeDownLeft(node);
      break;
    case DOWN_RIGHT:
      node.setDir(DOWN_RIGHT);
      node = moveNodeDownRight(node);
      break;
    default:
      console.warn('should not get to this default case');
  }

  return node;
};

var moveDirectionRandomlyBy = function moveDirectionRandomlyBy(node) {
  if (node.shouldChangeDir || node.changeDirCountdown <= 0 || !node.dir) {
    var dir = void 0;

    if (node.shouldChangeDir) {
      dir = getRandomDirection(node);
      node.shouldChangeDir = false;
    } else {
      dir = getRandomDirection(node);
    }

    node.changeDirCountdown = changeDirCountdown;

    node = moveNodeDirSwitch(node, dir);
  } else {
    node = moveNodeDirSwitch(node, node.dir);
    node.changeDirCountdown -= 1;
    node.shouldChangeDir = checkIfNodeShouldChangeDir(node);

    if (node.shouldChangeDir) {
      node.dirExcludes = getDirExcludes(node);
    } else {
      node.dirExcludes = [];
    }
  }

  return node;
};

var moveTowardsMouse = function moveTowardsMouse(node, mouse) {
  if (node.coords[0] > mouse.x) {
    node = moveNodeLeftBy(node);
  } else if (node.coords[0] < mouse.x) {
    node = moveNodeRightBy(node);
  }

  if (node.coords[1] > mouse.y) {
    node = moveNodeUpBy(node);
  } else if (node.coords[1] < mouse.y) {
    node = moveNodeDownBy(node);
  }

  return node;
};

var moveNodes = function moveNodes(nodes) {
  return nodes.map(function (node) {
    if (node.highlightLevel === 0) {
      return moveDirectionRandomlyBy(node);
    }
    return moveTowardsMouse(node, getMouseCoords(), moveBy * 2);
  });
};

var dotStyle = 'rgb(221, 221, 221)';
var lineStyle = {
  0: 'rgba(221, 221, 221, 0.4)',
  1: 'rgba(247, 147, 30, 0.4)',
  2: 'rgba(247, 147, 30, 0.8)'
};

var drawNode = function drawNode(node, ctx) {
  ctx.fillStyle = dotStyle;
  ctx.fillRect(node.coords[0], node.coords[1], 1, 1);
};



var drawLine = function drawLine(from, to, ctx, highlightLevel) {
  ctx.strokeStyle = lineStyle[highlightLevel];
  ctx.beginPath();
  ctx.moveTo(from.coords[0], from.coords[1]);
  ctx.lineTo(to.coords[0], to.coords[1]);
  ctx.closePath();
  ctx.stroke();
};

var drawConnections = function drawConnections(node, ctx) {
  node.siblings.forEach(function (sibling) {
    return drawLine(node, sibling, ctx, node.highlightLevel);
  });
};

var getHighlightedNode = function getHighlightedNode(nodes, mouse) {
  var highlightedNode = void 0;

  nodes.forEach(function (node) {
    if (node.minX <= mouse.x && mouse.x <= node.maxX && node.minY <= mouse.y && mouse.y <= node.maxY) {
      highlightedNode = node;
      node.setHighlightLevel(2);
    } else {
      node.setHighlightLevel(0);
    }
  });

  if (highlightedNode) {
    highlightedNode.siblings.forEach(function (node) {
      node.setHighlightLevel(1);
    });
  }
};

var draw = function draw(canvas, ctx, nodes, opts) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  getHighlightedNode(nodes, getMouseCoords());

  nodes.forEach(function (node) {
    drawNode(node, ctx, opts);
    // drawRect(node, ctx, opts);
    drawConnections(node, ctx, opts);
  });
};

// todo
// make everything non mutating (as much as possible)
// pure funtions
// optimize

function render(canvas, ctx, nodes, opts, stats) {
  stats.begin();
  draw(canvas, ctx, nodes, opts);
  stats.end();

  var newNodes = moveNodes(nodes);
  window.requestAnimationFrame(function () {
    return render(canvas, ctx, newNodes, opts, stats);
  });
}

function startRender() {
  var opts = initOpts({
    height: window.innerHeight,
    width: window.innerWidth
  });

  var stats = new Stats();
  stats.showPanel(0);

  document.onmousemove = setMouseCoords;
  var canvas = document.getElementById('graph');
  var ctx = canvas.getContext('2d');

  document.body.appendChild(stats.dom);

  canvas.width = opts.maxX;
  canvas.height = opts.maxY;

  var nodes = generateNodes(opts);
  nodes = connectNodes(nodes, opts);

  render(canvas, ctx, nodes, opts, stats);
}

window.onload = startRender;

})));
