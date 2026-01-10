declare module "bwip-js" {
  interface BwipJsOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
    textxalign?: string;
    textsize?: number;
    [key: string]: unknown;
  }

  function toBuffer(options: BwipJsOptions): Promise<Buffer>;
  function toDataURL(options: BwipJsOptions): Promise<string>;

  export { toBuffer, toDataURL };
  export default { toBuffer, toDataURL };
}
