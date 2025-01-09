export class VaultId {
  private readonly vaultId: string;

  constructor(vaultId: string) {
    if (typeof vaultId !== 'string') {
      throw new Error('valueObjects.vaultId.notAString');
    }
    if (vaultId.length > 36) {
      throw new Error('valueObjects.vaultId.tooLong');
    }
    const regex = /^[a-z0-9-]+$/;
    if (!regex.test(vaultId)) {
      throw new Error('valueObjects.vaultId.invalidCharacters');
    }
    this.vaultId = vaultId;
  }

  getValue(): string {
    return this.vaultId;
  }
}
