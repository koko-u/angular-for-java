import { ParamMap } from '@angular/router';
import { Action, Actions, View } from '../models/action.model';

export const pickParam = (name: string) => {
  return (paramMap: ParamMap): number | undefined => {
    if (paramMap.has(name)) {
      const userId = Number(paramMap.get(name));
      if (isNaN(userId)) {
        return undefined;
      } else {
        return userId;
      }
    } else {
      return undefined;
    }
  };
};

export const action = (paramMap: ParamMap): Action => {
  const defaultAction: Action = View;

  if (paramMap.has('action')) {
    const action = paramMap.get('action');
    if (Actions.find((a) => a === action)) {
      return action as Action;
    } else {
      return defaultAction;
    }
  } else {
    return defaultAction;
  }
};
