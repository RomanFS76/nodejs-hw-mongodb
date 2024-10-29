export const ctrlWrapper = (controll) => {
    return async (req, res, next) => {
      try {
        await controll(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  };
