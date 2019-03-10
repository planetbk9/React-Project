// BrickLayout
function bricklayout() {
  var brickContainers = document.getElementsByClassName('brickcontainer');
  var bricks;

  [].forEach.call(brickContainers, function (container) {
      bricks = container.getElementsByClassName('brick-item-common');
      container.items = [].slice.call(bricks);
      [].forEach.call(container.items, function (brick) {
          brick.col = 0;
      });
  });

  var isIE = false || !!document.documentMode;

  return function onResize() {
      var totHeight = 0;

      [].forEach.call(brickContainers, function (container) {
          var containerWidth = getComputedValue(container, 'width');
          var colNum = findColNum(container);
          if (isNaN(colNum)) {
            container.style.height = 0 + 'px';
            return;
          }
          var posX = [];
          var posY = [];
          for (var i = 0; i < colNum; i++) {
              posX[i] = (containerWidth / colNum) * i;
              posY[i] = 0;
          }

          [].forEach.call(container.items, function (brick, index) {
              brick.col = colNum / Math.round(getComputedValue(container, 'width') / getComputedValue(brick, 'width'));
              var cand = {
                  x: 0,
                  y: 0
              };
              for (var i = 0; i < colNum; i++) {
                  var temp = {
                      x: i,
                      y: i
                  };
                  if(i + brick.col > colNum) continue;
                  for (var j = 0; j < brick.col; j++) {
                      if(posY[i+j] > posY[temp['y']]) {
                          temp['x'] = i;
                          temp['y'] = i+j;
                      }
                  }
                  if(posY[temp['y']] < posY[cand['y']]) cand = temp;
              }
              brick.style.left = posX[cand['x']] + 'px';
              brick.style.top = posY[cand['y']] + 'px';
              for(i=0; i<brick.col; i++) {
                  posY[i+cand['x']] = posY[i+cand['x']] + getComputedValue(brick, 'height');
              }
              totHeight = Math.max(totHeight, posY[cand['x']]);
          });
          container.style.height = totHeight + 'px';
      });

      function findColNum(container) {
          var item1 = container.getElementsByClassName('brick-item-1')[0];
          var item2 = container.getElementsByClassName('brick-item-2')[0];

          return Math.round(getComputedValue(container, 'width') / (item1 ? getComputedValue(item1, 'width') : item2 ? getComputedValue(item2, 'width') / 2 : NaN));
      }

      function getComputedValue(elem, style) {
          if(isIE) {
              if(style === 'width') {
                  return parseFloat(window.getComputedStyle(elem).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(elem).getPropertyValue('width')) + parseFloat(window.getComputedStyle(elem).getPropertyValue('padding-right'));
              } else if(style === 'height') {
                  return parseFloat(window.getComputedStyle(elem).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(elem).getPropertyValue('height')) + parseFloat(window.getComputedStyle(elem).getPropertyValue('padding-bottom'));
              }
          }
          return parseFloat(window.getComputedStyle(elem).getPropertyValue(style));
      }
  }
};

export default bricklayout;