
interface Window {
  googleTranslateInit: () => void;
  google: {
    translate: {
      translateElement: new (
        options: { pageLanguage: string; autoDisplay: boolean },
        element: string
        ) => void;
    };
  };
};
