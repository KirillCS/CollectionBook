interface String {
  toCamelCase(): string;
}

String.prototype.toCamelCase = function (): string {
  return this.charAt(0).toLowerCase() + this.slice(1);
};