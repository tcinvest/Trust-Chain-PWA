
interface Window {
  googleTranslateInit: () => void;
  google: {
    translate: {
      TranslateElement: new (
        options: { pageLanguage: string; autoDisplay: boolean },
        element: string
        ) => void;
    };
  };
};
