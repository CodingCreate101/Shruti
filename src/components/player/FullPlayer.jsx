/* eslint-disable no-undef */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  togglePlayer,
  changeSong,
  seekSong,
  changePlaybackRate,
  toggleTimer,
  updateSeekStatus,
  updatePlayed
} from '../../actions/playerActions';
import Duration from '../../Duration';
import CoverImage from '../../files/cover.jpg';
import Header from '../layout/Header';

class FullPlayer extends Component {
  componentDidMount() {
    if (!this.props.player.song.title) {
      this.props.history.push('/book');
    }
  }

  getSongIndexOnPlaylist = selectedSong => {
    return this.props.player.songsList.findIndex(song => {
      return song === selectedSong;
    });
  };

  playNextOrPrevSong = pick => {
    const a = this.props.player;
    const songIndex = this.getSongIndexOnPlaylist(a.song);
    if (a.songsList[songIndex + pick] !== undefined) {
      this.props.changeSong(a.songsList[songIndex + pick]);
    }
  };

  seekSong = amount => {
    this.props.seekSong(amount);
  };

  togglePlay = () => {
    this.props.togglePlayer();
  };

  handleRateChange = e => {
    this.props.changePlaybackRate(e.target.value);
  };

  handleBookMark = () => {
    // eslint-disable-next-line no-console
    console.log('Handle BookMark');
  };

  sleeper = dur => {
    setTimeout(() => {
      this.togglePlay();
      this.props.toggleTimer();
    }, dur * 1000);
  };

  sleepTimer = () => {
    this.props.toggleTimer();

    setTimeout(() => {
      clearTimeout(this.sleeper);
      if (this.props.player.timerStatus === true) {
        this.sleeper(localStorage.getItem('sleepTime') - 2); // 10-2=8 because 3 secs are taken for "proper" verification.
      }
    }, 2000);
  };

  someFunction = () => {
    // DO this
  };

  onSeekMouseDown = () => {
    this.props.updateSeekStatus(true);
  };

  onSeekChange = e => {
    this.props.updatePlayed(parseFloat(e.target.value));
  };

  onSeekMouseUp = e => {
    this.props.updateSeekStatus(false);
    this.props.seekSong(parseFloat(e.target.value));
    // this.player.seekTo(parseFloat(e.target.value))
  };

  // onProgress = state => {
  // console.log('onProgress', state)
  // // We only want to update time slider if we are not currently seeking
  // if (!this.state.seeking) {
  //   this.setState(state)
  // }
  // };

  songEnded = () => {
    // eslint-disable-next-line no-console
    console.log('Song ended');
  };

  render() {
    const { player } = this.props;
    let timerClass = 'bigFont waves-effect waves-light';
    let showTimerMin = '';

    showTimerMin = (
      <span className="controlLabels">
        {`${localStorage.getItem('sleepTime') / 60} min (Beta)`}
      </span>
    ); // TODO: Bete until this works properly

    if (player.timerStatus) {
      timerClass += ' text-success';
    }

    const headerOptions = {
      backLink: '/book',
      title: player.song.title,
      narrator: player.song.narrator,
      year: player.song.release,
      floatButton: true
    };

    const button = player.playing
      ? 'fas fa-pause-circle'
      : 'fas fa-play-circle';

    return (
      <Fragment>
        <div className="container">
          <div className="row">
            <div className="col-xl col-lg col-md-2 col-sm-2"> </div>
            <div className="col-xl-4 col-lg-4 col-md-8 col-sm-8">
              <div className="grey darken-4 text-center FullPlayer">
                {/* Header */}
                <Header options={headerOptions} />

                {/* Header Image */}
                <div className="text-white center container">
                  <div
                    className="row coverImage"
                    style={{ backgroundImage: `url(${CoverImage})` }}
                  />
                </div>
              </div>
              This app is meant for mobile use
            </div>
            <div className="col-xl col-lg col-md-2 col-sm-2"> </div>
          </div>
        </div>

        {/* Player controls */}
        <div className="playerControls-main" style={{}}>
          <div className="container">
            <div className="row">
              <div className="col-xl col-lg col-md-2 col-sm-2"> </div>
              <div className="col-xl-4 col-lg-4 col-md-8 col-sm-8">
                <div className="playerControls text-white">
                  <div className="row align-middle">
                    <div className="col">
                      <input
                        value={player.played}
                        className="seekBar"
                        type="range"
                        min={0.0001}
                        max={0.9999}
                        step="any"
                        onPointerDown={this.onSeekMouseDown}
                        onChange={this.onSeekChange}
                        onTouchMove={this.onSeekChange}
                        onPointerUp={this.onSeekMouseUp}
                      />
                      <progress
                        className="progressBar"
                        max={0.9999}
                        value={player.played}
                      />

                      <span className="durations">
                        <span className="float-left">
                          <Duration seconds={player.playedSeconds} />
                        </span>
                        <span className="float-right">
                          <Duration
                            seconds={
                              player.totalDuration - player.playedSeconds
                            }
                          />
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="row align-middle">
                    <div className="col text-right">
                      <span
                        className="bigFont align-middle"
                        onClick={() => this.playNextOrPrevSong(-1)}
                        onKeyPress={() => this.playNextOrPrevSong(-1)}
                        role="button"
                        tabIndex="0"
                      >
                        <i className="fas fa-chevron-circle-left" />
                      </span>
                    </div>
                    <div className="col">
                      <span
                        className="biggerFont"
                        onClick={this.togglePlay}
                        onKeyPress={this.togglePlay}
                        role="button"
                        tabIndex="0"
                      >
                        <i className={button} />
                      </span>
                    </div>
                    <div className="col text-left">
                      <span
                        className="bigFont"
                        onClick={() => this.playNextOrPrevSong(1)}
                        onKeyPress={() => this.playNextOrPrevSong(1)}
                        role="button"
                        tabIndex="0"
                      >
                        <i className="fas fa-chevron-circle-right" />
                      </span>
                    </div>
                  </div>

                  <div className="spacer" />

                  <div className="row align-middle">
                    <div className="col">
                      <span
                        className="bigFont waves-effect waves-light"
                        onClick={() => this.seekSong('60m')}
                        onKeyPress={() => this.seekSong('60m')}
                        role="button"
                        tabIndex="0"
                      >
                        <i className="fas fa-undo-alt" />
                        <span className="controlLabels">1m</span>
                      </span>
                    </div>

                    <div className="col text-right">
                      <span
                        className="bigFont waves-effect waves-light"
                        onClick={() => this.seekSong('10m')}
                        onKeyPress={() => this.seekSong('10m')}
                        role="button"
                        tabIndex="0"
                      >
                        <i className="fas fa-undo-alt" />
                        <span className="controlLabels">10s</span>
                      </span>
                    </div>

                    <div className="col text-center">
                      {/* // eslint-disable-next-line prettier/prettier */}
                      {/* <span className="bigFont" onClick={this.handleBookMark}>
                          <i className="fas fa-bookmark" />
                      </span> */}
                    </div>

                    <div className="col text-left">
                      <span
                        className="bigFont waves-effect waves-light"
                        onClick={() => this.seekSong('10p')}
                        onKeyPress={() => this.seekSong('10p')}
                        role="button"
                        tabIndex="0"
                      >
                        <i className="fas fa-redo-alt" />
                        <span className="controlLabels">10s</span>
                      </span>
                    </div>

                    <div className="col">
                      <span
                        className="bigFont waves-effect waves-light"
                        onClick={() => this.seekSong('60p')}
                        onKeyPress={() => this.seekSong('60p')}
                        role="button"
                        tabIndex="0"
                      >
                        <i className="fas fa-redo-alt" />
                        <span className="controlLabels">1m</span>
                      </span>
                    </div>
                  </div>

                  <div className="spacer" />

                  <div className="row align-middle">
                    <div className="col" />
                    <div className="col">
                      <select
                        className="custom-select"
                        onChange={this.handleRateChange}
                        defaultValue={player.playbackRate}
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={1.75}>1.75x</option>
                        <option value={2}>2x</option>
                        <option value={2.25}>2.25x</option>
                        <option value={2.5}>2.5x</option>
                        <option value={2.75}>2.75x</option>
                        <option value={3}>3x</option>
                      </select>
                    </div>

                    <div className="col-6 bigFont">
                      <span
                        className={timerClass}
                        onClick={this.sleepTimer}
                        onKeyPress={this.sleepTimer}
                        role="button"
                        tabIndex="0"
                      >
                        <i className="fas fa-stopwatch" />
                        {showTimerMin}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl col-lg col-md-2 col-sm-2"> </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStoreToProps = state => {
  return {
    player: state.player
  };
};

const mapDispatchToProps = dispatch => {
  return {
    togglePlayer: () => dispatch(togglePlayer()),
    changeSong: songId => dispatch(changeSong(songId)),
    seekSong: duration => dispatch(seekSong(duration)),
    changePlaybackRate: rate => dispatch(changePlaybackRate(rate)),
    toggleTimer: rate => dispatch(toggleTimer(rate)),
    updateSeekStatus: status => dispatch(updateSeekStatus(status)),
    updatePlayed: value => dispatch(updatePlayed(value))
  };
};

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(FullPlayer);

// TODO: SEE IF YOU CAN SIMPLIFY this.props.<>.<>.<> tail by spreading props in simple variable - but that for later.
