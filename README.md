# hot-cues

This extension provides hot cues for low-cost DJ'ing with Spotify.
Hot cues are persisted on your computer, meaning you will still have
them handy even after closing Spotify! 🎉

## Hot cues?

Hot cues are locations in a song that one can record to seek to.
For instance, you might want to pinpoint the end of the song intro
or a specific part of the track. With a press of a button, you may
then jump right into them. ⏩️

## Usage

### Adding & removing hot cues

#### Keyboard ⌨️
* <kbd>N</kbd> will record hot cue N (eg. 1) when it doesn't exist, or skip to it when it does
* <kbd>Shit</kbd> + <kbd>N</kbd> to remove hot cue N

#### Mouse 🖱️

* <kbd>Click</kbd> on cue N to record or go to cue
* <kbd>Shift</kbd> + <kbd>Click</kbd> to remove hot cue N

#### UI 🖥️

![Topbar preview](/assets/topbar.png?raw=true)

There are 4 circles at the top of the Spotify player indicating the
current status of all cues. When they're on, they display the
timecode of the given cue

![Cues loading](/assets/loading.png?raw=true)

When you load a track, the number of cues will be displayed if there
are any, otherwise nothing gets displayed.

![Cue recorded](/assets/record.png?raw=true)

![Cue removed](/assets/remove.png?raw=true)

![Cue recorded](/assets/seek.png?raw=true)

You may then record cues, seek to them and delete them.

## Limitations

When the user seeks to a certain position by hand, seeking with hot cues doesn't move the song cursor straightaway.
When the song gets played again, it is at the right position though.

[![Github Stars](https://img.shields.io/github/stars/gray-matter/spicetify-hot-cues?logo=github&style=social)](https://github.com/gray-matter/spicetify-hot-cues)