export const QUADRAT_WIDTH = 40;
export const getDotWidth = QUADRAT_WIDTH/2;
export const getSmallDotWidth = getDotWidth/1.5;

export const AUTOSAVE_INTERVAL_MS = 5000;
export const DRAGGABLE_CLASSNAME = "container-dragger";
export const PRINTABLE_AREA_ID = "printable-area";

// @ts-ignore
// webkitAudioContext fallback needed to support Safari
export const audioContext = new (window.AudioContext || window.webkitAudioContext)();
export const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';
export const DEFAULT_INSTRUMENT = "bright_acoustic_piano"
export const SOUNDFONT_FORMAT = "mp3"
export const SOUNDFONT_FONT = "MusyngKite"
export const STANDARD_OFFSET_DURATION = 5;
