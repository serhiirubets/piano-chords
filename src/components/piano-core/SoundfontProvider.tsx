// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import React from 'react';
import PropTypes from 'prop-types';
import Soundfont from 'soundfont-player';

interface SoundFontProviderProps {
  instrumentName: string,
  hostname: string,
  format: string,
  soundfont: string,
  audioContext: any,
  render: any,
}

interface SoundFontProviderState {
  instrument : any,
  activeAudioNodes:any
}

class SoundfontProvider extends React.Component<SoundFontProviderProps,SoundFontProviderState> {
  static propTypes = {
    instrumentName: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
    format: PropTypes.oneOf(['mp3', 'ogg']),
    soundfont: PropTypes.oneOf(['MusyngKite', 'FluidR3_GM']),
    audioContext: PropTypes.instanceOf(window.AudioContext),
    render: PropTypes.func,
  };

  static defaultProps = {
    format: 'mp3',
    soundfont: 'MusyngKite',
    instrumentName: 'acoustic_grand_piano',
  };

  constructor(props:SoundFontProviderProps) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: null,
    };
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
  }

  componentDidUpdate(prevProps:any, prevState:any) {
    if (prevProps.instrumentName !== this.props.instrumentName) {
      this.loadInstrument(this.props.instrumentName);
    }
  }

  loadInstrument = instrumentName => {
    // Re-trigger loading state
    this.setState({
      instrument: null,
    });
    Soundfont.instrument(this.props.audioContext, instrumentName, {
      format: this.props.format,
      soundfont: this.props.soundfont,
      nameToUrl: (name, soundfont, format) => {
        return `${this.props.hostname}/${soundfont}/${name}-${format}.js`;
      },
    }).then(instrument => {
      this.setState({
        instrument,
      });
    });
  };

  playNote = (midiNumber, timestampOffset =0,options:{duration?:number, gain?:number}) => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber, this.props.audioContext.currentTime+timestampOffset, options);
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode,
        }),
      });
    });
  };

  stopNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      if (!this.state.activeAudioNodes[midiNumber]) {
        return;
      }
      const audioNode = this.state.activeAudioNodes[midiNumber];
      audioNode.stop();
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: null,
        }),
      });
    });
  };

  // Clear any residual notes that don't get called with stopNote
  stopAllNotes = () => {
    this.state.instrument.stop();

    this.props.audioContext.resume().then(() => {
      const activeAudioNodes = Object.values(this.state.activeAudioNodes);
      activeAudioNodes.forEach((node:any) => {
        if (node) {
          node.stop();
        }
      });
      this.setState({
        activeAudioNodes: {},
      });
    });
  };

  render() {
    return this.props.render({
      isLoading: !this.state.instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes,
    });
  }
}

export default SoundfontProvider;
