class Validation {
  static validateVersion(version) {
    const releaseTest = /^1\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?(?:-(pre|rc)([1-9]\d*))?$/; // also includes pre-releases and release candidates
    const snapshotTest = /^\d{2}w(0[1-9]|[1-4]\d|5[0-3])[a-z]$/;

    const newReleaseTest = /^\d{2}\.\d+$/;
    const newSnapshotTest = /^\d{2}\.\d+-snapshot-[1-9]\d*$/;
    const newPreReleaseTest = /^\d{2}\.\d+-pre-[1-9]\d*$/;
    const newRcTest = /^\d{2}\.\d+-rc-[1-9]\d*$/;

    if (
      (!releaseTest.test(version) &&
        !snapshotTest.test(version) &&
        !newReleaseTest.test(version) &&
        !newSnapshotTest.test(version) &&
        !newPreReleaseTest.test(version) &&
        !newRcTest.test(version)) ||
      !version
    )
      return false;
    return true; // TODO should it also return which was true? snapshot or release
  }

  static validateModloader(modloader) {
    const validModloaders = ["fabric", "forge", "neoforge", "quilt"];
    return validModloaders.includes(modloader.toLowerCase());
  }
}

export default Validation;
