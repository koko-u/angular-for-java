export const Create = 'create' as const;
export const Edit = 'edit' as const;
export const View = 'view' as const;
export const Actions = [Create, Edit, View] as const;

export type Action = typeof Actions[number];
