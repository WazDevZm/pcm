#!/usr/bin/env python3
"""
Original calm instrumental for The Haven intro video (no samples, no licensing).
Warm pad + soft piano arpeggios + gentle bass in D major, with a convolution reverb.

    python3 scripts/video/music.py <seconds> <out.wav>
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 72
BEAT = 60 / BPM
BAR = BEAT * 4

# D – Bm – G – A, one chord per bar (MIDI notes)
CHORDS = [
    [50, 62, 66, 69],  # D
    [47, 62, 66, 71],  # Bm
    [43, 62, 67, 71],  # G
    [45, 61, 64, 69],  # A
]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def envelope(n, attack, release):
    env = np.ones(n)
    a = min(int(attack * SR), n)
    r = min(int(release * SR), n - a)
    env[:a] = np.linspace(0, 1, a) ** 2
    if r > 0:
        env[n - r:] = np.linspace(1, 0, r) ** 2
    return env


def pad_tone(f, n):
    t = np.arange(n) / SR
    tone = np.zeros(n)
    for cents in (-4, 0, 4):
        ff = f * 2 ** (cents / 1200)
        tone += np.sin(2 * np.pi * ff * t) + 0.18 * np.sin(2 * np.pi * 2 * ff * t)
    # slow shimmer
    return tone * (0.85 + 0.15 * np.sin(2 * np.pi * 0.2 * t))


def piano_tone(f, n):
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return tone * np.exp(-t * 2.4) * envelope(n, 0.004, 0.05)


def lowpass(x, cutoff):
    # one-pole low-pass, vectorised through cumulative filtering in blocks
    alpha = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(0, len(x), 4096):
        block = x[i:i + 4096]
        out = np.empty_like(block)
        for j, v in enumerate(block):
            acc += alpha * (v - acc)
            out[j] = acc
        y[i:i + 4096] = out
    return y


def reverb(x, seconds=2.6, seed=0):
    rng = np.random.default_rng(seed)
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 6.5, n))
    ir[0] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return wet


def main():
    seconds = float(sys.argv[1])
    out = sys.argv[2]
    n = int(seconds * SR)
    pad = np.zeros(n)
    keys = np.zeros(n)
    bass = np.zeros(n)

    bars = int(np.ceil(seconds / BAR)) + 1
    for b in range(bars):
        chord = CHORDS[b % 4] if b < bars - 1 else CHORDS[0]
        start = int(b * BAR * SR)
        if start >= n:
            break
        # pad: overlapping bars for smooth changes
        length = min(int((BAR + 1.5) * SR), n - start)
        for m in chord[1:]:
            pad[start:start + length] += pad_tone(hz(m), length) * envelope(length, 1.2, 1.5) * 0.05
        # bass enters after two bars
        if b >= 2:
            bass[start:start + length] += np.sin(2 * np.pi * hz(chord[0] - 12) * np.arange(length) / SR) * envelope(length, 0.6, 1.2) * 0.10
        # piano arpeggio (eighth notes) enters after the first bar
        if b >= 1:
            pattern = [chord[1], chord[2], chord[3], chord[2] + 12, chord[3], chord[2], chord[1] + 12, chord[3]]
            for k, m in enumerate(pattern):
                s = start + int(k * BEAT / 2 * SR)
                if s >= n:
                    break
                ln = min(int(2.2 * SR), n - s)
                vel = 0.10 + 0.03 * ((k * 7 + b * 3) % 4) / 3
                keys[s:s + ln] += piano_tone(hz(m), ln) * vel

    pad = lowpass(pad, 1800)
    dry = pad + keys + bass
    left = dry * 0.75 + reverb(dry, seed=1) * 0.55
    right = dry * 0.75 + reverb(dry, seed=2) * 0.55
    stereo = np.stack([left, right], axis=1)

    # fades and level
    fade_in, fade_out = int(2.5 * SR), int(4.0 * SR)
    stereo[:fade_in] *= np.linspace(0, 1, fade_in)[:, None]
    stereo[-fade_out:] *= np.linspace(1, 0, fade_out)[:, None] ** 1.5
    stereo *= 0.5 / max(1e-9, np.max(np.abs(stereo)))

    data = (stereo * 32767).astype("<i2")
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"music: {seconds:.1f}s -> {out}")


if __name__ == "__main__":
    main()
