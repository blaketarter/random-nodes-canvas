(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.RandomNodes = factory());
}(this, (function () { 'use strict';

var mouse = {
  x: null,
  y: null,
  isMouseOverCanvas: false
};

var setMouseCoords = function setMouseCoords(e) {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
};

var getMouseCoords = function getMouseCoords() {
  return {
    x: mouse.x,
    y: mouse.y,
    isMouseOverCanvas: mouse.isMouseOverCanvas
  };
};

var onMouseEnter = function onMouseEnter() {
  mouse.isMouseOverCanvas = true;
};

var onMouseLeave = function onMouseLeave() {
  mouse.isMouseOverCanvas = false;
};

function initOpts(_ref) {
  var width = _ref.width,
      height = _ref.height,
      _ref$cellSize = _ref.cellSize,
      cellSize = _ref$cellSize === undefined ? 50 : _ref$cellSize;

  var spacing = cellSize;
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

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Node = function () {
  function Node(opts) {
    classCallCheck(this, Node);

    this.x = opts.x;
    this.y = opts.y;
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

  createClass(Node, [{
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
    key: 'setDirExcludes',
    value: function setDirExcludes(excludes) {
      this.dirExcludes = excludes;
    }
  }, {
    key: 'setHighlightLevel',
    value: function setHighlightLevel(newLevel) {
      this.highlightLevel = newLevel;
    }
  }, {
    key: 'setX',
    value: function setX(newX) {
      this.x = newX;
    }
  }, {
    key: 'setY',
    value: function setY(newY) {
      this.y = newY;
    }
  }, {
    key: 'setShouldChangeDir',
    value: function setShouldChangeDir(shouldChange) {
      this.shouldChangeDir = shouldChange;
    }
  }, {
    key: 'setDirCountdown',
    value: function setDirCountdown(newCount) {
      this.changeDirCountdown = newCount;
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
  if (node.x === node.minX || node.x === node.maxX) {
    return true;
  } else if (node.y === node.minY || node.y === node.maxY) {
    return true;
  }
  return false;
};

var getDirExcludes = function getDirExcludes(node) {
  if (node.x === node.minX) {
    return [LEFT, UP, DOWN, UP_LEFT, DOWN_LEFT];
  } else if (node.x === node.maxX) {
    return [RIGHT, UP, DOWN, UP_RIGHT, DOWN_RIGHT];
  } else if (node.y === node.minY) {
    return [LEFT, UP, RIGHT, UP_LEFT, UP_RIGHT];
  } else if (node.y === node.maxY) {
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
  node.setY(clamp(node.y - moveBy, node.minY, node.maxY));
};

var moveNodeDownBy = function moveNodeDownBy(node) {
  node.setY(clamp(node.y + moveBy, node.minY, node.maxY));
};

var moveNodeRightBy = function moveNodeRightBy(node) {
  node.setX(clamp(node.x + moveBy, node.minX, node.maxX));
};

var moveNodeLeftBy = function moveNodeLeftBy(node) {
  node.setX(clamp(node.x - moveBy, node.minX, node.maxX));
};

var moveNodeUpLeft = function moveNodeUpLeft(node) {
  moveNodeUpBy(node);
  moveNodeLeftBy(node);
};

var moveNodeUpRight = function moveNodeUpRight(node) {
  moveNodeUpBy(node);
  moveNodeRightBy(node);
};

var moveNodeDownLeft = function moveNodeDownLeft(node) {
  moveNodeDownBy(node);
  moveNodeLeftBy(node);
};

var moveNodeDownRight = function moveNodeDownRight(node) {
  moveNodeDownBy(node);
  moveNodeRightBy(node);
};

var moveNodeDirSwitch = function moveNodeDirSwitch(node, dir) {
  switch (dir) {
    case UP:
      node.setDir(UP);
      moveNodeUpBy(node);
      break;
    case DOWN:
      node.setDir(DOWN);
      moveNodeDownBy(node);
      break;
    case LEFT:
      node.setDir(LEFT);
      moveNodeLeftBy(node);
      break;
    case RIGHT:
      node.setDir(RIGHT);
      moveNodeRightBy(node);
      break;
    case UP_LEFT:
      node.setDir(UP_LEFT);
      moveNodeUpLeft(node);
      break;
    case UP_RIGHT:
      node.setDir(UP_RIGHT);
      moveNodeUpRight(node);
      break;
    case DOWN_LEFT:
      node.setDir(DOWN_LEFT);
      moveNodeDownLeft(node);
      break;
    case DOWN_RIGHT:
      node.setDir(DOWN_RIGHT);
      moveNodeDownRight(node);
      break;
    default:
      node.setDir(DOWN_LEFT);
      moveNodeDownLeft(node);
  }
};

var moveDirectionRandomlyBy = function moveDirectionRandomlyBy(node) {
  if (node.shouldChangeDir || node.changeDirCountdown <= 0 || !node.dir) {
    var dir = void 0;

    if (node.shouldChangeDir) {
      dir = getRandomDirection(node);
      node.setShouldChangeDir(false);
    } else {
      dir = getRandomDirection(node);
    }

    node.setDirCountdown(changeDirCountdown);

    moveNodeDirSwitch(node, dir);
  } else {
    moveNodeDirSwitch(node, node.dir);
    node.setDirCountdown(node.changeDirCountdown - 1);
    node.setShouldChangeDir(checkIfNodeShouldChangeDir(node));

    if (node.shouldChangeDir) {
      node.setDirExcludes(getDirExcludes(node));
    } else {
      node.setDirExcludes([]);
    }
  }

  return node;
};

var moveTowardsMouse = function moveTowardsMouse(node, mouse) {
  if (node.x > mouse.x) {
    moveNodeLeftBy(node);
  } else if (node.x < mouse.x) {
    moveNodeRightBy(node);
  }

  if (node.y > mouse.y) {
    moveNodeUpBy(node);
  } else if (node.y < mouse.y) {
    moveNodeDownBy(node);
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
  /* eslint-disable */
  ctx.fillStyle = dotStyle;
  /* eslint-enable */
  ctx.fillRect(node.x, node.y, 1, 1);
};



var drawLine = function drawLine(fromNode, toNode, ctx, highlightLevel) {
  /* eslint-disable */
  ctx.strokeStyle = lineStyle[highlightLevel];
  /* eslint-enable */
  ctx.beginPath();
  ctx.moveTo(fromNode.x, fromNode.y);
  ctx.lineTo(toNode.x, toNode.y);
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
    if (mouse.isMouseOverCanvas && node.minX <= mouse.x && mouse.x <= node.maxX && node.minY <= mouse.y && mouse.y <= node.maxY) {
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

function render(canvas, ctx, nodes, opts, beforeRender, afterRender) {
  beforeRender();
  draw(canvas, ctx, nodes, opts);
  afterRender();

  var newNodes = moveNodes(nodes);
  window.requestAnimationFrame(function () {
    return render(canvas, ctx, newNodes, opts, beforeRender, afterRender);
  });
}

function startRender(_ref) {
  var height = _ref.height,
      width = _ref.width,
      cellSize = _ref.cellSize,
      canvasElement = _ref.canvasElement,
      beforeRender = _ref.beforeRender,
      afterRender = _ref.afterRender;

  var opts = initOpts({
    height: height,
    width: width,
    cellSize: cellSize
  });

  var canvas = canvasElement;
  var ctx = canvas.getContext('2d');

  canvas.onmousemove = setMouseCoords;
  canvas.onmouseenter = onMouseEnter;
  canvas.onmouseleave = onMouseLeave;

  canvas.width = opts.maxX;
  canvas.height = opts.maxY;

  var nodes = generateNodes(opts);
  nodes = connectNodes(nodes, opts);

  render(canvas, ctx, nodes, opts, beforeRender, afterRender);
}

var RandomNodes = function () {
  function RandomNodes(_ref2) {
    var height = _ref2.height,
        width = _ref2.width,
        cellSize = _ref2.cellSize,
        _ref2$beforeRender = _ref2.beforeRender,
        beforeRender = _ref2$beforeRender === undefined ? function () {} : _ref2$beforeRender,
        _ref2$afterRender = _ref2.afterRender,
        afterRender = _ref2$afterRender === undefined ? function () {} : _ref2$afterRender,
        canvasElement = _ref2.canvasElement;
    classCallCheck(this, RandomNodes);

    this.height = height;
    this.width = width;
    this.cellSize = cellSize;
    this.canvasElement = canvasElement;
    this.beforeRender = beforeRender;
    this.afterRender = afterRender;

    if (!(this.canvasElement instanceof HTMLCanvasElement)) {
      console.error('canvasElement needs to be of type "HTMLCanvasElement"');
    }
  }

  createClass(RandomNodes, [{
    key: 'start',
    value: function start() {
      startRender({
        height: this.height,
        width: this.width,
        cellSize: this.cellSize,
        canvasElement: this.canvasElement,
        beforeRender: this.beforeRender,
        afterRender: this.afterRender
      });
    }
  }]);
  return RandomNodes;
}();

return RandomNodes;

})));
