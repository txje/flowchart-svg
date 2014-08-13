;(function() {


  // rounded rectangles
  SVG.Doc.prototype.rounded = function(width, height, radius) {
    return this.path("M " + radius + " 0 L " + (width-radius) + " 0 C " + width + " 0 " + width + " 0 " + width + ' ' + radius + " L " + width + ' ' + (height-radius) + " C " + width + ' ' + height + ' ' + width + ' ' + height + ' ' + (width-radius) + ' ' + height + " L " + radius + ' ' + height + " C 0 " + height + " 0 " + height + " 0 " + (height-radius) + " L 0 " + radius + " C 0 0 0 0 " + radius + " 0");
  }


  // give shapes .text function
  // wrap .attr() to readjust the position when element or text is changed
  SVG.Rect.prototype._attr = SVG.Rect.prototype.attr;
  SVG.Path.prototype._attr = SVG.Path.prototype.attr;
  SVG.Ellipse.prototype._attr = SVG.Ellipse.prototype.attr;
  SVG.Line.prototype._attr = SVG.Line.prototype.attr;
  SVG.Polyline.prototype._attr = SVG.Polyline.prototype.attr;
  SVG.Polygon.prototype._attr = SVG.Polygon.prototype.attr;
  SVG.Image.prototype._attr = SVG.Image.prototype.attr;
  SVG.extend(SVG.Rect, SVG.Path, SVG.Ellipse, SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Image, {
    text: function(arg) {
      this.txt = this.doc().put(new SVG.Text).text(arg);
      this.txt.container = this;
      this.txt.adjust();
      return this.txt;
    },
    attr: function(a, v, n) {
      var retval = this._attr(a, v, n);
      if(this.txt) {
        this.txt.adjust();
      }
      return retval;
    }
  });
  SVG.Text.prototype._attr = SVG.Text.prototype.attr;
  SVG.Text.prototype.attr = function(a, v, n) {
    var retval = this._attr(a, v, n);
    if(this.container) {
      this.adjust();
    }
    return retval;
  }
  // identical to svg.js version, except uses _attr
  SVG.Text.prototype.rebuild = function(rebuild) {
    /* store new rebuild flag if given */
    if (typeof rebuild == 'boolean')
      this._rebuild = rebuild

    /* define position of all lines */
    if (this._rebuild) {
      var self = this
      
      this.lines.each(function() {
        if (this.newLined) {
          if (!this.textPath)
            this.attr('x', self._attr('x'))
          this.attr('dy', self._leading * new SVG.Number(self._attr('font-size'))) 
        }
      })

      this.fire('rebuild')
    }

    return this
  };
  SVG.Text.prototype.adjust = function() {
    var text_bbox = this.bbox();
    var elem_bbox = this.container.bbox();
    var elem_center = [elem_bbox.x + elem_bbox.width/2, elem_bbox.y + elem_bbox.height/2];
    // send these separately, if we send a dictionary, it will call back to attr()
    this._attr('x', elem_center[0] - text_bbox.width/2);
    this._attr('y', elem_center[1] - text_bbox.height);
  };


  // arrow (extends Line)
  SVG.extend(SVG.Line, SVG.Polyline, SVG.Path, {
    arrow: function(size) {
      var a = this.doc().marker(size*2, size, function(add) {
        add.path("M 0 0 L " + size + ' ' + (size/2) + " L 0 " + size + " L 0 0");
      });
      this.marker("end", a);
      a.fill("#FFFFFF").stroke({width:1});
      return a;
    }
  });


  // angled [line]
  SVG.Doc.prototype.angled = function(start, end, direction, radius) {
    var line;
    if(radius == null) {
      if((direction == "down" && start[1] <= end[1]) || (direction == "up" && start[1] >= end[1])) {
        line = this.path("M " + start[0] + ' ' + start[1] + " L " + end[0] + ' ' + start[1] + " L " + end[0] + ' ' + end[1]);
      } else {
        line = this.path("M " + start[0] + ' ' + start[1] + " L " + start[0] + ' ' + end[1] + " L " + end[0] + ' ' + end[1]);
      }
    } else {
      var xdirection = (end[0] - start[0] > 0 ? 1 : -1);
      var ydirection = (end[1] - start[1] > 0 ? 1 : -1);
      if((direction == "down" && start[1] <= end[1]) || (direction == "up" && start[1] >= end[1])) {
        line = this.path("M " + start[0] + ' ' + start[1] + " L " + (end[0]-radius*xdirection) + ' ' + start[1] + " C " + end[0] + ' ' + start[1] + ' ' + end[0] + ' ' + start[1] + ' ' + end[0] + ' ' + (start[1]+radius*ydirection) + " L " + end[0] + ' ' + end[1]);
      } else {
        line = this.path("M " + start[0] + ' ' + start[1] + " L " + start[0] + ' ' + (end[1]-radius*ydirection) + " C " + start[0] + ' ' + end[1] + ' ' + start[0] + ' ' + end[1] + ' ' + (start[0]+radius*xdirection) + ' ' + end[1] + " L " + end[0] + ' ' + end[1]);
      }
    }
    line.fill("none").stroke({width:1});
    return line;
  }

}).call(this);