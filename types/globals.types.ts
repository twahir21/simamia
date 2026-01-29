export type AppError = {
  type: "LOAD" | "SAVE" | "SYNC";
  message: string;
  retry?: () => void;
};


export type ActionItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
};


export type ActionContext<T> = {
  module: "sales" | "stock" | "customers" | "orders";
  data: T[];
};
