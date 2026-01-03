/**
 * Min import of projJs (manual treeshaking)
 */
import core from 'proj4/lib/core'
import Proj from 'proj4/lib/Proj'
import Point from 'proj4/lib/Point'
import common from 'proj4/lib/common/toPoint'
import defs from 'proj4/lib/defs'
import nadgrid from 'proj4/lib/nadgrid'
import transform from 'proj4/lib/transform'
import mgrs from 'mgrs'
import stere from 'proj4/lib/projections/stere'
import utm from 'proj4/lib/projections/utm'
const proj4 = Object.assign(core, {
  defaultDatum: 'WGS84',
  Proj,
  WGS84: new Proj('WGS84'),
  Point,
  toPoint: common,
  defs,
  nadgrid,
  transform,
  mgrs,
  version: '__VERSION__',
})

proj4.Proj.projections.add(stere)
proj4.Proj.projections.add(utm)

export default proj4
