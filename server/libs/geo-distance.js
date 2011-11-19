var a = 6378137,
    b = (6378137 * 297.257223563) / 298.257223563,
    R_m = Math.pow(a * a * b, 1/3);

function cylindrics(phi) {
  var u = a * Math.cos(phi),
      v = b * Math.sin(phi),
      w = Math.sqrt(u * u + v * v),

      r = a * u / w,
      z = b * v / w,
      R = Math.sqrt(r * r + z * z);

    return { r : r, z : z, R : R };
}

module.exports = function(lat1, lng1, lat2, lng2, small) {
    var p1 = cylindrics(lat1),
        p2 = cylindrics(lat2),
        dLambda = lng1 - lng2;

    var cos_dLambda = Math.cos(dLambda),
      scalar_xy = p1.r * p2.r * cos_dLambda,
      cos_alpha = (scalar_xy + p1.z * p2.z) / (p1.R * p2.R);

    if(small) {
      var dr2 = p1.r * p1.r + p2.r * p2.r - 2 * scalar_xy,
        dz2 = (p1.z - p2.z) * (p1.z - p2.z),
        R = Math.sqrt((dr2 + dz2) / (2 * (1 - cos_alpha)));
    }
    else R = R_m;

    return R * Math.acos(cos_alpha);
  };
