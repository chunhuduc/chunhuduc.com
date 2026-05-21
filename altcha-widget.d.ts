import type { CSSVariables, WidgetAttributes } from "altcha/types";

type AltchaWidgetElementProps = WidgetAttributes & {
  theme?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
  style?: Partial<CSSVariables>;
  suppressHydrationWarning?: boolean;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": AltchaWidgetElementProps;
    }
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": AltchaWidgetElementProps;
    }
  }
}
