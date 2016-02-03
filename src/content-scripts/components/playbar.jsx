import React from 'react';

const styles = {
  outer: {
    width: '100%'
  },
  played: {
    display: 'inline-block',
    backgroundColor: 'red',
    height: '5px'
  },
  rest: {
    display: 'inline-block',
    backgroundColor: 'black',
    height: '5px'
  },
  tick: {
    backgroundColor: '#f3b61f',
    height: '22px',
    width: '5px',
    position: 'absolute',
    display: 'inline-block'
  },
  tooltip: {
    backgroundColor: '#607D8B',
    height: '25px',
    width: '12%',
    position: 'absolute',
    marginTop: '15px',
    borderRadius: '5px',
    color: 'white',
    lineHeight: '30px',
    padding: '3px'
  }
}

// combine arbitrary number of objects. immutable version of ES6 Object.assign().
let m = function() {
  let result = {};
  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i]) {
      for (let k in arguments[i]) {
        result[k] = arguments[i][k];
      }
    }
  }
  return result;
}

/*
component that takes in currentTime, totalTime and annotations for current URL
outputs the clone of the youtube player with annotion ticks and tooltip annotation content
*/
export default class Playbar extends React.Component {
  constructor(props) {
    super(props);
    // each annotation time gets a boolean saying if its currently hovered
    this.state = {
      hovered: {}
    }
  }

  setTrue(time) {
    this.state.hovered[time] = true;
    this.setState({hovered: this.state.hovered});
  }

  setFalse(time) {
    this.state.hovered[time] = false;
    this.setState({hovered: this.state.hovered});
  }

  componentWillMount() {
    this.initAllToolTipsNotActive()
  }

  initAllToolTipsNotActive() {
    this.props.annotations.forEach((annotation) => {
      this.state.hovered[annotation.time] = false;
    })
    this.setState({hovered: this.state.hovered});
  }

  seekTo(time) {
    console.log(time);
    this.props.seekTo(time);
  }

  render() {
    const playedPercent = (this.props.currentTime / this.props.totalTime) * 100
    const restPercent = 100 - playedPercent;

    let ticks = this.props.annotations.map((annotation) => {
      let portion = (annotation.time / this.props.totalTime) * 100;

      // if not set then display none
      let d = {display: 'none'};
      if (this.state.hovered[annotation.time] === true) {
        d.display = 'inline-block';
      }

      return (
        <span key={annotation.time}>
          <div
            style={m(styles.tick, {left: portion + '%'})}
            onMouseOver={this.setTrue.bind(this, annotation.time)}
            onMouseOut={this.setFalse.bind(this, annotation.time)}
            onClick={this.seekTo.bind(this, annotation.time)}>
          </div>
          <div style={m(styles.tooltip, {left: (portion - 5) + '%'}, d)}>
              {annotation.content}
          </div>
        </span>
      )
    })

    return (
      <div style={styles.outer}>
        <div style={m(styles.played, {width: playedPercent + '%' })}></div>
        <div style={m(styles.rest, {width: restPercent + '%' })}></div>
        {ticks}
      </div>
    )
  }
}
