function init() {
  script.log("Custom module init");
  if (local.parameters.overrideRemoteState.get() == true) {
    script.log("sending remote: override: true in init");
    sendToHyperdeck("remote: override: true");
  }
}

function moduleParameterChanged(param) {
  script.log(param.name + " parameter changed");

  if (param.isParameter()) {
    if (param.name === "overrideRemoteState") {
      if (local.parameters.output.isConnected.get() == 1){
        param.get()
        ? sendToHyperdeck("remote: override: true")
        : sendToHyperdeck("remote: override: false");
      }
    } else if (param.name === "isConnected" && param.get() == 1) {
      if (local.parameters.overrideRemoteState.get() == 1){
        script.log("on envoie le remote override");
        sendToHyperdeck("remote: override: true");
      }
    }
  }
}

function moduleValueChanged(value) {
  script.log(value.name + " value changed");

  if (!value.isParameter()) {
    // if it is a trigger
    script.log("it is a trigger");
    if (value.name === "play") play();
    else if (value.name === "play_looped_") playLooped();
    else if (value.name === "stop") stop();
  }
}

function dataReceived(data) {
  //If mode is "Lines", you can expect data to be a single line String
  script.log("Data received : " + data);

  if (data.charAt(0) === "1") {
    script.logError(local.name + " : " + data);
  }  
  if (data === "111 remote control disabled") {
    if (local.parameters.overrideRemoteState.get() === true) {
      sendToHyperdeck("remote: override: true");
    }
  }
}

function sendToHyperdeck(message) {
  script.log("sending message : " + message);
  local.send(message + "\n");
}

// Here are the callback functions for the commands

function play() {
  sendToHyperdeck("play");
}

function playLooped() {
  sendToHyperdeck("play: loop: true");
}

function stop() {
  sendToHyperdeck("stop");
}



function goToTimecode(tc_string) {
  //remove start and trailing space char
  var trimmed_tc = tc_string.trim();

  // check for validity of tc_string
  var is_valid = true;
  if (trimmed_tc.split(":").length != 4) {
    is_valid = false;
  }
  if (trimmed_tc.length != 11){
    is_valid = false;
  }
  if (
    !isCharNumber(trimmed_tc.charAt(1)) ||
    !isCharNumber(trimmed_tc.charAt(0)) ||
    !isCharNumber(trimmed_tc.charAt(3)) ||
    !isCharNumber(trimmed_tc.charAt(4)) ||
    !isCharNumber(trimmed_tc.charAt(6)) ||
    !isCharNumber(trimmed_tc.charAt(7)) ||
    !isCharNumber(trimmed_tc.charAt(9)) ||
    !isCharNumber(trimmed_tc.charAt(10))
  ) {
    is_valid = false;
  }

  if (is_valid) {
    sendToHyperdeck("goto: timecode: " + trimmed_tc);
  } else {
    script.logError("Not a valid timecode");
  }
}

function sendCustomMessage(message) {
  sendToHyperdeck(message);
}

// utility functions 

function isCharNumber(c) {
  return c >= '0' && c <= '9';
}
