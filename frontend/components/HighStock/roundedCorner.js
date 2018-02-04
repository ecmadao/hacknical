/* eslint-disable prefer-destructuring */

/**
 * Highcharts plugin for creating individual rounded corners.
 *
 * Author: Torstein Honsi
 * Last revision: 2014-09-19
 * License: MIT License
 *
 * Known issues:
 * - Animation isn't working. To overcome that, create a method on the Renderer which points
 *   to a symbol definition, like it is currently done with "arc" in PieSeries.
 * - Dom exception on showing/hiding the series
 */

function RoundedCorner(H) {
  if (H._patchRoundCorner) return;

  H.wrap(H.seriesTypes.column.prototype, 'translate', function translate(proceed) {
    const options = this.options;
    const rTopLeft = options.borderRadiusTopLeft || 0;
    const rTopRight = options.borderRadiusTopRight || 0;
    const rBottomRight = options.borderRadiusBottomRight || 0;
    const rBottomLeft = options.borderRadiusBottomLeft || 0;
    const topMargin = options.topMargin || 0;
    const bottomMargin = options.bottomMargin || 0;

    proceed.call(this);

    if (rTopLeft || rTopRight || rBottomRight || rBottomLeft) {
      H.each(this.points, (point) => {
        const shapeArgs = point.shapeArgs;
        const w = shapeArgs.width;
        const h = shapeArgs.height;
        const x = shapeArgs.x;
        const y = shapeArgs.y;

        // Preserve the box for data labels
        point.dlBox = point.shapeArgs;

        point.shapeType = 'path';
        point.shapeArgs = {
          d: [
            'M', x + rTopLeft, y + topMargin,
            // top side
            'L', (x + w) - rTopRight, y + topMargin,
            // top right corner
            'C', (x + w) - (rTopRight / 2), y, x + w, y + (rTopRight / 2), x + w, y + rTopRight,
            // right side
            'L', x + w, (y + h) - rBottomRight,
            // bottom right corner
            'C', x + w, (y + h) - (rBottomRight / 2), (x + w) - (rBottomRight / 2), y + h, (x + w) - rBottomRight, (y + h) + bottomMargin,
            // bottom side
            'L', x + rBottomLeft, y + h + bottomMargin,
            // bottom left corner
            'C', x + (rBottomLeft / 2), y + h, x, (y + h) - (rBottomLeft / 2), x, (y + h) - rBottomLeft,
            // left side
            'L', x, y + rTopLeft,
            // top left corner
            'C', x, y + (rTopLeft / 2), x + (rTopLeft / 2), y, x + rTopLeft, y,
            'Z'
          ]
        };
      });
    }
  });

  H._patchRoundCorner = true;
}

export default RoundedCorner;
