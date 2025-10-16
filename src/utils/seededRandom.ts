export function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function createSeededRandom(seed: number) {
  const rng = mulberry32(seed);

  return {
    random: () => rng(),
    randomRange: (min: number, max: number) => min + rng() * (max - min),
    jitter: (value: number, jitterPercent: number) => {
      const factor = 1 + (rng() * 2 - 1) * (jitterPercent / 100);
      return value * factor;
    }
  };
}
