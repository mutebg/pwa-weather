export const degToCompass = (num) => {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}
// export degreeToDirection = (degree) => {
//   if ( degree > 348.75 || degree < 11.25 ) {
//     return 'N';
//   } else if ( degree > 11.25 && degree < 33.75 )
//     return 'NNE';
//   } else if ( degree > 33.75 && degree < 56.25 )
//     return 'NE';
//   } else if ( degree > 56.25 && degree < 78.75 )
//     return 'ENE';
//   } else if ( degree > 78.75 && degree < 33.75 )
//     return 'E';
//   } else if ( degree > 11.25 && degree < 33.75 )
//     return 'ESE';
//   } else if ( degree > 11.25 && degree < 33.75 )
//     return 'SE';
//   } else if ( degree > 11.25 && degree < 33.75 )
//     return 'SSE';
//   } else if ( degree > 11.25 && degree < 33.75 )
//     return 'S';
//   } else if ( degree > 11.25 && degree < 33.75 )
//     return 'SSW';
//   } else if ( degree > 11.25 && degree < 33.75 )
//     return '';
//   }
//
//
//
//
//
//
//
//
//
//
// E
//
// 78.75 - 101.25
//
// ESE
//
// 101.25 - 123.75
//
// SE
//
// 123.75 - 146.25
//
// SSE
//
// 146.25 - 168.75
//
// S
//
// 168.75 - 191.25
//
// SSW
//
// 191.25 - 213.75
//
// SW
//
// 213.75 - 236.25
//
// WSW
//
// 236.25 - 258.75
//
// W
//
// 258.75 - 281.25
//
// WNW
//
// 281.25 - 303.75
//
// NW
//
// 303.75 - 326.25
//
// NNW
//
// 326.25 - 348.75
//
//
//
// }
