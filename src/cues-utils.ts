const extensionKey = 'hot-cues';

export function getOrCreateCue(allCues: SongCues, songId: string): SongCue {
    if (!allCues[songId])
        allCues[songId] = {cues: []};

    return allCues[songId];
}

export function loadCues(): SongCues {
    const rawData = Spicetify.LocalStorage.get(extensionKey);

    if (!rawData) {
        return {};
    }
    else {
        return JSON.parse(rawData.toString());
    }
}

export function trimCues(untrimmedCues: SongCues): SongCues {
    return Object.fromEntries(
        Object.entries(untrimmedCues).filter(([songUri, cues]) => countCues(cues.cues) > 0)
    );
}

export function msToReadableTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);

    return `${+minutes < 10 ? "0" : ""}${minutes}:${+seconds < 10 ? "0" : ""}${seconds}`
}

export function isValidCue(cue: number | undefined) {
    return cue != null && cue >= 0;
}

export function countCues(cues: number[]): number {
    return cues.filter(isValidCue).length;
}

export function removeHotCue(index: number, currentCues: SongCue): boolean {
    if (index >= currentCues.cues.length || currentCues.cues[index] < 0) {
        Spicetify.showNotification("🤷️ No cue to remove at #" + (index + 1).toString());

        return false;
    }
    else {
        Spicetify.showNotification("🗑️ Removing cue #" + (index + 1).toString());
        currentCues.cues[index] = -1;

        return true;
    }
}

/**
 * @return Whether the cues were updated or not
 */
export function addOrGoToHotCue(index: number, songCues: SongCue): boolean {
    if (index >= songCues.cues.length || songCues.cues[index] < 0) {
        const trackProgressMs = Spicetify.Player.getProgress();

        Spicetify.showNotification("⏺️ Recording cue #" + (index + 1).toString() + " at " + msToReadableTime(trackProgressMs));
        songCues.cues[index] = trackProgressMs;

        return true;
    }
    else {
        const seekTime = songCues.cues[index];

        Spicetify.showNotification("⏩️ Seeking cue #" + (index + 1).toString() + " at " + msToReadableTime(seekTime));
        Spicetify.Player.seek(seekTime);

        return false;
    }
}

export function saveCues(toSave: SongCues) {
    Spicetify.LocalStorage.set(extensionKey, JSON.stringify(trimCues(toSave)));
}
