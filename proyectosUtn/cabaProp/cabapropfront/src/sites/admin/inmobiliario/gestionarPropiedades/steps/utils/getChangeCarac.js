export const getChangeCarac =
  (setData, setStepStatus) => (e, value, action) => {
    e.preventDefault();
    setData(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [value]:
          action === 'add'
            ? prev.characteristics[value] + 1
            : prev.characteristics[value] > 0
            ? prev.characteristics[value] - 1
            : 0
      }
    }));

    setStepStatus(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [value]:
          action === 'add'
            ? prev.characteristics[value] + 1
            : prev.characteristics[value] > 0
            ? prev.characteristics[value] - 1
            : 0
      }
    }));
  };
