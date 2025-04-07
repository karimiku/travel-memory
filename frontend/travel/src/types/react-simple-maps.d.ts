declare module "react-simple-maps" {
  import { FC, ReactNode } from "react";

  interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
    };
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: any;
    children: (props: { geographies: GeographyData[] }) => ReactNode;
  }

  interface GeographyProps {
    geography: GeographyData;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    onClick?: () => void;
    style?: {
      default?: {
        outline?: string;
      };
      hover?: {
        fill?: string;
        outline?: string;
      };
      pressed?: {
        fill?: string;
        outline?: string;
      };
    };
  }

  interface GeographyData {
    rsmKey: string;
    properties: {
      name: string;
    };
  }

  export const ComposableMap: FC<ComposableMapProps>;
  export const Geographies: FC<GeographiesProps>;
  export const Geography: FC<GeographyProps>;
}
