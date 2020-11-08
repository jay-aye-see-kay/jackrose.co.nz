module.exports = {
  async redirects() {
    return [
      { source: "/portfolio/calculator"    , destination: "/blog/calculator"               , permanent: true , } ,
      { source: "/portfolio/design_theory" , destination: "/blog/design-theory"            , permanent: true , } ,
      { source: "/portfolio/freecodecamp"  , destination: "/blog/freecodecamp"             , permanent: true , } ,
      { source: "/portfolio/leds"          , destination: "/blog/ardunio-leds"             , permanent: true , } ,
      { source: "/portfolio/longreach"     , destination: "/blog/longreach"                , permanent: true , } ,
      { source: "/portfolio/peedamulla"    , destination: "/blog/peedamulla"               , permanent: true , } ,
      { source: "/portfolio/psz"           , destination: "/blog/psz"                      , permanent: true , } ,
      { source: "/portfolio/simon"         , destination: "/blog/simon"                    , permanent: true , } ,
      { source: "/portfolio/speling"       , destination: "/blog/speling"                  , permanent: true , } ,
      { source: "/portfolio/temple"        , destination: "/blog/blazing-swan-temple-2018" , permanent: true , } ,
    ];
  },
};
