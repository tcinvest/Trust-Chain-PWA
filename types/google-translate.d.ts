interface Window {
  googleTranslateInit: () => void;
  google: {
    translate: {
      TranslateElement: {
        new (
          options: {
            pageLanguage: string;
            autoDisplay: boolean;
            layout?: unknown;
          },
          element: string
        ): void;
        InlineLayout: { SIMPLE: unknown };
      };
    };
  };
}
