declare module "picomatch" {
  interface PicomatchOptions {
    dot?: boolean
    nocase?: boolean
    contains?: boolean
  }
  type Matcher = (test: string) => boolean
  function picomatch(glob: string | string[], options?: PicomatchOptions): Matcher
  export = picomatch
}
