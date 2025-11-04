/**
 * Version management and semver operations
 */

import semver, { type ReleaseType } from 'semver';
import type { VersionInfo } from './types.js';

/**
 * Parse release type from commit message
 * Supports: !release: major/minor/patch or !breaking
 */
export function parseReleaseType(message: string): ReleaseType | null {
  // Check for explicit release command
  const match = message.match(/!release:\s*(major|minor|patch)/i);
  if (match) {
    return match[1].toLowerCase() as ReleaseType;
  }

  // Check for breaking change marker
  if (message.includes('!breaking') || message.includes('BREAKING CHANGE:')) {
    return 'major';
  }

  return null;
}

/**
 * Calculate next version based on release type
 */
export function bumpVersion(
  lastVersion: string | undefined,
  releaseType: ReleaseType
): string {
  if (!lastVersion) {
    // First release
    switch (releaseType) {
      case 'major':
        return '1.0.0';
      case 'minor':
        return '0.1.0';
      case 'patch':
        return '0.0.1';
      default:
        return '0.1.0';
    }
  }

  const next = semver.inc(lastVersion, releaseType);
  if (!next) {
    throw new Error(`Failed to bump version from ${lastVersion} with type ${releaseType}`);
  }

  return next;
}

/**
 * Validate version string
 */
export function isValidVersion(version: string): boolean {
  return semver.valid(version) !== null;
}

/**
 * Compare two versions
 */
export function compareVersions(v1: string, v2: string): number {
  return semver.compare(v1, v2);
}

/**
 * Create version info object
 */
export function createVersionInfo(
  previous: string | undefined,
  releaseType: ReleaseType
): VersionInfo {
  const current = bumpVersion(previous, releaseType);
  return {
    previous,
    current,
    releaseType,
  };
}
