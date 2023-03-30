import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * User
 *
 *
 */
export interface User extends SanityDocument {
  _type: "user";

  /**
   * UserName — `string`
   *
   *
   */
  userName?: string;

  /**
   * Image — `string`
   *
   *
   */
  image?: string;
}

/**
 * Pin
 *
 *
 */
export interface Pin extends SanityDocument {
  _type: "pin";

  /**
   * title — `string`
   *
   *
   */
  title?: string;

  /**
   * About — `string`
   *
   *
   */
  about?: string;

  /**
   * Destination — `url`
   *
   *
   */
  destination?: string;

  /**
   * Category — `string`
   *
   *
   */
  category?: string;

  /**
   * Image — `image`
   *
   *
   */
  image?: {
    _type: "image";
    asset: {
      _type: 'sanity.imageAsset';
      assetId: string;
      extension: string;
      metadata: SanityImageMetadata;
      mimeType: string;
      originalFilename: string;
      path: string;
      sha1hash: string;
      size: number;
      uploadId: string;
      url: string;
  };
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * UserId — `string`
   *
   *
   */
  userId?: string;

  /**
   * PostedBy — `postedBy`
   *
   *
   */
  postedBy?: PostedBy;

  /**
   * Save — `array`
   *
   *
   */
  save?: Array<SanityKeyed<Save>>;

  /**
   * Comments — `array`
   *
   *
   */
  comments?: Array<SanityKeyed<Comment>>;
}

/**
 * Comment
 *
 *
 */
export interface Comment extends SanityDocument {
  _type: "comment";

  /**
   * PostedBy — `postedBy`
   *
   *
   */
  postedBy?: PostedBy;

  /**
   * Comment — `string`
   *
   *
   */
  comment?: string;
}

/**
 * Save
 *
 *
 */
export interface Save extends SanityDocument {
  _type: "save";

  /**
   * PostedBy — `postedBy`
   *
   *
   */
  postedBy?: PostedBy;

  /**
   * UserId — `string`
   *
   *
   */
  userId?: string;
}

// export type PostedBy = SanityReference<User>;

export interface PostedBy extends SanityDocument {
  _type: "user";

  /**
   * UserName — `string`
   *
   *
   */
  userName?: string;

  /**
   * Image — `string`
   *
   *
   */
  image?: string;
}

export type Documents = User | Pin | Comment | Save;
