import * as Mousetrap from 'mousetrap';
import {addOrGoToHotCue, countCues, getOrCreateCue, isValidCue, loadCues, removeHotCue, saveCues} from './cues-utils';

function warnNoSong() {
  Spicetify.showNotification("⛔️ No song currently playing");
}

function cueButtonClick(index: number, currentCues: SongCue,
                        shiftCurrentlyPushed: boolean): boolean {
  if (shiftCurrentlyPushed) {
    return removeHotCue(index, currentCues);
  }
  else {
    return addOrGoToHotCue(index, currentCues);
  }
}

function generateCuesButtons(cueColors: string[],
                             callback: (_: number) => (_: Spicetify.Topbar.Button) => void): Spicetify.Topbar.Button[] {
  let cueButtons = new Array(cueColors.length)

  for (let i = 0; i < 4; ++i) {
    cueButtons[i] = new Spicetify.Topbar.Button(
        "Cue #" + i,
        generateButton(cueColors[i], false),
        callback(i)
    );
  }

  return cueButtons;
}

function updateCueState(cueButtons: Spicetify.Topbar.Button[], cueColors: string[],
                        cueIndex: number, enabled: boolean): void {
  cueButtons[cueIndex].icon = generateButton(cueColors[cueIndex], enabled);
}

function generateButton(color: string, enabled: boolean): string {
  return `<svg viewBox="0 0 100 100"><circle cx=50 cy=50 r="50" fill="${color}" fill-opacity="${enabled ? 0.9 : 0.2}"/></svg>`
}

function updateCurrentSong(allCues: SongCues): SongCue | undefined
{
  const data = Spicetify.Player.data || Spicetify.Queue;

  if (data) {
    const currentSong = data.track?.uri!
    const currentCues = getOrCreateCue(allCues, currentSong);
    const nbCuesForSong = countCues(currentCues.cues);

    if (nbCuesForSong > 0) {
      Spicetify.showNotification("ℹ️ Found " + nbCuesForSong + " clues for this track");
    }

    return currentCues;
  }

  return undefined;
}

function updateCuesButtons(currentCues: SongCue,
                           cueButtons: Spicetify.Topbar.Button[], cueColors: string[]) {
  for (let i = 0; i < currentCues.cues.length; ++i) {
    updateCueState(cueButtons, cueColors, i, isValidCue(currentCues.cues[i]));
  }

  for (let i = currentCues.cues.length; i < cueColors.length; ++i) {
    updateCueState(cueButtons, cueColors, i, false);
  }
}

async function main() {
  while (!Spicetify?.showNotification) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const cueColors = ['green', 'yellow', 'orange', 'pink'];
  const nbCues = cueColors.length;
  let currentCues: SongCue | undefined;
  let shiftCurrentlyPushed = false;
  let allCues = loadCues();
  let cueButtons : Spicetify.Topbar.Button[];

  cueButtons = generateCuesButtons(cueColors,
      (i: number) =>
          (_: Spicetify.Topbar.Button) => {
            if (!currentCues) {
              warnNoSong();
              return;
            }

            if (cueButtonClick(i, currentCues, shiftCurrentlyPushed)) {
              saveCues(allCues);
              updateCuesButtons(currentCues, cueButtons, cueColors);
            }
          });

  for (let i = 1; i <= 9; ++i) {
    const keyCode = 48 + i;
    Mousetrap.addKeycodes({
      [keyCode]: `Digit${i}`
    });
  }

  window.addEventListener('keydown', (event) => {
    for (let i = 0; i < nbCues; ++i) {
      if (event.code == `Digit${i + 1}`) {
        if (!currentCues) {
          warnNoSong();
          return;
        }

        let needsUpdate;

        if (event.shiftKey) {
          needsUpdate = removeHotCue(i, currentCues);
        }
        else {
          needsUpdate = addOrGoToHotCue(i, currentCues);
        }

        if (needsUpdate) {
          updateCuesButtons(currentCues, cueButtons, cueColors);
          saveCues(allCues);
        }
      }
    }

    if (event.code == "Shift") {
      shiftCurrentlyPushed = true;
      return;
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.code == "Shift") {
      shiftCurrentlyPushed = false;
      return;
    }
  });

  let onNewSong = () => {
    currentCues = updateCurrentSong(allCues);

    if (currentCues)
      updateCuesButtons(currentCues, cueButtons, cueColors)
  }

  Spicetify.Player.addEventListener("songchange", onNewSong);
  onNewSong();
}

export default main;
