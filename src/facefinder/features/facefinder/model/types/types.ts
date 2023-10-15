export interface Image {
    "pixels": Uint8Array,
    "nrows": number,
    "ncols": number,
    "ldim": number
}

export interface Iparams {
    "shiftfactor": number,
    "minsize": number,
    "maxsize": number,
    "scalefactor": number
}